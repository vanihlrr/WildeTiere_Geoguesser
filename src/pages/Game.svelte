<script>
    import Sidebar from "../components/Sidebar.svelte";
    import WorldMap from "../components/WorldMap.svelte";
    import { onMount } from "svelte";
    import { animalsStore, currentAnimal, foundHabitats } from "../animalStore";
    import { get } from "svelte/store";
    import { score, resetScore } from "../store.js";
    import { writable } from "svelte/store";
    // import OpenAI from "openai";
    import ExitOverlay from "../components/ExitOverlay.svelte";

    let animals = [];
    let animal = null;
    let habitatPos = [{ latitude: 0, longitude: 0 }];

    let playedAnimals =
        JSON.parse(sessionStorage.getItem("playedAnimals")) || [];

    $: animalsStore.subscribe((data) => (animals = data));

    $: currentAnimal.subscribe((animal) => {
        if (animal && animal.habitats) {
            foundHabitats.set(new Array(animal.habitats.length).fill(false));
        }
    });

    function getRandomAnimal() {
        let availableAnimals = animals.filter(
            (a) => !playedAnimals.includes(a.name),
        );
        if (availableAnimals.length === 0) {
            playedAnimals = [];
            availableAnimals = [...animals];
        }

        const randomAnimal =
            availableAnimals[
                Math.floor(Math.random() * availableAnimals.length)
            ];
        playedAnimals.push(randomAnimal.name);
        sessionStorage.setItem("playedAnimals", JSON.stringify(playedAnimals));

        currentAnimal.set(randomAnimal);
        return randomAnimal;
    }

    onMount(() => {
        animal = getRandomAnimal();
        if (animal.habitats) {
            habitatPos = animal.habitats;
        } else {
            console.warn("Keine Lebensraumdaten für das Tier gefunden.");
        }
    });

    function confirmExit() {
        showExitOverlay = true;
    }

    function resetGame() {
        sessionStorage.removeItem("playedAnimals");
        playedAnimals = [];
        resetScore();
        getRandomAnimal();
    }

    let showExitOverlay = false;
</script>

<main>
    <button class="back-button" on:click={confirmExit}>
        ← Spiel beenden
    </button>
    <h2 class="score-display">Punkte: {$score}</h2>
    <h1 class="title">Wo lebt dieses Tier?</h1>
    <div class="layout">
        <Sidebar />
        <WorldMap {habitatPos} />
    </div>

    <ExitOverlay
        bind:showOverlay={showExitOverlay}
        on:exit={() => (window.location.hash = "#/")}
    />
</main>

<style>
    * {
        font-family: "Nunito", sans-serif;
    }

    :root {
        --dark-blue: #346087;
    }
    .title {
        position: relative;
        margin-top: 2%;
        font-size: 2rem;
        margin-bottom: 20px;
        text-align: center;
        color: #2a6f97;
    }
    .layout {
        display: flex;
        flex-direction: row;
        gap: 20px;
        justify-content: center;
        align-items: flex-start;
    }

    .back-button {
        position: absolute;
        top: 3%;
        left: 2%;
        padding: 10px 20px;
        font-size: 1rem;
        color: var(--dark-blue);
        background-color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
        z-index: 1;
    }

    .back-button:hover {
        background-color: var(--dark-blue);
        color: white;
        font-weight: bold;
    }

    .score-display {
        font-size: 1rem;
        font-weight: bold;
        color: #2a6f97;
        position: absolute;
        top: 1%;
        right: 20px;
        background: white;
        padding: 5px 15px;
        border-radius: 10px;
    }

    @media (max-width: 1080px) {
        .title {
            position: relative;
            margin-top: 4%;
            font-size: 1.6rem;
            margin-bottom: 10px;
            text-align: center;
            color: #2a6f97;
        }

        .back-button {
            position: absolute;
            top: 3%;
            left: 2%;
            padding: 10px 20px;
            font-size: 0.9rem;
            color: var(--dark-blue);
            background-color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease;
            z-index: 1;
        }
        .score-display {
            font-size: 0.9rem;
            font-weight: bold;
            color: #2a6f97;
            position: absolute;
            top: 2%;
            right: 25px;
            background: white;
            font-weight: medium;
            padding: 5px 15px;
            border-radius: 10px;
        }
    }
</style>
