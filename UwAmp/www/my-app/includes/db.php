<?php
// includes/db.php
$DB_HOST = 'localhost';
$DB_USER = 'root';         // adjust according to UwAmp config
$DB_PASS = 'root';             // likely empty for local
$DB_NAME = 'myapp';

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
if ($mysqli->connect_error) {
    die("DB Connection failed: " . $mysqli->connect_error);
}
$mysqli->set_charset("utf8mb4");
?>
