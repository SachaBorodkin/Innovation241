<?php
require_once __DIR__ . "/../includes/auth.php";

require_login(); // Only logged-in users can access this page
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
    <link rel="icon" href="images/ETML-logo.jpg">
    <title>Calculer la note</title>
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
                    <a style="color: white;" href="admin.php">Admin</a>
                </button>
            <?php endif; ?>

            <!-- Clock buttons -->
            <button id="clock-btn"><div id="clock"></div></button>
            <button id="date-btn"><div id="date"></div></button>
            <button id="timer-btn"><div id="timer"></div></button>
            <button id="pause-btn"><div id="nextPause"></div></button>

            <!-- Auth Zone -->
            <button><a href="profile.php">Compte (<?= htmlspecialchars($_SESSION['username']) ?>)</a></button>
            <button><a href="logout.php">Déconnexion</a></button>

        </div>
    </div>


    <div class="content">
        <main>
            <div class="CalculNote">
                <h1>Calculateur de Note</h1>

                <div id="input-container">
                    <div class="input-group">
                        <label for="mark">Note (1-6) :</label>
                        <input type="number" id="mark" step="0.1" min="1" max="6" placeholder="Ex: 5.0">
                    </div>

                    <div class="input-group">
                        <label for="percentage">Pourcentage (0-100) :</label>
                        <input type="number" id="percentage" min="0" max="100" placeholder="Ex: 20">
                    </div>

                    <button onclick="addInput()">Ajouter</button>
                </div>

                <button onclick="calculateFinalMark()" style="margin-top: 15px;">
                    Calculer la note finale
                </button>

                <div class="result" id="final-result">Note Finale : -</div>

                <h2>Historique</h2>
                <table id="marks-table">
                    <thead>
                        <tr>
                            <th>Note</th>
                            <th>Pourcentage</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- JS will insert rows here -->
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Scripts -->
    <script src="js/database.js"></script>
    <script src="script.js"></script>
    <script src="script-fin.js"></script>
    <script src="script-note.js"></script>
</body>
</html>
