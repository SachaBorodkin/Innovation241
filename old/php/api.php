<?php
header('Content-Type: application/json');

// --- 1. Database Connection Configuration ---
define('DB_SERVER', 'localhost');
define('DB_USERNAME', 'root'); // Default UWAMP root user
define('DB_PASSWORD', 'root'); // Default UWAMP root password
define('DB_NAME', 'schooldb');

$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// --- 2. Request Handling ---
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['action'])) {
    echo json_encode(["success" => false, "error" => "No action specified."]);
    exit();
}

$action = $input['action'];

try {
    switch ($action) {
        // --- USER ACTIONS ---
        case 'checkUserCount':
            $result = checkUserCount($conn);
            echo json_encode(["success" => true, "count" => $result]);
            break;
        case 'loginUser':
            $result = loginUser($conn, $input['username'], $input['password']);
            echo json_encode($result);
            break;
        case 'registerUser':
            $result = registerUser($conn, $input);
            echo json_encode($result);
            break;
            
        // --- GRADES ACTIONS ---
        case 'getDataByUser':
        case 'getAllData':
            $store = $input['storeName'];
            $username = $input['username'] ?? null;
            $result = getStoreData($conn, $store, $username);
            echo json_encode(["success" => true, "data" => $result]);
            break;
        case 'addData':
            $store = $input['storeName'];
            $data = $input['data'];
            $result = addStoreData($conn, $store, $data);
            echo json_encode($result);
            break;
        case 'deleteData':
            $store = $input['storeName'];
            $id = $input['id'];
            $result = deleteStoreData($conn, $store, $id);
            echo json_encode($result);
            break;

        // --- SETTINGS ACTIONS ---
        case 'saveSchedule':
            $result = saveSetting($conn, 'course_schedule', $input['schedule']);
            echo json_encode($result);
            break;
        case 'getSchedule':
            $result = getSetting($conn, 'course_schedule');
            echo json_encode(["success" => true, "schedule" => $result]);
            break;

        default:
            echo json_encode(["success" => false, "error" => "Invalid action."]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

$conn->close();

// --- 3. Database Functions ---

function checkUserCount($conn) {
    $result = $conn->query("SELECT COUNT(*) AS count FROM users");
    return $result->fetch_assoc()['count'];
}

function loginUser($conn, $username, $password) {
    $stmt = $conn->prepare("SELECT username, password, role, fullName FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user && $user['password'] === $password) {
        unset($user['password']);
        return ["success" => true, "user" => $user];
    }
    return ["success" => false, "error" => "Nom d'utilisateur ou mot de passe incorrect."];
}

function registerUser($conn, $input) {
    // Simplified logic: The more complex IndexedDB logic for admin validation must be moved to JS.
    $username = $input['username'];
    $password = $input['password'];
    $role = $input['role'];
    $fullName = $input['fullName'];

    $count = checkUserCount($conn);
    $finalRole = ($count == 0) ? 'admin' : $role;
    
    // Check if user already exists
    $stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        $stmt->close();
        return ["success" => false, "error" => "Ce nom d'utilisateur existe déjà."];
    }
    $stmt->close();

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (username, password, role, fullName) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $username, $password, $finalRole, $fullName);
    if ($stmt->execute()) {
        $newUser = [
            "username" => $username,
            "role" => $finalRole,
            "fullName" => $fullName
        ];
        return ["success" => true, "user" => $newUser];
    } else {
        return ["success" => false, "error" => "Erreur lors de l'inscription."];
    }
}

// --- GENERIC DATA FUNCTIONS (Grades) ---

function getStoreData($conn, $store, $username) {
    $data = [];
    $query = "";
    $params = [];
    
    if ($store === 'grades') {
        if ($username) {
            $query = "SELECT id, username, mark, percentage FROM grades WHERE username = ?";
            $params = [$username];
        } else {
            // For getAllData (e.g., for teachers)
            $query = "SELECT id, username, mark, percentage FROM grades";
        }
    } else {
        throw new Exception("Store $store is not supported.");
    }
    
    $stmt = $conn->prepare($query);
    if (!empty($params)) {
        $stmt->bind_param(str_repeat('s', count($params)), ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        // Ensure numeric fields are correctly typed
        $row['id'] = (int)$row['id'];
        $row['mark'] = (float)$row['mark'];
        $row['percentage'] = (float)$row['percentage'];
        $data[] = $row;
    }
    $stmt->close();
    return $data;
}

function addStoreData($conn, $store, $data) {
    if ($store === 'grades') {
        $stmt = $conn->prepare("INSERT INTO grades (username, mark, percentage) VALUES (?, ?, ?)");
        $stmt->bind_param("sdd", $data['username'], $data['mark'], $data['percentage']);
        if ($stmt->execute()) {
            return ["success" => true, "id" => $conn->insert_id];
        } else {
            return ["success" => false, "error" => "Erreur lors de l'ajout de la note."];
        }
    }
    throw new Exception("Store $store is not supported for adding data.");
}

function deleteStoreData($conn, $store, $id) {
    if ($store === 'grades') {
        $stmt = $conn->prepare("DELETE FROM grades WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            return ["success" => true];
        } else {
            return ["success" => false, "error" => "Erreur lors de la suppression de la note."];
        }
    }
    throw new Exception("Store $store is not supported for deletion.");
}

// --- SETTINGS FUNCTIONS (Schedule) ---

function saveSetting($conn, $key, $value) {
    $jsonValue = json_encode($value);
    $stmt = $conn->prepare("INSERT INTO settings (key_name, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = ?");
    $stmt->bind_param("sss", $key, $jsonValue, $jsonValue);
    if ($stmt->execute()) {
        return ["success" => true];
    } else {
        return ["success" => false, "error" => "Erreur lors de la sauvegarde du paramètre."];
    }
}

function getSetting($conn, $key) {
    $stmt = $conn->prepare("SELECT value_json FROM settings WHERE key_name = ?");
    $stmt->bind_param("s", $key);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        return json_decode($row['value_json'], true);
    }
    return null;
}