<?php
require_once __DIR__ . "/../includes/auth.php";

require_login(); // Only logged-in users can access project tracking
?>
<script>
    const USER_LOGGED = <?php echo isset($_SESSION["user_id"]) ? "true" : "false"; ?>;
    const USERNAME = "<?php echo isset($_SESSION['username']) ? $_SESSION['username'] : ''; ?>";
    const ROLE_ID = "<?php echo isset($_SESSION['role_id']) ? $_SESSION['role_id'] : ''; ?>";
</script>
<script src="/js/session_header.js"></script>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="images/ETML-logo.jpg">
    <title>Calculer le pourcentage des projets</title>
</head>
<body>
    <div class="header">
        <div class="button">

            <!-- Navigation -->
            <button><a href="index.php">Accueil</a></button>
            <button><a href="CalculNote.php">Notes</a></button>
            <button><a href="CalculProj.php">Projets</a></button>
            <button><a href="liens.php">Liens</a></button>
            <button><a href="modeles.php">Modèles</a></button>
            <button><a href="resume.php">Résumé</a></button>

            <!-- Admin Button -->
            <?php if ($_SESSION["role_name"] === "admin"): ?>
                <button style="background: darkred;">
                    <a style="color:white;" href="admin.php">Admin</a>
                </button>
            <?php endif; ?>

            <!-- Clock -->
            <button id="clock-btn"><div id="clock"></div></button>
            <button id="date-btn"><div id="date"></div></button>
            <button id="timer-btn"><div id="timer"></div></button>
            <button id="pause-btn"><div id="nextPause"></div></button>

            <!-- User / Logout -->
            <button><a href="profile.php">Compte (<?= htmlspecialchars($_SESSION['username']) ?>)</a></button>
            <button><a href="logout.php">Déconnexion</a></button>

        </div>
    </div>


    <div class="content">
        <main>
            <div class="CalculNote">
                <h1>Suivi des Projets</h1>

                <div class="input-group">
                    <label for="projectName">Nom du projet :</label>
                    <input type="text" id="projectName" placeholder="Nom du projet">
                </div>
            
                <div class="input-group">
                    <label for="periods">Nombre de périodes :</label>
                    <input type="number" id="periods" min="1" placeholder="Ex: 40">
                </div>
            
                <div class="input-group">
                    <label for="acquired">Acquis :</label>
                    <select id="acquired">
                        <option value="oui">Oui</option>
                        <option value="non">Non</option>
                    </select>
                </div>
            
                <button onclick="addProject()">Ajouter au tableau</button>
                <button onclick="calculatePercentage()" style="margin-top: 15px;">Calculer le pourcentage</button>
            
                <h2 class="result" id="result">Pourcentage acquis : -</h2>

                <table id="projectTable">
                    <thead>
                        <tr>
                            <th>Projet</th>
                            <th>Périodes</th>
                            <th>Acquis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- JS adds rows here -->
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    
    <!-- Your original scripts → still work -->
    <script src="js/database.js"></script>
    <script src="script.js"></script>
    <script src="script-fin.js"></script>
    <script src="script-proj.js"></script>
</body>
</html>
