<script>
    import OpenAI from "openai";
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { currentAnimal } from "../animalStore";
    import { get } from "svelte/store";
    import { resetScore } from "../store.js";
    import ExitOverlay from "../components/ExitOverlay.svelte";

    let animal = null;
    let showConfirmExit = writable(false);
    let isFadingOut = writable(false);
    let isLoading = writable(true);
    let showExitOverlay = writable(false);

    console.log(animal);
    let generalInfo = "";
    let facts = "";
    let habitatInfo = "";

    let screenWidth = writable(window.innerWidth);
    let screenHeight = writable(window.innerHeight);

    function updateScreenSize() {
        screenWidth.set(window.innerWidth);
        screenHeight.set(window.innerHeight);
    }

    onMount(() => {
        window.addEventListener("resize", updateScreenSize);

        return () => {
            window.removeEventListener("resize", updateScreenSize);
        };
    });

    onMount(() => {
        animal = get(currentAnimal); // Sicherstellen, dass es beim Laden gesetzt wird
    });

    const openai = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    });

    $: currentAnimal.subscribe((value) => {
        animal = value;
        if (animal) {
            fetchAnimalInfo();
        }
    });

    async function fetchAnimalInfo() {
        if (!animal || !animal.name) {
            console.error("Kein Tier ausgewählt oder ungültig:", animal);
            generalInfo = "Kein Tier ausgewählt.";
            facts = "Keine Fakten verfügbar.";
            habitatInfo = "Keine Lebensraum-Informationen verfügbar.";
            isLoading.set(false);
            return;
        }

        try {
            console.log("Aktuelles Tier:", animal);

            // Prompt für allgemeine Informationen
            const generalPrompt = `
           Beschreibe ${animal.name} in einem sehr kurzen, informativen Satz.
           Beispiel: Der Tiger ist eine große, gestreifte Raubkatze.`;

            const generalResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: generalPrompt }],
                max_tokens: 100,
            });

            generalInfo =
                generalResponse.choices[0]?.message?.content.trim() ||
                "Keine Informationen verfügbar.";

            // Prompt für interessante Fakten
            const factsPrompt = `
           Gib mir genau zwei kurze, prägnante Fakten über ${animal.name}.
           Jeder Fakt sollte ein einzelner Satz sein. Vermeide lange Sätze. Vermeide Listen, Aufzählungen oder Nummerierungen. 
           Die Antwort darf insgesamt nicht länger als zwei Sätze sein. 
            Beispiel: Elefanten kommunizieren über Infraschall. Sie sind die größten Landsäugetiere.`;

            const factsResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: factsPrompt }],
                max_tokens: 80,
            });

            facts =
                factsResponse.choices[0]?.message?.content.trim() ||
                "Keine Fakten verfügbar.";

            // Prompt für Lebensräume
            const habitatPrompt = `
            Beschreibe die natürlichen Lebensräume von ${animal.name}.
            Schreibe einen Satz, prägnant und klar.`;

            const habitatResponse = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: habitatPrompt }],
                max_tokens: 80,
            });

            habitatInfo =
                habitatResponse.choices[0]?.message?.content.trim() ||
                "Keine Informationen über Lebensräume verfügbar.";
        } catch (error) {
            console.error("Fehler beim Abrufen der Tierinformationen:", error);
            generalInfo = "Fehler beim Laden der allgemeinen Informationen.";
            facts = "Fehler beim Laden der Fakten.";
            habitatInfo =
                "Fehler beim Laden der Informationen über die Lebensräume.";
        } finally {
            isLoading.set(false);
        }
    }

    onMount(() => {
        // fetchAnimalInfo();
    });

    function confirmExit() {
        showExitOverlay.set(true);
    }
</script>

