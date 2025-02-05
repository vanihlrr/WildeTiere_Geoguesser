<script>
    import { writable } from "svelte/store";
    import { foundHabitats } from "../animalStore";
    import { get } from "svelte/store";
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";
    import { updateScore, increaseFoundAnimals } from "../store";

    export let habitatPos;
    let originalWidth = 1400;
    let originalHeight = 800;

    let userClicks = writable([]);
    let isGameOver = writable(false);
    let clickCount = writable(0);
    let message = "";

    let showMessage = false;
    let isFadingOut = false;
    let labelTimeout;

    let mapSize = writable({ width: originalWidth, height: originalHeight });
    let habitatPixelPos = [];
    let isTablet = writable(false);

    function updateMapSize() {
        const container = document.querySelector(".map-container");
        if (container) {
            mapSize.set({
                width: container.clientWidth,
                height: container.clientHeight,
            });
        }
    }

    onMount(() => {
        updateMapSize();
        window.addEventListener("resize", updateMapSize);
        return () => window.removeEventListener("resize", updateMapSize);
    });

    function checkScreenSize() {
        isTablet.set(window.innerWidth < 1080);
    }

    onMount(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
    });

    onDestroy(() => {
        window.removeEventListener("resize", checkScreenSize);
    });

    // $: habitatPixelPos = habitatPos.map((pos) =>
    //     latLonToPixel(pos.latitude, pos.longitude),
    // );
    $: habitatPixelPos = habitatPos.map((pos) => {
        const { width, height } = get(mapSize);
        return latLonToPixel(pos.latitude, pos.longitude, width, height);
    });

    function latLonToPixel(latitude, longitude, mapWidth, mapHeight) {
        const xNorm = (longitude + 180) / 360; // 0 - 1 (Longitude normalisiert)
        const yNorm = (90 - latitude) / 180; // 0 - 1 (Latitude normalisiert)

        // Original-Position auf 1400x800 berechnen
        const xPixelOriginal = xNorm * originalWidth;
        const yPixelOriginal = yNorm * originalHeight;

        // Skalierung auf aktuelle Map-Größe
        const xPixel = (xPixelOriginal / originalWidth) * mapWidth;
        const yPixel = (yPixelOriginal / originalHeight) * mapHeight;

        return { x: Math.round(xPixel), y: Math.round(yPixel) };
    }

    function getTolerance(latitude, longitude) {
        let baseTolerance = get(isTablet) ? 30 : 75; // Kleinere Toleranz auf Tablets

        const smallToleranceRegions = [
            { latMin: 35, latMax: 55, lonMin: -10, lonMax: 30 },
        ];

        const largeToleranceRegions = [
            { latMin: -45, latMax: -10, lonMin: 110, lonMax: 155 },
            { latMin: 50, latMax: 75, lonMin: 40, lonMax: 150 },
            { latMin: -35, latMax: 10, lonMin: 10, lonMax: 50 },
        ];

        if (
            smallToleranceRegions.some(
                (region) =>
                    latitude >= region.latMin &&
                    latitude <= region.latMax &&
                    longitude >= region.lonMin &&
                    longitude <= region.lonMax,
            )
        ) {
            return baseTolerance - 10;
        }

        if (
            largeToleranceRegions.some(
                (region) =>
                    latitude >= region.latMin &&
                    latitude <= region.latMax &&
                    longitude >= region.lonMin &&
                    longitude <= region.lonMax,
            )
        ) {
            return baseTolerance + 20;
        }

        return baseTolerance;
    }

    function handleMapClick(event) {
        if ($isGameOver) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const foundTolerance = 35;

        console.log("habitatPixelPos:", habitatPixelPos);

        const distances = habitatPixelPos.map((pos, index) => {
            const dx = Math.abs(pos.x - clickX);
            const dy = Math.abs(pos.y - clickY);
            return {
                distance: Math.sqrt(dx * dx + dy * dy),
                index, // ✅ Hier wird der Index explizit zugewiesen
                tolerance: getTolerance(
                    habitatPos[index].latitude,
                    habitatPos[index].longitude,
                ),
            };
        });

        const closest = distances.reduce((min, current) =>
            current.distance < min.distance ? current : min,
        );

        const habitatIndex = closest.index;
        const minDistance = closest.distance;
        const tolerance = closest.tolerance;

        let totalHabitats = habitatPos.length;
        let maxPoints = 5;
        let penaltyPerExtraClick = 1;

        if (minDistance <= tolerance && habitatIndex !== -1) {
            if (get(foundHabitats)[habitatIndex]) {
                if (minDistance <= foundTolerance) {
                    console.log(
                        `Lebensraum Nr. ${habitatIndex} wurde bereits gefunden.`,
                    );
                    userClicks.update((clicks) => [
                        ...clicks,
                        { x: clickX, y: clickY, isCorrect: false },
                    ]);
                    message = "Dieser Lebensraum wurde bereits gefunden!";
                }
            } else {
                console.log(`Lebensraum Nr. ${habitatIndex} gefunden:`);
                foundHabitats.update((found) => {
                    const updated = [...found];
                    updated[habitatIndex] = true;
                    return updated;
                });

                increaseFoundAnimals();

                let extraClicks = get(clickCount) - totalHabitats;
                let pointsEarned =
                    maxPoints - Math.max(0, extraClicks * penaltyPerExtraClick);
                updateScore(pointsEarned);

                userClicks.update((clicks) => [
                    ...clicks,
                    { x: clickX, y: clickY, isCorrect: true },
                ]);
                message = `Du hast einen Lebensraum gefunden!`;
            }
        } else {
            userClicks.update((clicks) => [
                ...clicks,
                { x: clickX, y: clickY, isCorrect: false },
            ]);

            if (minDistance > 200) {
                message =
                    "Du bist noch weit entfernt, ein Hinweis könnte helfen.";
            } else if (minDistance > 150) {
                message = "Nicht ganz, aber du gehst in die richtige Richtung.";
            } else {
                message = "Knapp daneben, versuche es erneut.";
            }
        }

        clickCount.update((count) => count + 1);

        showMessage = true;
        isFadingOut = false;

        clearTimeout(labelTimeout);
        labelTimeout = setTimeout(() => {
            isFadingOut = true;
            setTimeout(() => {
                showMessage = false;
                isFadingOut = false;
            }, 500);
        }, 2500);

        setTimeout(() => {
            if (get(foundHabitats).every((found) => found)) {
                isGameOver.set(true);
            }
        }, 100);
    }

    function handleKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
            handleMapClick(event);
        }
    }
