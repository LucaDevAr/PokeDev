import { allPokemonData } from "./pokedex.js";
import { filteredPokemon } from "./pokedex.js";
import { updateFilteredPokemon } from "./pokedex.js";

export function filterByRegion(regions) {
  const regionRanges = {
    kanto: { start: 1, end: 151 },
    johto: { start: 152, end: 251 },
    hoenn: { start: 252, end: 386 },
    sinnoh: { start: 387, end: 493 },
    teselia: { start: 494, end: 649 },
    kalos: { start: 650, end: 721 },
    alola: { start: 722, end: 809 },
    galar: { start: 810, end: 898 },
    hisui: { start: 899, end: 905 },
    paldea: { start: 906, end: 1025 },
  };

  regions.forEach((region) => {
    const { start, end } = regionRanges[region];
    const regionPokemon = allPokemonData.slice(0, 1025).filter((pokemon) => {
      return pokemon.id >= start && pokemon.id <= end;
    });
    updateFilteredPokemon(filteredPokemon.concat(regionPokemon));
  });
}
