<?php
session_start();
if (!isset($_SESSION["username"])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Profil</title>
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
            <h1>Profil de <?= htmlspecialchars($_SESSION["username"]) ?></h1>

            <p>Rôle du compte :  
                <strong style="color: var(--primary-color);">
                    <?= htmlspecialchars($_SESSION["role"]) ?>
                </strong>
            </p>
        </div>
    </div>
</body>
</html>
