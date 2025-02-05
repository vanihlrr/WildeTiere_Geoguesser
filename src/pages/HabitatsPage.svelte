<script>
    import HabitatsMap from "../components/HabitatsMap.svelte";
</script>

<main>
    <h1>Die Lebensräume der Wilden Tiere</h1>
    <HabitatsMap />
</main>

<style>
    main {
        text-align: center;
        margin: 20px;
    }

    h1 {
        margin-top: 5%;
        font-size: 2rem;
        color: #2a6f97;
    }
    @media (max-width: 1080px) {
        h1 {
            display: flex;
            justify-content: center;
            font-size: 1.5rem;
            margin-top: 7%;
        }
    }
</style>
