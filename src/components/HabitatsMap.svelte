<script>
    import { writable } from "svelte/store";
    import { animalsStore } from "../animalStore";
    import { onMount } from "svelte";
    import { onDestroy } from "svelte";

    let animals = [];
    let selectedAnimals = writable([]);
    let hoveredAnimal = writable(null);

    let mapWidth = 1400;
    let mapHeight = 800;
    let searchQuery = writable("");
    let currentPage = writable(0);
    const itemsPerPage = 9;

    let showFilter = writable(false);
    let isTablet = writable(true);

    function checkScreenSize() {
        isTablet.set(window.innerWidth <= 1200);
        if (!isTablet) {
            showFilter.set(true);
        }
    }

    onMount(() => {
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
    });

    onDestroy(() => {
        window.removeEventListener("resize", checkScreenSize);
    });

    function toggleFilter() {
        if (isTablet) {
            showFilter.update((value) => !value);
        }
    }

    $: animalsStore.subscribe((data) => {
        animals = data;
        selectedAnimals.set(data);
    });

    $: filteredAnimals = animals.filter((animal) =>
        animal.name.toLowerCase().includes($searchQuery.toLowerCase()),
    );

    $: paginatedAnimals = filteredAnimals.slice(
        $currentPage * itemsPerPage,
        ($currentPage + 1) * itemsPerPage,
    );

    function nextPage() {
        if (($currentPage + 1) * itemsPerPage >= filteredAnimals.length) {
            currentPage.set(0);
        } else {
            currentPage.update((page) => page + 1);
        }
    }

    function handleIconClick(animalName) {
        const filtered = animals.filter((animal) => animal.name === animalName);
        selectedAnimals.set(filtered);
    }

    function resetFilter() {
        selectedAnimals.set(animals);
        searchQuery.set("");
    }

    function latLonToPixel(latitude, longitude) {
        return {
            x: ((longitude + 180) / 360) * 100 + "%",
            y: ((90 - latitude) / 180) * 100 + "%",
        };
    }

    $: animalPositions = [];
    $: selectedAnimals.subscribe((filteredAnimals) => {
        animalPositions = filteredAnimals
            .map((animal) =>
                animal.habitats.map((habitat) => {
                    const pixelPos = latLonToPixel(
                        habitat.latitude,
                        habitat.longitude,
                    );
                    return {
                        ...pixelPos,
                        bild: animal.bild,
                        name: animal.name,
                    };
                }),
            )
            .flat();
    });

    function showLabel(animalName) {
        hoveredAnimal.set(animalName);
    }

    function hideLabel() {
        hoveredAnimal.set(null);
    }
</script>

