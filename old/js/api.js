/**
 * School API Manager
 * Uses Fetch API to communicate with UWAMP/MySQL via PHP backend.
 */

const API_URL = 'php/api.php';

// --- API Utility Function ---
async function apiCall(action, data = {}) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, ...data }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (!result.success) {
        throw new Error(result.error || `Operation ${action} failed.`);
    }
    return result;
}

// --- USER AUTHENTICATION & ADMIN ---

async function checkUserCount() {
    const result = await apiCall('checkUserCount');
    return parseInt(result.count);
}

// Note: Admin validation logic is still client-side (as in original IndexedDB code)
async function verifyAdminCredentials(adminUser, adminPass) {
    const result = await apiCall('loginUser', { username: adminUser, password: adminPass });
    return result.user && result.user.role === 'admin';
}

async function registerUser(username, password, role, fullName, adminAuth = null) {
    // Step 1: Check if this is the VERY FIRST user (Bootstrap mode) or if admin validation is required
    const userCount = await checkUserCount();
    let finalRole = role;

    if (userCount === 0) {
        finalRole = 'admin'; 
    } else if (role === 'teacher') {
        if (!adminAuth || !adminAuth.user || !adminAuth.pass) {
            throw "Validation administrateur requise pour créer un compte enseignant.";
        }
        const isAdminValid = await verifyAdminCredentials(adminAuth.user, adminAuth.pass);
        if (!isAdminValid) {
            throw "Identifiants administrateur incorrects.";
        }
        finalRole = 'teacher';
    } else {
        finalRole = 'student';
    }

    // Step 2: Register User via API
    const result = await apiCall('registerUser', { 
        username, 
        password, 
        role: finalRole, 
        fullName 
    });

    return result.user;
}

async function loginUser(username, password) {
    const result = await apiCall('loginUser', { username, password });
    sessionStorage.setItem('currentUser', JSON.stringify(result.user));
    return result.user;
}

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// --- DATA MANAGEMENT (Grades/Settings) ---

async function addData(storeName, data) {
    // MySQL auto-increments the ID, which is returned by the API
    const result = await apiCall('addData', { storeName, data });
    return result.id; 
}

async function getDataByUser(storeName, username) {
    const result = await apiCall('getDataByUser', { storeName, username });
    return result.data;
}

async function getAllData(storeName) {
    const result = await apiCall('getAllData', { storeName });
    return result.data;
}

// Note: updateData is currently not used in the original files and will be omitted for simplicity.

async function deleteData(storeName, id) {
    await apiCall('deleteData', { storeName, id });
    // Returns successfully or throws an error on failure
}

// --- SETTINGS MANAGEMENT ---

async function saveSchedule(schedule) {
    await apiCall('saveSchedule', { schedule });
}

async function getSchedule() {
    try {
        const result = await apiCall('getSchedule');
        return result.schedule;
    } catch (e) {
        console.error("Error fetching schedule:", e);
        return null;
    }
}

// --- UI HELPERS (Unchanged from old database.js, moved here for script compatibility) ---

function updateAuthButton() {
    const user = getCurrentUser();
    const headerButtons = document.querySelector('.header .button');
    
    let authBtn = document.getElementById('auth-btn');
    if (!authBtn && headerButtons) {
        authBtn = document.createElement('button');
        authBtn.id = 'auth-btn';
        // Insert before the Accueil button
        const accueilBtn = document.querySelector('.header .button a[href="index.html"]').closest('button');
        headerButtons.insertBefore(authBtn, accueilBtn);
    }

    if (authBtn) {
        if (user) {
            let roleLabel = user.role === 'admin' ? 'Admin' : (user.role === 'teacher' ? 'Prof' : 'Élève');
            authBtn.innerHTML = `<a href="#" onclick="logoutUser(); return false;">Déconnexion (${user.username} - ${roleLabel})</a>`;
        } else {
            authBtn.innerHTML = `<a href="login.html">Connexion</a>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', updateAuthButton);