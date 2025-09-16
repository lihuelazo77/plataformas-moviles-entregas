const pokemonContainer = document.getElementById("pokemon-container");
const loading = document.getElementById("loading");
const loadMoreBtn = document.getElementById("load-more");
const modalBody = document.getElementById("modal-body");

let offset = 0;
const limit = 151;

function showLoading(show) {
  loading.classList.toggle("d-none", !show);
}

async function fetchPokemons() {
  showLoading(true);
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();
  showLoading(false);
  data.results.forEach(pokemon => fetchPokemonData(pokemon.url));
}

async function fetchPokemonData(url) {
  const res = await fetch(url);
  const pokemon = await res.json();

  const card = document.createElement("div");
  card.className = "col-6 col-md-4 col-lg-3";
  card.innerHTML = `
    <div class="card text-center p-2 shadow-sm">
      <img src="${pokemon.sprites.front_default}" class="pokemon-img mx-auto" alt="${pokemon.name}">
      <h5 class="text-capitalize">${pokemon.name}</h5>
      <p>${pokemon.types.map(t => `<span class="badge bg-secondary me-1">${t.type.name}</span>`).join("")}</p>
      <button class="btn btn-sm btn-outline-primary" onclick="showPokemonDetail(${pokemon.id})">Ver más</button>
    </div>
  `;
  pokemonContainer.appendChild(card);
}

async function showPokemonDetail(id) {
  showLoading(true);
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await res.json();
  showLoading(false);

  modalBody.innerHTML = `
    <div class="text-center">
      <img src="${pokemon.sprites.other['official-artwork'].front_default}" width="200" alt="${pokemon.name}">
      <h3 class="text-capitalize">${pokemon.name}</h3>
    </div>
    <hr>
    <p><strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(", ")}</p>
    <p><strong>Movimientos:</strong> ${pokemon.moves.slice(0,4).map(m => m.move.name).join(", ")}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById("pokemonModal"));
  modal.show();
}

loadMoreBtn.addEventListener("click", () => {
  offset += limit;
  fetchPokemons();
});

fetchPokemons();
