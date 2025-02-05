<script>
</script>

<div class="container">
    <div class="blue-box"></div>
    <div class="content">
        <h1>
            Entdecke die <span class="highlight">Lebensräume</span> <br /> der Wilden
            Tiere
        </h1>
        <p>
            Wie gut kennst du die wilden Tiere und ihre natürlichen Lebensräume?
            Stelle dein Wissen auf die Probe und entdecke spannende Fakten in
            einem interaktiven Spiel!
        </p>
        <button on:click={() => (window.location.hash = "#/explain")}
            >Teste dein Wissen</button
        >
    </div>
    <div class="illustration">
        <img
            src="/Explorer.png"
            alt="Illustration eines Forschers mit wilden Tieren"
        />
    </div>
</div>

<footer>
    <div class="footer-content">
        <p>&copy; 2025 Entdecke die Wildnis. Alle Rechte vorbehalten.</p>
        <div class="footer-links">
            <p>Impressum</p>
            <p>Datenschutz</p>
        </div>
    </div>
</footer>

<style>
    :root {
        --dark-blue: #003366;
        --hover-blue: #78b6d3;
        --background: #83cdf4;
    }

    :global(html, body) {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: Nunito, sans-serif;
    }

    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        background-size: cover;
        background-position: center;
        background-color: rgb(255, 255, 255);
    }

    .blue-box {
        position: absolute;
        top: 0;
        right: 0;
        width: 30%;
        height: 100%;
        background-color: var(--background);
        z-index: 0;
    }

    .illustration {
        position: relative;
        z-index: 1;
    }

    .illustration img {
        width: 1000px;
        max-width: 100%;
        margin-left: 650px;
        z-index: 1;
    }

    .content {
        display: flex;
        left: 0;
        top: 15%;
        left: 2.5%;
        position: absolute;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        max-width: 550px;
        padding: 3em;
        padding-left: 5em;
        text-align: left;
        z-index: 2;
        margin: 0 auto;
    }

    .content h1 {
        color: black;
        font-size: 2.5em;
        margin-bottom: 0.4em;
    }

    .highlight {
        color: var(--background);
    }

    .content p {
        max-width: 430px;
        color: black;
        font-size: 1.3em;
        margin-bottom: 2.2em;
    }
    .content button {
        padding: 15px 30px;
        background: var(--background);
        color: #ffffff;
        border: none;
        border-radius: 30px;
        font-size: 1.2em;
        cursor: pointer;
        align-self: flex-start;
        font-weight: bold;
        font-family: Nunito, sans-serif;
    }

    .content button:hover {
        background: var(--dark-blue);
        transform: scale(1.05);
    }

    footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        background: var(--footer-bg);
        color: var(--footer-text);
        text-align: center;
        padding: 15px 0;
        font-size: 1rem;
    }

    .footer-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .footer-links {
        display: flex;
        gap: 15px;
    }

    @media (max-width: 1080px) {
        .content {
            left: 1%;
        }

        .illustration img {
            width: 70%;
            max-width: 1000px;
            margin: 0 auto;
            margin-left: 450px;
        }

        .content h1 {
            margin-top: 80px;
            font-size: 1.9rem;
        }

        .content p {
            font-size: 1rem;
            max-width: 60%;
            margin-bottom: 1.5em;
        }

        .content button {
            font-size: 1rem;
            padding: 12px 24px;
        }

        .blue-box {
            position: absolute;
            top: 0;
            right: 0;
            width: 25%;
        }

        .footer-content {
            font-size: 0.8rem;
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }
    }
</style>
