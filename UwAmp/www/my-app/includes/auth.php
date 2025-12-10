<?php
// includes/auth.php
session_start();

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function require_login() {
    if (!is_logged_in()) {
        header("Location: login.php");
        exit;
    }
}

function require_role($role_name) {
    if (!isset($_SESSION['role_name']) || $_SESSION['role_name'] !== $role_name) {
        header("HTTP/1.1 403 Forbidden");
        echo "Forbidden";
        exit;
    }
}
?>
