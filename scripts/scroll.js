import { allPokemonData } from "./pokedex.js";
import { filteredPokemon } from "./pokedex.js";
import { createPokemonCardHTML } from "./cards.js";
import { filtr } from "./search-bar.js";
import { matchingPokemon } from "./search-bar.js";

let offset = 0;
export function updateOffset(value) {
  offset = value;
}
let count = 0;
export function updateCount(value) {
  count = value;
}
let limit = 30;

export function scroll() {
  const $cardsContainer = document.querySelector(".cards-container");
  $cardsContainer.addEventListener("scroll", async () => {
    if (
      $cardsContainer.scrollTop + $cardsContainer.clientHeight >=
      $cardsContainer.scrollHeight - 100
    ) {
      console.log("scroll");
      if (count == 0) {
        offset = 30;
        count = 1;
      }
      if (filtr == 1) {
        loadMorePokemon(matchingPokemon);
        return;
      }
      if (filteredPokemon.length > 0) {
        loadMorePokemon(filteredPokemon);
      } else {
        loadMorePokemon(allPokemonData);
      }
    }
  });
}
export async function loadMorePokemon(data) {
  for (let i = offset; i < offset + limit && i < data.length; i++) {
    if (data[i].id < 1025) {
      createPokemonCardHTML(data[i]);
    }
  }
  offset += limit;
}
