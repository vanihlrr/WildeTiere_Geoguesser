<script>
  import Router from "svelte-spa-router";
  import Nav from "./components/Nav.svelte";
  import Homepage from "./pages/Homepage.svelte";
  import Game from "./pages/Game.svelte";
  import Explain from "./pages/Explain.svelte";
  import AnimalInfo from "./pages/AnimalInfo.svelte";
  import HabitatsPage from "./pages/HabitatsPage.svelte";
  import Highscores from "./pages/Highscores.svelte";

  let activePage = window.location.hash || "#/";
  const noNavPages = ["#/game", "#/animalInfo"];

  window.addEventListener("hashchange", () => {
    activePage = window.location.hash || "#/";
  });

  // Routen
  const routes = {
    "/": Homepage,
    "/game": Game,
    "/explain": Explain,
    "/animalInfo": AnimalInfo,
    "/lebensraeume": HabitatsPage,
    "/highscores": Highscores,
  };
</script>

{#if !noNavPages.includes(activePage)}
  <Nav {activePage} />
{/if}
<main>
  <Router {routes} />
</main>

<style>
  * {
    font-family: "Nunito", sans-serif;
  }

  main {
    padding: 0;
  }
</style>
