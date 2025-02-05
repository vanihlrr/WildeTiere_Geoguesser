<script>
    import OpenAI from "openai";
    import { foundHabitats, currentAnimal } from "../animalStore";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let animal = null;
    let clickedStates = [false, false, false];
    let hintTexts = ["", "", ""];
    let totalHabitats = 0;

    const config = {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
    };

    const openai = new OpenAI(config);

    onMount(() => {
        const storedAnimal = get(currentAnimal);
        if (storedAnimal) {
            animal = storedAnimal;
            if (animal.habitats && animal.habitats.length) {
                totalHabitats = animal.habitats.length;

                if (get(foundHabitats).length !== totalHabitats) {
                    console.log(new Array(totalHabitats).fill(false));
                    foundHabitats.set(new Array(totalHabitats).fill(false));
                }
            } else {
                totalHabitats = 0;
                foundHabitats.set([]);
            }
        }
    });

    $: currentAnimal.subscribe((value) => {
        if (value) {
            animal = value;
            if (animal.habitats && animal.habitats.length) {
                totalHabitats = animal.habitats.length;
                foundHabitats.set(new Array(totalHabitats).fill(false));
            } else {
                totalHabitats = 0;
                foundHabitats.set([]);
            }
        }
    });

    function findHabitat(index) {
        console.log("findHabitat wurde aufgerufen", index);
        foundHabitats.update((found) => {
            const updated = [...found];
            updated[index] = true;
            return updated;
        });
    }

    function handleHintBoxClick(index) {
        if (!clickedStates[index]) {
            clickedStates[index] = true;
            fetchHint(index);
        }
    }

    function isClickable(index) {
        return index === clickedStates.findIndex((state) => !state);
    }

    async function fetchHint(index) {
        hintTexts[index] = "Lade...";
        try {
            const habitatDescriptions = animal.habitats
                .map(
                    (habitat, i) =>
                        `Lebensraum ${i + 1}: Breite ${habitat.latitude}, Länge ${habitat.longitude}`,
                )
                .join("\n");

            const prompt = `
            Das Tier ist: ${animal.name}.
            Hier sind die bekannten Lebensräume:
            ${habitatDescriptions}

            Gib mir einen sehr kurzen, hilfreichen Hinweis über die Lebensräume von ${animal.name}.
            Dieser Hinweis sollte aus maximal 5-10 Wörtern bestehen. Der Hinweis sollte sich auf die Region oder Himmelsrichtungen beziehen und präzise sein, aber nicht zu offensichtlich.
            Beispiel:
            Streift durch Savannen im Osten Afrikas.

            Gib nur den Hinweis aus, ohne Einleitung oder zusätzliche Wörter.
        `;

            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 20,
            });

            const hint =
                response.choices[0]?.message?.content.trim() ||
                "Keine Daten verfügbar.";
            hintTexts[index] = hint;
        } catch (error) {
            console.error("Fehler beim Abrufen des Hinweises:", error);
            hintTexts[index] = "Fehler beim Abrufen des Hinweises.";
        } finally {
            clickedStates = [...clickedStates];
        }
    }
</script>

<div class="sidebar-container">
    <div class="sidebar">
        <img src={animal?.bild || "/placeholder.png"} alt="Tierbild" />
        <h2>{animal?.name || "Kein Tier ausgewählt"}</h2>
        <div class="hints">
            <h3>Tipps</h3>
            {#each clickedStates as isClicked, index}
                <button
                    type="button"
                    class="hint-box"
                    class:clicked={isClicked}
                    on:click={() => handleHintBoxClick(index)}
                    disabled={!isClickable(index)}
                >
                    <span class={isClicked ? "hint-text" : ""}>
                        {isClicked ? hintTexts[index] || "Lade..." : "+"}
                    </span>
                </button>
            {/each}
        </div>
    </div>

    <div class="guess-box">
        <h2>Zu findende Lebensräume</h2>
        <div class="habitat-pins">
            {#each Array(totalHabitats) as _, index}
                <div
                    class="habitat-pin"
                    class:found={$foundHabitats[index]}
                ></div>
            {/each}
        </div>
    </div>
</div>

<style>
    :root {
        --darker-blue: #81cbf0;
        --blue: #007bff;
        --gray: #d3d3d3;
    }

    /* Sidebar */
    .sidebar {
        width: 250px;
        height: 390px;
        padding: 20px;
        background-color: #f0f8ff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin-top: 35%;
    }

    .sidebar img {
        max-width: 130px;
        width: 130px;
        border-radius: 50%;
        margin-top: -50px;
    }

    .sidebar h2 {
        font-size: 1.5rem;
        margin-bottom: 10px;
        color: var(--darker-blue);
    }

    /* Tipps/Hinweise */
    .hints {
        margin-top: 15px;
        text-align: left;
        color: var(--darker-blue);
    }

    .hints .hint-box {
        width: 100%;
        height: 60px;
        margin: 5px 0;
        background-color: #dfefff;
        border: 2px dashed #79a4c9;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.3rem;
        color: #79a4c9;
        cursor: pointer;
    }

    .hints .hint-box:hover {
        background-color: #cce4ff;
    }

    .hints .hint-box.clicked {
        color: white;
        border: 2px solid var(--darker-blue);
        background-color: var(--darker-blue);
    }

    .hints .hint-box:disabled {
        color: transparent;
    }

    .hint-text {
        color: white;
        font-weight: normal;
        font-size: 0.9rem;
    }

    .guess-box {
        width: 250px;
        height: 80px;
        padding: 20px;
        background-color: #f0f8ff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        margin-top: 20px;
    }

    .guess-box h2 {
        font-size: 1.2rem;
        margin-top: 0;
        margin-bottom: 10px;
        color: var(--darker-blue);
    }

    .habitat-pins {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .habitat-pin {
        width: 26px;
        height: 35px;
        background-image: url("Habitat-Pin.png");
        background-size: cover;
        background-position: center;
        transition: background-color 0.3s;
    }

    .habitat-pin.found {
        background-image: url("Habitat-Found.png");
        background-size: cover;
        background-position: center;
    }

    @media (max-width: 1080px) {
        .sidebar {
            width: 185px;
            height: 430px;
            padding: 15px;
            margin-top: 25%;
            margin-left: 15px;
        }

        .sidebar img {
            max-width: 95px;
            width: 95px;
            margin-top: -35px;
        }

        .sidebar h2 {
            font-size: 1.3rem;
        }

        .hints h3 {
            font-size: 1rem;
        }

        .hints .hint-box {
            height: 80px;
            font-size: 1.1rem;
        }

        .hint-text {
            font-size: 0.8rem;
        }

        .guess-box {
            width: 180px;
            height: 90px;
            padding: 15px;
            margin-left: 15px;
        }

        .guess-box h2 {
            font-size: 1rem;
        }

        .habitat-pin {
            width: 22px;
            height: 30px;
        }
    }
</style>
