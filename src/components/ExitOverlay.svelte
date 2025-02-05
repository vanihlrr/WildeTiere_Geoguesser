<script>
    import { createEventDispatcher } from "svelte";
    import { writable, get } from "svelte/store";
    import { score, foundAnimals, resetScore } from "../store.js";

    export let showOverlay = false;
    let isFadingOut = writable(false);
    let playerName = "";

    const dispatch = createEventDispatcher();

    function closeOverlay() {
        isFadingOut.set(true);
        setTimeout(() => {
            showOverlay = false;
            isFadingOut.set(false);
        }, 300);
    }

    function exitGame() {
        resetScore();
        dispatch("exit");
        closeOverlay();
    }

    function saveScore() {
        if (playerName.trim() === "") return;

        let highscores = JSON.parse(localStorage.getItem("highscores")) || [];
        highscores.push({
            name: playerName,
            points: get(score),
            animalsFound: get(foundAnimals),
        });

        highscores.sort((a, b) => b.points - a.points);
        localStorage.setItem("highscores", JSON.stringify(highscores));

        resetScore();
        dispatch("exit");
        closeOverlay();
    }
</script>

{#if showOverlay}
    <div class="overlay {$isFadingOut ? 'fade-out' : ''}">
        <div class="confirm-box">
            <!-- X-Button oben links -->
            <button class="close-btn" on:click={closeOverlay}>×</button>

            <h2>Spiel beenden</h2>

            <p class="info-text">Willst du deine Punkte speichern?</p>

            <input
                type="text"
                bind:value={playerName}
                placeholder="Dein Name"
            />

            <div class="button-group">
                <button class="exit" on:click={exitGame}>
                    Nicht speichern
                </button>
                <button class="save" on:click={saveScore}>
                    Punkte speichern
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        padding: 20px;
    }

    .overlay.fade-out {
        animation: fadeOut 0.3s ease-out forwards;
    }

    .confirm-box {
        position: relative;
        background: white;
        padding: 25px 30px;
        border-radius: 14px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        text-align: center;
        width: 370px;
        animation: slideIn 0.3s ease-out;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .confirm-box h2 {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--dark-blue);
        margin-bottom: 10px;
    }

    .info-text {
        font-size: 1rem;
        color: #555;
        margin-bottom: 12px;
    }

    .confirm-box input {
        width: 70%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 6px;
        text-align: center;
        font-size: 1rem;
        margin-bottom: 30px;
    }

    .button-group {
        display: flex;
        justify-content: space-between;
        width: 100%;
        gap: 10px;
    }

    .save,
    .exit {
        flex: 1;
        padding: 12px;
        border-radius: 50px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        transition: 0.3s;
        text-align: center;
    }

    .save {
        background-color: var(--dark-blue);
        color: white;
        border: none;
    }

    .save:hover {
        background-color: var(--hover-color);
    }

    .exit {
        border: 2px solid var(--dark-blue);
        color: var(--dark-blue);
        background-color: transparent;
    }

    .exit:hover {
        background-color: var(--hover-color);
        color: white;
        border: 2px solid var(--hover-color);
    }

    .close-btn {
        position: absolute;
        top: 10px;
        left: 10px;
        background: none;
        border: none;
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        color: #888;
        transition: 0.2s;
    }

    .close-btn:hover {
        color: var(--dark-blue);
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
</style>
