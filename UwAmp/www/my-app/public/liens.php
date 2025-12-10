<?php
require_once __DIR__ . "/../includes/auth.php";

require_login();
?>
<script>
    const USER_LOGGED = <?php echo isset($_SESSION["user_id"]) ? "true" : "false"; ?>;
    const USERNAME = "<?php echo isset($_SESSION['username']) ? $_SESSION['username'] : ''; ?>";
    const ROLE_ID = "<?php echo isset($_SESSION['role_id']) ? $_SESSION['role_id'] : ''; ?>";
</script>
<script src="session_header.js"></script>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>Liens importants</title>
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
        <h1>Liens importants</h1>

        <ul>
            <li><a href="https://www.etml.ch" target="_blank">Site de l'ETML</a></li>
            <li><a href="#" target="_blank">Lien 2</a></li>
            <li><a href="#" target="_blank">Lien 3</a></li>
        </ul>

    </main>
</div>

<script src="script.js"></script>
<script src="script-fin.js"></script>
</body>
</html>
