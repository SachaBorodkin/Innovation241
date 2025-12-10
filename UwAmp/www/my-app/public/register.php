<?php
require_once __DIR__ . '/../includes/db.php';
session_start();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Inscription</title>
</head>

<body>
    <div class="header">
        <div class="button">
            <button><a href="index.php">Accueil</a></button>
        </div>
    </div>

    <div class="content auth-container">
        <div class="auth-box">
            <h2>Créer un compte</h2>

            <form action="register_process.php" method="POST">

                <div class="form-group">
                    <label for="username">Nom d'utilisateur :</label>
                    <input type="text" name="username" required>
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe :</label>
                    <input type="password" name="password" required>
                </div>

                <div class="admin-validation-box">
                    <h4>Rôle du compte</h4>
                    <select name="role">
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                    </select>
                </div>

                <button type="submit">Créer le compte</button>
            </form>

            <div class="toggle-link">
                Déjà un compte ? <a href="login.php"><span>Se connecter</span></a>
            </div>

        </div>
    </div>
</body>
</html>