<main>
    <h2 id="ExplainHeading">Wusstest du…</h2>

    <div class="info-cards">
        <div class="card">
            <img
                id="animalImage"
                src={animal?.bild || "/placeholder.png"}
                alt="Tierbild"
            />
            <h2>{animal.name}</h2>

            {#if $isLoading}
                <div class="card-spinner-container">
                    <div class="spinner"></div>
                </div>
            {:else}
                <p>{generalInfo}</p>
            {/if}
        </div>

        <div class="card">
            <img src="Hinweise.png" alt="Fakten Bild" />
            <h2>Fakten</h2>

            {#if $isLoading}
                <div class="card-spinner-container">
                    <div class="spinner"></div>
                </div>
            {:else}
                <p>{facts}</p>
            {/if}
        </div>
        <div class="card">
            <img src="Lebensraum.png" alt="Lebensraum Bild" />
            <h2>Lebensraum</h2>

            {#if $isLoading}
                <div class="card-spinner-container">
                    <div class="spinner"></div>
                </div>
            {:else}
                <p>{habitatInfo}</p>
            {/if}
        </div>
    </div>

    <div class="button-group">
        <button id="endGame" on:click={confirmExit}>Spiel beenden</button>
        <button on:click={() => (window.location.hash = "#/game")}>
            Nächste Runde
        </button>
    </div>

    <ExitOverlay
        bind:showOverlay={$showExitOverlay}
        on:exit={() => {
            resetScore();
            window.location.hash = "#/";
        }}
    />
</main>

<style>
    :root {
        --primary-color: #b3e3fa;
        --darker-blue: #81cbf0;
        --hover-color: #4090c6;

        --dark-blue: #003366;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        min-height: 100vh;
    }

    #animalImage {
        object-fit: contain;
        width: 100%;
        max-width: 160px;
    }

    .spinner {
        margin-top: 30px;
        width: 30px;
        height: 30px;
        border: 3px solid var(--darker-blue);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    #ExplainHeading {
        font-size: 2.5rem;
        margin-bottom: 40px;
        color: #2a6f97;
    }

    .info-cards {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 100px;
        margin-bottom: 40px;
    }

    .card {
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 300px;
        height: 450px;
        padding: 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        animation: slideIn 0.6s ease-out;
    }

    .card img {
        width: 180px;
        height: 150px;
        margin-top: 30px;
        object-fit: cover;
    }

    .card h2 {
        font-size: 1.8rem;
        margin: 20px 0 10px 0;
        color: var(--darker-blue);
    }

    .card p {
        max-width: 250px;
        font-size: 1.1rem;
        color: #4a4a4a;
        margin-top: 10;
        text-align: left;
    }

    .button-group {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 20px;
    }

    .button-group button {
        padding: 15px 30px;
        font-size: 1.2rem;
        color: white;
        background-color: var(--dark-blue);
        border: none;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 0;
        font-weight: bold;

        min-width: 180px;
        text-align: center;
    }

    .button-group button:hover {
        background-color: var(--hover-color);
        transform: scale(1.05);
    }

    .button-group button:active {
        transform: scale(0.95);
    }

    .button-group #endGame {
        border: 2px solid var(--dark-blue);
        color: var(--dark-blue);
        background-color: transparent;
    }
    .button-group #endGame:hover {
        background-color: var(--hover-color);
        color: white;
        border: 2px solid var(--hover-color);
    }

    @media (max-width: 1080px) {
        #ExplainHeading {
            font-size: 1.9rem;
            margin-top: 45px;
            margin-bottom: 0;
            color: #2a6f97;
        }

        .card {
            width: 260px;
            height: 400px;
            padding: 15px;
        }

        .card img {
            width: 140px;
            height: 120px;
            margin-top: 20px;
        }

        .card h2 {
            font-size: 1.5rem;
        }

        .card p {
            font-size: 0.9rem;
        }

        .button-group button {
            padding: 13px 25px;
            font-size: 1rem;
            color: white;
            background-color: var(--dark-blue);
            border: none;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            margin: 0;
            font-weight: bold;

            min-width: 180px;
            text-align: center;
        }

        #animalImage {
            max-width: 120px;
        }
    }
</style>
