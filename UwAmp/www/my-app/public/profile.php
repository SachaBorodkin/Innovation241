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
<script>
    const USER_LOGGED = <?php echo isset($_SESSION["user_id"]) ? "true" : "false"; ?>;
    const USERNAME = "<?php echo isset($_SESSION['username']) ? $_SESSION['username'] : ''; ?>";
    const ROLE_ID = "<?php echo isset($_SESSION['role_id']) ? $_SESSION['role_id'] : ''; ?>";
</script>
<script src="session_header.js"></script>
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
