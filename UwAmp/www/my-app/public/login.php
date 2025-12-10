<?php
require_once __DIR__ . '/../includes/db.php';
session_start();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Connexion</title>
</head>

<body>
    <div class="header">
        <div class="button">
            <button><a href="index.php">Accueil</a></button>
        </div>
    </div>

    <div class="content auth-container">
        <div class="auth-box">
            <h2>Connexion</h2>

            <?php if (!empty($_GET["error"])): ?>
                <div class="error-msg"><?= htmlspecialchars($_GET["error"]) ?></div>
            <?php endif; ?>

            <form action="login_process.php" method="POST">
                <div class="form-group">
                    <label for="username">Nom d'utilisateur :</label>
                    <input type="text" name="username" required>
                </div>

                <div class="form-group">
                    <label for="password">Mot de passe :</label>
                    <input type="password" name="password" required>
                </div>

                <button type="submit">Se connecter</button>
            </form>

            <div class="toggle-link">
                Pas de compte ? <a href="register.php"><span>Créer un compte</span></a>
            </div>
        </div>
    </div>
</body>
</html>
