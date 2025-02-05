<script>
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let highscores = writable([]);

    onMount(() => {
        let storedScores = JSON.parse(localStorage.getItem("highscores")) || [];
        storedScores.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return b.animalsFound - a.animalsFound;
        });
        highscores.set(storedScores);
    });
</script>

<main class="container">
    <h1 class="title">Highscore</h1>

    <div class="highscore-list">
        {#each $highscores as entry, i}
            <div class="highscore-item {i === 0 ? 'first-place' : ''}">
                <span class="rank">{i + 1}.</span>
                {#if i === 0}
                    <img src="/Trophy.png" alt="Trophäe" class="trophy" />
                {/if}
                <span class="player-name">{entry.name}</span>
                <span class="score">{entry.points} Punkte</span>
                <span class="animals">{entry.animalsFound} Tiere erraten</span>
            </div>
        {/each}
    </div>
</main>

<style>
    * {
        font-family: "Nunito", sans-serif;
    }

    .container {
        text-align: center;
        padding: 40px;
        background-color: inherit;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        color: #346087;
        margin-top: 40px;
        margin-bottom: 20px;
        position: sticky;
        top: 0;
        padding: 10px 0;
        width: 100%;
        z-index: 10;
    }

    /* Scrollbare Highscore-Liste */
    .highscore-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        max-height: 400px;
        overflow-y: auto;
        width: 100%;
        padding: 10px;
    }

    .highscore-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        padding: 15px 30px;
        width: 60%;
        max-width: 700px;
        border-radius: 50px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        font-size: 1.2rem;
        font-weight: bold;
    }

    /* Der erste Platz bekommt nur mehr Padding */
    .first-place {
        padding: 20px 40px;
    }

    .rank {
        color: #346087;
        font-weight: bold;
        margin-right: 15px;
        font-size: 1.3rem;
    }

    .trophy {
        width: 30px;
        height: 30px;
        margin-right: 10px;
    }

    .player-name {
        flex: 1;
        text-align: left;
        font-weight: bold;
    }

    .score,
    .animals {
        margin-left: 20px;
        color: #666;
    }

    .highscore-list::-webkit-scrollbar {
        width: 8px;
    }

    .highscore-list::-webkit-scrollbar-track {
        background: #f0f0f0;
        border-radius: 10px;
    }

    .highscore-list::-webkit-scrollbar-thumb {
        background: #74b2e2;
        border-radius: 10px;
    }

    .highscore-list::-webkit-scrollbar-thumb:hover {
        background: #346087;
    }

    @media (max-width: 1080px) {
        .title {
            font-size: 2rem;
            margin-bottom: 20px;
            margin-top: 40px;
            position: sticky;
            top: 0;
            padding: 10px 0;
            width: 100%;
            z-index: 10;
        }

        .highscore-list {
            max-height: 300px;
            width: 80%;
        }

        .highscore-item {
            width: 100%;
            padding: 15px 20px;
            font-size: 1rem;
        }

        .first-place {
            padding: 20px 30px;
        }

        .trophy {
            width: 25px;
            height: 25px;
        }

        .rank {
            font-size: 1.1rem;
            margin-right: 10px;
        }

        .score,
        .animals {
            margin-left: 10px;
        }
    }
</style>
