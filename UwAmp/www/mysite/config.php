<?php
// Database configuration for Innovation241
$host = 'localhost';
$dbname = 'innovation241';
$username = 'root';
$password = 'root'; // Default UwAmp password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// Start session
session_start();

// Helper function to check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Helper function to check if user is teacher
function isTeacher() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'teacher';
}

// Helper function to require login
function requireLogin() {
    if(!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

// Helper function to require teacher access
function requireTeacher() {
    requireLogin();
    if(!isTeacher()) {
        header('Location: dashboard.php');
        exit;
    }
}
?>