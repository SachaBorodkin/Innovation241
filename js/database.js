/**
 * SchoolDB Manager
 * Uses IndexedDB to store Users, Grades, Projects, Daily Plan, and Settings.
 */

const DB_NAME = 'SchoolDB';
const DB_VERSION = 3; 

// Store Names
const STORE_USERS = 'users';
const STORE_GRADES = 'grades';
const STORE_PROJECTS = 'projects';
const STORE_DAILY_PLAN = 'daily_plan';
const STORE_SETTINGS = 'settings'; 

let db;

// --- DATABASE INITIALIZATION ---

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("Database error: " + event.target.errorCode);
            reject("Error loading database.");
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_USERS)) {
                db.createObjectStore(STORE_USERS, { keyPath: 'username' });
            }
            if (!db.objectStoreNames.contains(STORE_GRADES)) {
                const store = db.createObjectStore(STORE_GRADES, { keyPath: 'id', autoIncrement: true });
                store.createIndex('username', 'username', { unique: false });
            }
            if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
                const store = db.createObjectStore(STORE_PROJECTS, { keyPath: 'id', autoIncrement: true });
                store.createIndex('username', 'username', { unique: false });
            }
            if (!db.objectStoreNames.contains(STORE_DAILY_PLAN)) {
                const store = db.createObjectStore(STORE_DAILY_PLAN, { keyPath: 'id', autoIncrement: true });
                store.createIndex('username', 'username', { unique: false });
            }
            if (!db.objectStoreNames.contains(STORE_SETTINGS)) {
                db.createObjectStore(STORE_SETTINGS, { keyPath: 'key' });
            }
        };
    });
}

// --- SETTINGS MANAGEMENT ---

async function saveSchedule(schedule) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SETTINGS], 'readwrite');
        const store = transaction.objectStore(STORE_SETTINGS);
        const item = { key: 'course_schedule', value: schedule };
        const request = store.put(item);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject("Error saving schedule");
    });
}

async function getSchedule() {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_SETTINGS], 'readonly');
        const store = transaction.objectStore(STORE_SETTINGS);
        const request = store.get('course_schedule');
        request.onsuccess = () => {
            resolve(request.result ? request.result.value : null);
        };
        request.onerror = () => reject("Error getting schedule");
    });
}

// --- USER AUTHENTICATION & ADMIN ---

async function checkUserCount() {
    await initDB();
    return new Promise((resolve) => {
        const transaction = db.transaction([STORE_USERS], 'readonly');
        const store = transaction.objectStore(STORE_USERS);
        const countRequest = store.count();
        countRequest.onsuccess = () => resolve(countRequest.result);
    });
}

async function verifyAdminCredentials(adminUser, adminPass) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_USERS], 'readonly');
        const store = transaction.objectStore(STORE_USERS);
        const request = store.get(adminUser);

        request.onsuccess = () => {
            const user = request.result;
            // Check if user exists, password matches, and role is admin
            if (user && user.password === adminPass && user.role === 'admin') {
                resolve(true);
            } else {
                resolve(false);
            }
        };
        request.onerror = () => resolve(false);
    });
}

async function registerUser(username, password, role, fullName, adminAuth = null) {
    await initDB(); 
    
    // 1. Check if username exists
    const userExists = await new Promise((resolve) => {
        const transaction = db.transaction([STORE_USERS], 'readonly');
        const store = transaction.objectStore(STORE_USERS);
        const req = store.get(username);
        req.onsuccess = () => resolve(req.result);
    });

    if (userExists) throw "Ce nom d'utilisateur existe déjà.";

    // 2. Determine Role logic
    const userCount = await checkUserCount();
    let finalRole = role;

    if (userCount === 0) {
        // First user is ALWAYS Admin
        finalRole = 'admin'; 
    } else if (role === 'teacher') {
        // Must validate admin credentials
        if (!adminAuth || !adminAuth.user || !adminAuth.pass) {
            throw "Validation administrateur requise pour créer un compte enseignant.";
        }
        const isAdminValid = await verifyAdminCredentials(adminAuth.user, adminAuth.pass);
        if (!isAdminValid) {
            throw "Identifiants administrateur incorrects.";
        }
    } else {
        // Default to student if they try to be funny
        finalRole = 'student';
    }

    // 3. Create User
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_USERS], 'readwrite');
        const store = transaction.objectStore(STORE_USERS);
        const newUser = { 
            username, 
            password, 
            role: finalRole, 
            fullName, 
            createdAt: new Date() 
        };
        const addRequest = store.add(newUser);
        addRequest.onsuccess = () => resolve(newUser);
        addRequest.onerror = () => reject("Erreur lors de l'inscription.");
    });
}

async function loginUser(username, password) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_USERS], 'readonly');
        const store = transaction.objectStore(STORE_USERS);
        const request = store.get(username);

        request.onsuccess = () => {
            const user = request.result;
            if (user && user.password === password) {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                resolve(user);
            } else {
                reject("Nom d'utilisateur ou mot de passe incorrect.");
            }
        };
        request.onerror = () => reject("Erreur de connexion.");
    });
}

function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// --- DATA MANAGEMENT (Generic) ---

async function addData(storeName, data) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erreur lors de l'ajout.");
    });
}

async function getDataByUser(storeName, username) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const index = store.index('username');
        const request = index.getAll(username);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erreur lors de la récupération.");
    });
}

async function getAllData(storeName) {
     await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
    });
}

async function updateData(storeName, data) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Erreur update.");
    });
}

async function deleteData(storeName, id) {
    await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject("Erreur suppression.");
    });
}

// --- UI HELPERS ---
function updateAuthButton() {
    const user = getCurrentUser();
    const headerButtons = document.querySelector('.header .button');
    
    let authBtn = document.getElementById('auth-btn');
    if (!authBtn && headerButtons) {
        authBtn = document.createElement('button');
        authBtn.id = 'auth-btn';
        headerButtons.insertBefore(authBtn, headerButtons.firstChild);
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