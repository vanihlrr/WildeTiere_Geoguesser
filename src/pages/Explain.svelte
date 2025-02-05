<script>
</script>

<main>
  <h2 id="ExplainHeading">So funktioniert das Spiel</h2>
  <div class="info-cards">
    <div class="card">
      <img src="/Szenario.png" alt="Szenario Bild" />
      <h2>Szenario</h2>
      <p>
        Du bist ein Naturforscher, der auf einer globalen Expedition ist, um die
        natürlichen Lebensräume wilder Tiere zu entdecken und zu kartografieren.
      </p>
    </div>

    <div class="card">
      <img src="Ablauf.png" alt="Ablauf Bild" />
      <h2>Ablauf</h2>
      <p>
        Finde den natürlichen Lebensraum von einem Tier auf der Weltkarte. Je
        näher dein Punkt am echten Lebensraum liegt, desto besser.<br />
        <br />
        Manche Tiere haben mehrere Lebensräume.
      </p>
    </div>

    <div class="card">
      <img src="Hinweise.png" alt="Hinweise Bild" />
      <h2>Hinweise</h2>
      <p>
        Natürlich bist du nicht ganz auf dich allein gestellt. Du kannst maximal
        <bold>drei</bold> Hinweise anfordern, die dir bei der Suche nach dem Lebensraum
        helfen.
      </p>
    </div>
  </div>
  <button on:click={() => (window.location.hash = "#/game")}>
    Spiel starten
  </button>
</main>

<style>
  :root {
    --primary-color: #b3e3fa;
    --darker-blue: #346087;
    --hover-color: #4090c6;
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

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100vh;
    padding-top: 5%;
  }

  #ExplainHeading {
    font-size: 2.5rem;
    margin-bottom: 40px;
    color: #2a6f97;
    margin-bottom: 4%;
  }

  .info-cards {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2%;
    width: 80%;
    margin-bottom: 4%;
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

  .card bold {
    font-weight: bold;
  }

  button {
    padding: 0.8% 2%;
    font-size: 1.2rem;
    color: white;
    background-color: var(--dark-blue);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 2% 0;
    font-weight: bold;
  }

  button:hover {
    background-color: var(--hover-color);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }

  @media (max-width: 1080px) {
    #ExplainHeading {
      font-size: 1.9rem;
      margin-top: 4%;
    }

    .info-cards {
      flex-direction: row;
      gap: 20px;
      width: 90%;
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

    button {
      margin-top: 0%;
      font-size: 1rem;
      padding: 15px 30px;
    }
  }
</style>
