<?php
session_start();
require_once __DIR__ . '/../includes/db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    $stmt = $conn->prepare("SELECT id, username, password_hash, role_id FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $username_db, $hash, $role_id);
        $stmt->fetch();

        if (password_verify($password, $hash)) {

            $_SESSION["user_id"] = $id;
            $_SESSION["username"] = $username_db;
            $_SESSION["role_id"] = $role_id;

            echo "SUCCESS";
            exit;
        }
    }

    echo "ERROR";
    exit;
}
?>
