document.addEventListener("DOMContentLoaded", () => {
    const headerRight = document.querySelector(".header-right");
    if (!headerRight) return;

    // remove previous dynamic links
    document.querySelectorAll(".dyn-item").forEach(a => a.remove());

    if (USER_LOGGED) {
        // Mon Compte
        const account = document.createElement("a");
        account.href = "/profile.php";
        account.textContent = "Mon Compte";
        account.classList.add("dyn-item");
        headerRight.appendChild(account);

        // Admin link
        if (ROLE_ID === "2") {
            const admin = document.createElement("a");
            admin.href = "/admin.php";
            admin.textContent = "Admin";
            admin.classList.add("dyn-item");
            admin.style.fontWeight = "bold";
            admin.style.color = "#005bbb";
            headerRight.appendChild(admin);
        }

        // Logout
        const logout = document.createElement("a");
        logout.href = "/auth/logout.php";
        logout.textContent = "Déconnexion";
        logout.classList.add("dyn-item");
        headerRight.appendChild(logout);

    } else {
        // Login
        const login = document.createElement("a");
        login.href = "/auth/login.php";
        login.textContent = "Se connecter";
        login.classList.add("dyn-item");
        headerRight.appendChild(login);
    }
});
