<?php
require_once __DIR__ . "/../includes/auth.php";
require_login();
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="style.css">
    <title>Modèles</title>
</head>
<body>

<div class="header">
    <div class="button">

        <button><a href="index.php">Accueil</a></button>
        <button><a href="CalculNote.php">Notes</a></button>
        <button><a href="CalculProj.php">Projets</a></button>
        <button><a href="liens.php">Liens</a></button>
        <button><a href="modeles.php">Modèles</a></button>
        <button><a href="resume.php">Résumé</a></button>

        <?php if ($_SESSION["role_name"] === "admin"): ?>
            <button style="background:darkred;"><a style="color:white;" href="admin.php">Admin</a></button>
        <?php endif; ?>

        <button id="clock-btn"><div id="clock"></div></button>
        <button id="date-btn"><div id="date"></div></button>
        <button id="timer-btn"><div id="timer"></div></button>
        <button id="pause-btn"><div id="nextPause"></div></button>

        <button><a href="profile.php">Compte (<?= htmlspecialchars($_SESSION['username']) ?>)</a></button>
        <button><a href="logout.php">Déconnexion</a></button>

    </div>
</div>

<div class="content">
    <main>
        <h1>Modèles PDF / Documents</h1>

        <ul>
            <li><a href="docs/modele1.pdf" download>Modèle 1</a></li>
            <li><a href="docs/modele2.docx" download>Modèle 2</a></li>
            <li><a href="docs/modele3.xlsx" download>Modèle 3</a></li>
        </ul>

    </main>
</div>

<script src="script.js"></script>
<script src="script-fin.js"></script>
</body>
</html>
