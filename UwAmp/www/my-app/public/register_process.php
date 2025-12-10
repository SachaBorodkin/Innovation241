<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"]);
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $default_role = 1; // regular user

    // check username exists
    $check = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check->bind_param("s", $username);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "EXISTS";
        exit;
    }

    // insert user
    $stmt = $conn->prepare("INSERT INTO users (username, password_hash, role_id) VALUES (?, ?, ?)");
    $stmt->bind_param("ssi", $username, $password, $default_role);

    if ($stmt->execute()) {
        echo "SUCCESS";
        exit;
    }

    echo "ERROR";
    exit;
}
?>
