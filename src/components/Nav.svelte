<script>
    export let activePage = "/";
</script>

<nav>
    <a href="#/" class={activePage === "#/" ? "active" : ""}>Home</a>
    <a
        href="#/lebensraeume"
        class={activePage === "#/lebensraeume" ? "active" : ""}
    >
        Lebensräume
    </a>
    <a href="#/explain" class={activePage === "#/explain" ? "active" : ""}
        >Spiel</a
    >
    <a href="#/highscores" class={activePage === "#/highscores" ? "active" : ""}
        >Highscores</a
    >
</nav>

<style>
    :root {
        --dark-blue: #003366;
        --hover-blue: #1a528a;
    }
    nav {
        display: flex;
        gap: 30px;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        font-family: "Nunito", sans-serif;
    }

    nav a {
        text-decoration: none;
        color: var(--dark-blue);
        font-weight: normal;
        font-size: 1.2rem;
        padding: 5px 10px;
        position: relative;
    }

    nav a.active {
        font-weight: bold;
    }

    nav a.active::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: var(--dark-blue);
    }

    nav a:hover {
        color: var(--hover-blue);
    }

    @media (max-width: 1080px) {
        nav a {
            top: 3px;
            font-size: 1rem;
        }

        nav a.active::after {
            bottom: -3px;
        }
    }
</style>