<div class="container">
    {#if $isTablet}
        <button class="filter-toggle" on:click={toggleFilter}>
            {#if $showFilter}
                ◀
            {:else}
                ▶
            {/if}
        </button>
    {/if}

    <div
        class="filter-container {$isTablet && !$showFilter ? 'collapsed' : ''}"
    >
        <h2 class="filter-title">Sortieren nach</h2>

        <div class="search-reset">
            <input
                type="text"
                placeholder="Nach Tier suchen…"
                bind:value={$searchQuery}
                class="search-bar"
            />
            <button class="reset-button" on:click={resetFilter}>Reset</button>
        </div>

        <div class="animal-icons">
            {#each paginatedAnimals as animal}
                <img
                    src={animal.bild}
                    alt={animal.name}
                    title={animal.name}
                    class="animal-icon"
                    on:click={() => handleIconClick(animal.name)}
                />
            {/each}
        </div>

        <div class="pagination">
            <button class="load-more-button" on:click={nextPage}>
                ▼ Mehr Tiere
            </button>
        </div>
    </div>

    <div class="map-container">
        <img src="Weltkarte.png" alt="Weltkarte" class="world-map" />

        {#each animalPositions as pos}
            <div
                class="animal-marker"
                style="top: {pos.y}; left: {pos.x};"
                on:mouseenter={() => showLabel(pos.name)}
                on:mouseleave={hideLabel}
            >
                <img src={pos.bild} alt={pos.name} />
                {#if $hoveredAnimal === pos.name}
                    <div class="label">{$hoveredAnimal}</div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    * {
        font-family: "Nunito", sans-serif;
    }
    :root {
        --dark-blue: #346087;
        --blue: #a4d4f4;
        --white: #ffffff;
        --text-blue: #74b2e2;
        --grey: #ddd;
    }

    .container {
        display: flex;
        gap: 20px;
        justify-content: center;
        align-items: flex-start;
        padding: 20px;
    }

    .filter-container {
        background-color: var(--white);
        padding: 30px;
        width: 300px;
        border-radius: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.3s ease-in-out;
    }

    .filter-title {
        font-size: 1.8rem;
        color: var(--text-blue);
        font-weight: bold;
        margin-bottom: 32px;
        margin-top: 12px;
    }

    .search-reset {
        display: flex;
        gap: 10px;
        width: 100%;
        justify-content: center;
    }

    .search-bar {
        width: 60%;
        padding: 10px;
        font-size: 0.9rem;
        border: 2px solid var(--text-blue);
        border-radius: 20px;
        text-align: left;
        margin-bottom: 24px;
    }

    .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
    }

    .load-more-button {
        padding: 12px 50px;
        background-color: var(--text-blue);
        color: var(--white);
        font-size: 1rem;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 12px;
        font-weight: bold;
    }

    .load-more-button:hover {
        background-color: var(--dark-blue);
    }

    .animal-icons {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-top: 20px;
    }

    .animal-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: var(--grey);
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .animal-icon:hover {
        transform: scale(1.2);
        border-color: var(--dark-blue);
    }

    .reset-button {
        padding: 6px 12px;
        font-size: 0.9rem;
        color: var(--white);
        background-color: var(--text-blue);
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: 0.2s;
        margin-bottom: 24px;
        padding: 10px 15px;
    }

    .reset-button:hover {
        background-color: #285074;
        transform: scale(1.05);
    }

    .map-container {
        display: flex;
        position: relative;
        width: 1400px;
        height: 800px;
        margin-top: 1%;
        top: -20px;
    }

    .world-map {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .animal-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: visible;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .animal-marker:hover {
        transform: translate(-50%, -50%) scale(1.2);
        z-index: 10;
    }

    .animal-marker img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .label {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        background-color: white;
        border-radius: 100px;
        padding: 5px 15px;
        color: #346087;
        font-size: 1rem;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        white-space: nowrap;
        pointer-events: none;
        z-index: 100;
        text-align: center;
        transition: opacity 0.3s ease;
    }

    .label::after {
        content: "";
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid white;
    }

    .filter-toggle {
        position: absolute;
        left: 0;
        height: 50px;
        top: 50%;
        transform: translateY(-50%);
        padding: 10px;
        border-radius: 0 20px 20px 0;
        cursor: pointer;
        border: none;
        z-index: 200;
        font-size: 1.2rem;
        background-color: white;
        color: var(--dark-blue);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    /* Standardmäßig verstecken */
    .filter-toggle {
        display: none;
    }

    @media (max-width: 1080px) {
        .map-container {
            width: 1100px;
            height: 627px;
        }

        .filter-container {
            position: absolute;
            left: 0;
            top: ce;
            z-index: 100;
            width: 250px;
            transition: transform 0.4s ease-in-out;
        }

        .animal-marker {
            position: absolute;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            overflow: visible;
            border: 2px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: transform 0.2s ease;
        }

        .animal-marker:hover {
            transform: translate(-50%, -50%) scale(1.2);
        }

        .filter-toggle {
            position: absolute;
            left: 0;
            height: 250px;
            top: 50%;
            transform: translateY(-50%);
            padding: 10px;
            border-radius: 0 20px 20px 0;
            cursor: pointer;
            border: none;
            z-index: 200;
            font-size: 1.2rem;
            background-color: white;
            color: var(--dark-blue);
            display: flex;
            align-items: center;
        }

        .filter-container.collapsed {
            transform: translateX(-310px);
        }
    }
</style>
