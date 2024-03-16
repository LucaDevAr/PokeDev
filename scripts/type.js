import { allPokemonData } from "./pokedex.js";
import { filteredPokemon } from "./pokedex.js";
import { updateFilteredPokemon } from "./pokedex.js";

export function filterByType(types, filterCount) {
  updateFilteredPokemon(
    filterCount == 0
      ? allPokemonData.slice(0, 1025).filter((pokemon) => {
          return types.some((type) =>
            pokemon.types.some((t) => t.type.name === type)
          );
        })
      : filteredPokemon.filter((pokemon) => {
          return types.some((type) =>
            pokemon.types.some((t) => t.type.name === type)
          );
        })
  );
}
