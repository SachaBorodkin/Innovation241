// New file content for js/database.js

// --- CONFIGURATION ---
const DB_PREFIX = 'SchoolDB_';
const STORE_USERS = 'users';
const STORE_GRADES = 'grades';
const STORE_PROJECTS = 'projects';
const STORE_DAILY_PLAN = 'daily_plan';
const STORE_SETTINGS = 'settings';

// --- UTILITY FUNCTIONS FOR LOCALSTORAGE MAPPING ---

/**
 * Reads all data for a given store key from localStorage and parses it as an object/array.
 * If no data exists, initializes with a default structure.
 * @param {string} storeName 
 * @returns {object|array}
 */
function readStore(storeName) {
    const key = DB_PREFIX + storeName;
    const dataStr = localStorage.getItem(key);
    if (!dataStr) {
        // Default structure: array for data stores (grades, projects), object for users/settings
        if (storeName === STORE_USERS || storeName === STORE_SETTINGS) {
            return {};
        }
        return [];
    }
    try {
        return JSON.parse(dataStr);
    } catch (e) {
        console.error(`Error parsing data for store ${storeName}:`, e);
        if (storeName === STORE_USERS || storeName === STORE_SETTINGS) {
            return {};
        }
        return [];
    }
}

/**
 * Serializes the data and saves it back to the given store key in localStorage.
 * @param {string} storeName 
 * @param {object|array} data 
 */
function writeStore(storeName, data) {
    const key = DB_PREFIX + storeName;
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Gets the next ID and increments the counter for a store that uses autoIncrement.
 * @param {string} storeName 
 * @returns {number}
 */
function getNextId(storeName) {
    const counterKey = DB_PREFIX + storeName + '_id_counter';
    let nextId = parseInt(localStorage.getItem(counterKey) || '1');
    localStorage.setItem(counterKey, String(nextId + 1));
    return nextId;
}

// --- INITIALIZATION (IndexedDB replaced by synchronous localStorage) ---

function initDB() {
    return Promise.resolve(true);
}

// --- SETTINGS MANAGEMENT ---

async function saveSchedule(schedule) {
    return new Promise((resolve) => {
        const settings = readStore(STORE_SETTINGS);
        settings['course_schedule'] = schedule;
        writeStore(STORE_SETTINGS, settings);
        resolve(true);
    });
}

async function getSchedule() {
    return new Promise((resolve) => {
        const settings = readStore(STORE_SETTINGS);
        resolve(settings['course_schedule'] || null);
    });
}

// --- USER AUTHENTICATION & ADMIN ---

async function checkUserCount() {
    return new Promise((resolve) => {
        const users = readStore(STORE_USERS);
        resolve(Object.keys(users).length);
    });
}

async function verifyAdminCredentials(adminUser, adminPass) {
    return new Promise((resolve) => {
        const users = readStore(STORE_USERS);
        const user = users[adminUser];

        // Check if user exists, password matches, and role is admin
        resolve(!!(user && user.password === adminPass && user.role === 'admin'));
    });
}

async function registerUser(username, password, role, fullName, adminAuth = null) {
    await initDB(); 
    
    const users = readStore(STORE_USERS);

    if (users[username]) {
        throw "Ce nom d'utilisateur existe déjà.";
    }

    const userCount = Object.keys(users).length;
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
    } else {
        finalRole = 'student';
    }

    const newUser = { 
        username, 
        password, 
        role: finalRole, 
        fullName, 
        createdAt: new Date().toISOString()
    };
    
    users[username] = newUser;
    writeStore(STORE_USERS, users);
    
    return newUser;
}

async function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        const users = readStore(STORE_USERS);
        const user = users[username];

        if (user && user.password === password) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            resolve(user);
        } else {
            reject("Nom d'utilisateur ou mot de passe incorrect.");
        }
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
    return new Promise((resolve, reject) => {
        try {
            const store = readStore(storeName);
            const newItem = { ...data };

            if (storeName === STORE_USERS || storeName === STORE_SETTINGS) {
                 return reject("addData not supported for this store type in localStorage implementation.");
            }
            
            newItem.id = getNextId(storeName);
            store.push(newItem);
            writeStore(storeName, store);
            resolve(newItem.id);
        } catch (e) {
            reject("Erreur lors de l'ajout: " + e.message);
        }
    });
}

async function getDataByUser(storeName, username) {
    return new Promise((resolve, reject) => {
        try {
            const store = readStore(storeName);

            if (!Array.isArray(store)) {
                return reject("getDataByUser only works for array-based stores.");
            }

            resolve(store.filter(item => item.username === username));
        } catch (e) {
            reject("Erreur lors de la récupération: " + e.message);
        }
    });
}

async function getAllData(storeName) {
    return new Promise((resolve) => {
        resolve(readStore(storeName));
    });
}

async function updateData(storeName, data) {
     return new Promise((resolve, reject) => {
        try {
            const store = readStore(storeName);
            const idToUpdate = data.id;

            if (!idToUpdate) {
                throw new Error("Missing ID for update.");
            }

            if (Array.isArray(store)) {
                const index = store.findIndex(item => item.id === idToUpdate);
                if (index > -1) {
                    store[index] = data;
                    writeStore(storeName, store);
                    resolve(idToUpdate);
                } else {
                    reject("Item not found for update.");
                }
            } else if (storeName === STORE_SETTINGS && data.key) {
                store[data.key] = data.value;
                writeStore(STORE_SETTINGS, store);
                resolve(data.key);
            } else {
                 reject("updateData not supported for this store type or data structure.");
            }
        } catch (e) {
            reject("Erreur update: " + e.message);
        }
     });
}

async function deleteData(storeName, id) {
    return new Promise((resolve, reject) => {
        try {
            const store = readStore(storeName);
            
            if (!Array.isArray(store)) {
                return reject("deleteData only works for array-based stores.");
            }

            const initialLength = store.length;
            const newStore = store.filter(item => item.id !== id);

            if (newStore.length === initialLength) {
                return reject("Item not found for deletion.");
            }
            
            writeStore(storeName, newStore);
            resolve();
        } catch (e) {
             reject("Erreur suppression: " + e.message);
        }
    });
}

// --- NEW EXPORT FUNCTION TO CREATE database.json ---
function exportDatabaseToJson() {
    const data = {};
    const stores = [STORE_USERS, STORE_GRADES, STORE_PROJECTS, STORE_DAILY_PLAN, STORE_SETTINGS];

    // 1. Gather all relevant localStorage data
    stores.forEach(storeName => {
        // Use a simpler key for the final JSON structure
        data[storeName] = readStore(storeName);
    });

    // 2. Add ID counters for completeness/backup
    stores.forEach(storeName => {
        const counterKey = DB_PREFIX + storeName + '_id_counter';
        const counterValue = localStorage.getItem(counterKey) || '1';
        data[`${storeName}_id_counter`] = parseInt(counterValue);
    });
    
    // 3. Serialize and create Blob
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // 4. Create and click hidden link to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Provide immediate feedback
    alert("Base de données exportée dans database.json !");
}


// --- UI HELPERS (Original logic preserved) ---
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