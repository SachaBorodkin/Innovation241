<?php
require_once __DIR__ . '/../includes/db.php';
session_start();

if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
    header("Location: login.php?error=Accès refusé");
    exit;
}

$users = $mysqli->query("
    SELECT users.id, username, role_name 
    FROM users 
    JOIN roles ON users.role_id = roles.id
");
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Admin Panel</title>
</head>

<body>
    <div class="header">
        <div class="button">
            <button><a href="index.php">Accueil</a></button>
            <button><a href="logout.php">Déconnexion</a></button>
        </div>
    </div>

    <div class="content">
        <div class="Accueil">
            <h1>Espace Administrateur</h1>
            <p>Gestion des utilisateurs inscrits :</p>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom d’utilisateur</th>
                        <th>Rôle</th>
                    </tr>
                </thead>

                <tbody>
                    <?php while ($user = $users->fetch_assoc()): ?>
                    <tr>
                        <td><?= $user["id"] ?></td>
                        <td><?= htmlspecialchars($user["username"]) ?></td>
                        <td><?= htmlspecialchars($user["role_name"]) ?></td>
                    </tr>
                    <?php endwhile; ?>
                </tbody>

            </table>
        </div>
    </div>
</body>
</html>
