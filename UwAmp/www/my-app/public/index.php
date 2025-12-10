<?php
require_once __DIR__ . "/../includes/auth.php";

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="images/ETML-logo.jpg">
    <title>Accueil</title>
</head>
<body>
    <div class="header">
        <div class="button">

            <!-- Navigation -->
            <button><a href="index.php">Accueil</a></button>

            <?php if (is_logged_in()): ?>
                <button><a href="CalculNote.php">Notes</a></button>
                <button><a href="CalculProj.php">Projets</a></button>
                <button><a href="liens.php">Liens</a></button>
                <button><a href="modeles.php">Modèles</a></button>
                <button><a href="resume.php">Résumé</a></button>

                <?php if ($_SESSION['role_name'] === "admin"): ?>
                    <button style="background: darkred; color:white;">
                        <a style="color:white;" href="admin.php">Admin</a>
                    </button>
                <?php endif; ?>
            <?php else: ?>
                <!-- Hide pages requiring login -->
            <?php endif; ?>


            <!-- Clock / Date / Timer -->
            <button id="clock-btn"><div id="clock"></div></button>
            <button id="date-btn"><div id="date"></div></button>
            <button id="timer-btn"><div id="timer"></div></button>
            <button id="pause-btn"><div id="nextPause"></div></button>

            <!-- Auth Zone -->
            <?php if (!is_logged_in()): ?>
                <button><a href="login.php">Se connecter</a></button>
                <button><a href="register.php">Créer un compte</a></button>
            <?php else: ?>
                <button><a href="profile.php">Mon compte (<?= htmlspecialchars($_SESSION['username']) ?>)</a></button>
                <button><a href="logout.php">Se déconnecter</a></button>
            <?php endif; ?>

        </div>
    </div>


    <div class="content">
        <main>
            <div class="Accueil">
                <h1>Bienvenue sur ce site de gestion d'étude</h1>
                
                <p>Ce site regroupe des outils utiles pour vos études :</p>
                <ul>
                    <li>Calculer vos moyennes et notes</li>
                    <li>Suivre l'avancement de vos projets</li>
                    <li>Accéder aux liens et modèles importants</li>
                </ul>

                <br>

                <?php if (!is_logged_in()): ?>
                    <p style="color: var(--primary-color); font-weight: bold;">
                        Nouveau : Système de compte local !  
                        <a href="login.php">Connectez-vous</a> pour sauvegarder vos données.
                    </p>
                <?php else: ?>
                    <p style="color: var(--primary-color); font-weight: bold;">
                        Bonjour <strong><?= htmlspecialchars($_SESSION['username']) ?></strong> 👋  
                        Vos données sont maintenant enregistrées localement !
                    </p>
                <?php endif; ?>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="script.js"></script>
    <script src="script-fin.js"></script>
</body>
</html>
