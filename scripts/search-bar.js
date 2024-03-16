import { allPokemonData } from "./pokedex.js";
import { filteredPokemon } from "./pokedex.js";
import { loadMorePokemon } from "./scroll.js";
import { fil } from "./filters.js";
import { updateOffset } from "./scroll.js";
const $cardsContainer = document.querySelector(".cards-container");
import { updateCount } from "./scroll.js";
export let matchingPokemon = [];
export let filtr = 0;
export function updatefiltr(value) {
  filtr = value;
}

export function searchBar() {
  const $search = document.getElementById("search");
  $search.addEventListener("input", async (e) => {
    $cardsContainer.innerHTML = "";
    updateOffset(0);
    updateCount(0);
    const searchTerm = e.target.value.toLowerCase();
    matchingPokemon = [];
    if (fil == 0) {
      allPokemonData.forEach((pokemon) => {
        if (pokemon.name.includes(searchTerm)) matchingPokemon.push(pokemon);
        if (pokemon.id == parseInt(searchTerm)) matchingPokemon.push(pokemon);
      });
    } else {
      filteredPokemon.forEach((pokemon) => {
        if (pokemon.name.includes(searchTerm)) matchingPokemon.push(pokemon);
        if (pokemon.id == parseInt(searchTerm)) matchingPokemon.push(pokemon);
      });
    }
    loadMorePokemon(matchingPokemon);
    filtr = 1;
    if (searchTerm.length == 0) filtr = 0;
    if (matchingPokemon.length == 0) $cardsContainer.innerHTML = "NON";
  });
}