</script>

<div
    class="map-container"
    on:click={handleMapClick}
    role="button"
    tabindex="0"
    on:keydown={handleKeyDown}
>
    <img src="worldmap.png" alt="Weltkarte" class="world-map" />

    <!-- Lebensräume als Marker -->
    {#each habitatPixelPos as pos}
        <div class="marker" style="top: {pos.y}px; left: {pos.x}px"></div>
    {/each}

    <!-- Nutzer-Klicks -->
    {#each $userClicks as click, i}
        <div
            class:user-marker={click.isCorrect}
            class:user-marker-wrong={!click.isCorrect}
            style="top: {click.y}px; left: {click.x}px"
        ></div>

        <!-- Labels für die letzte Aktion -->
        {#if showMessage && i === $userClicks.length - 1}
            {#if click.isCorrect}
                <div
                    class="label success-label {isFadingOut ? 'fade-out' : ''}"
                    style="top: calc({click.y}px - 70px); left: {click.x}px"
                >
                    <img alt="Erfolg" />
                    <p>Super! Du hast einen Lebensraum gefunden!</p>
                </div>
            {/if}

            {#if !click.isCorrect}
                <div
                    class="label wrong-label {isFadingOut ? 'fade-out' : ''}"
                    style="top: calc({click.y}px - 70px); left: {click.x}px"
                >
                    <img alt="Fehler" />
                    <p>{message}</p>
                </div>
            {/if}
        {/if}
    {/each}
</div>

{#if $isGameOver}
    <div class="button-container">
        <button
            class="weiterButton"
            on:click={() => (window.location.hash = "#/animalInfo")}
        >
            Weiter
        </button>
    </div>
{/if}

<style>
    .map-container {
        display: flex;
        position: relative;
        width: 1400px;
        height: 800px;
        margin-top: 1%;
    }

    .world-map {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* .marker {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: red;
        border-radius: 50%;
        transform: translate(-50%, -50%);
    } */

    .user-marker {
        position: absolute;
        width: 30px;
        height: 38px;
        background-image: url("User-Marker.png");
        background-size: cover;
        background-position: center;
        transform: translate(-50%, -50%);
    }

    .user-marker-wrong {
        position: absolute;
        width: 30px;
        height: 38px;
        background-image: url("User-Marker-Wrong.png");
        background-size: cover;
        background-position: center;
        transform: translate(-50%, -50%);
    }

    .label {
        display: flex;
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translate(-50%, -40px);
        background-color: white;
        border-radius: 100px;
        padding: 1px 15px 1px 15px;
        width: 260px;
        color: #83aa33;
        text-align: left;
        font-size: 1rem;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        align-items: center;
        gap: 15px;
        transition:
            opacity 0.5s ease,
            transform 0.5s ease;
    }

    .label::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
    }

    .label.fade-out {
        opacity: 0;
        transform: translate(-50%, -60px);
    }

    .success-label {
        color: #83aa33;
    }

    .success-label img {
        content: url("/success-icon.png");
        width: 40px;
        height: 40px;
    }

    .wrong-label {
        color: white;
        border-color: #de4f4f;
        background-color: #de4f4f;
    }

    .wrong-label::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid #de4f4f;
    }

    .wrong-label img {
        content: url("/wrong-icon.png");
        width: 40px;
        height: 40px;
    }

    .button-container {
        position: absolute;
        bottom: 70px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    .weiterButton {
        padding: 10px 50px;
        background-color: white;
        color: var(--darker-blue);
        border-radius: 20px;
        font-size: 1.1rem;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        border: none;
        cursor: pointer;
    }

    .weiterButton:hover {
        background-color: var(--darker-blue);
        color: white;
    }

    @media (max-width: 1080px) {
        .map-container {
            top: 50px;
            left: -10px;
            width: 902.5px;
            height: 514.425px;
        }

        .label {
            display: flex;
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translate(-50%, -20px);
            background-color: white;
            border-radius: 100px;
            padding: 1px 15px 1px 15px;
            width: 200px;
            color: #83aa33;
            text-align: left;
            font-size: 0.7rem;
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            align-items: center;
            gap: 15px;
            transition:
                opacity 0.5s ease,
                transform 0.5s ease;
        }

        .label::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid white;
        }

        .label.fade-out {
            opacity: 0;
            transform: translate(-50%, -60px);
        }

        .success-label {
            color: #83aa33;
        }

        .success-label img {
            content: url("/success-icon.png");
            width: 40px;
            height: 40px;
        }

        .wrong-label {
            color: white;
            border-color: #de4f4f;
            background-color: #de4f4f;
        }

        .wrong-label::after {
            content: "";
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid #de4f4f;
        }

        .wrong-label img {
            content: url("/wrong-icon.png");
            width: 40px;
            height: 40px;
        }

        .user-marker {
            position: absolute;
            width: 25px;
            height: 32px;
            background-image: url("User-Marker.png");
            background-size: cover;
            background-position: center;
            transform: translate(-50%, -50%);
        }

        .user-marker-wrong {
            position: absolute;
            width: 25px;
            height: 32px;
            background-image: url("User-Marker-Wrong.png");
            background-size: cover;
            background-position: center;
            transform: translate(-50%, -50%);
        }
    }
</style>
