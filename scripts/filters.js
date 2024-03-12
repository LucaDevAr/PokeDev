import { filterByType } from "./pokedex.js";
import { filterByRegion } from "./pokedex.js";
import { allPokemonData } from "./pokedex.js";
import { loadMorePokemon } from "./pokedex.js";
import { updateOffset } from "./pokedex.js";
import { updateCount } from "./pokedex.js";
import { updateFilteredPokemon } from "./pokedex.js";
import { filteredPokemon } from "./pokedex.js";
import { updatefiltr } from "./search-bar.js";

const $filterIcon = document.getElementById("filters"),
  $cancel = document.getElementById("cancel"),
  $apply = document.getElementById("apply"),
  $reset = document.getElementById("reset"),
  $filters = document.querySelector(".filters"),
  $accordions = document.querySelectorAll(
    ".filters .accordion .accordion__item"
  ),
  $cardsContainer = document.querySelector(".cards-container"),
  $input = document.querySelector("input");

export let filter = 0;
export let fil = 0;
export function updateFil(value) {
  fil = value;
}

export function filters() {
  $filterIcon.addEventListener("click", () => {
    $filters.classList.add("show");
  });
  $cancel.addEventListener("click", () => {
    $filters.classList.remove("show");
  });
  $apply.addEventListener("click", () => {
    $filters.classList.remove("show");
    $cardsContainer.scrollTop = 0;
    $cardsContainer.innerHTML = "";
    updateOffset(0);
    updateCount(0);
    updateFilteredPokemon([]);
    $input.value = "";

    $accordions.forEach((accordion) => {
      // console.log(accordion);
      accordion.classList.remove("open");
      accordion.querySelector(".accordion__content").style.height = "0px";
      if (accordion.id == "regions") {
        const $regions = accordion.querySelectorAll(".card");
        const regionName = [];
        $regions.forEach((region) => {
          if (region.classList.contains("active")) {
            let name = region.querySelector("p").textContent.toLowerCase();
            regionName.push(name);
          }
        });
        if (!regionName.length == 0) {
          filterByRegion(regionName);
          filter = 1;
          fil = 1;
        }
      }
      if (accordion.id == "types") {
        const $types = accordion.querySelectorAll(".type-container");
        const typeName = [];
        $types.forEach((type) => {
          if (!type.classList.contains("disable")) {
            let name = type.querySelector("span").textContent.toLowerCase();
            typeName.push(name);
          }
        });
        if (!typeName.length == 0) {
          filterByType(typeName, filter);
          filter = 1;
          fil = 1;
        }
      }
    });
    if (filter == 0) {
      loadMorePokemon(allPokemonData);
    } else {
      loadMorePokemon(filteredPokemon);
      filter = 0;
    }
  });
  $reset.addEventListener("click", () => {
    $filters.classList.remove("show");
    $cardsContainer.scrollTop = 0;

    $accordions.forEach((accordion) => {
      accordion.classList.remove("open");
      accordion.querySelector(".accordion__content").style.height = "0px";
      if (accordion.id == "regions") {
        const $regions = accordion.querySelectorAll(".card");
        $regions.forEach((region) => {
          region.classList.remove("active");
        });
      }
      if (accordion.id == "types") {
        const $types = accordion.querySelectorAll(".type-container");
        $types.forEach((type) => {
          type.classList.add("disable");
        });
      }
    });
    $cardsContainer.innerHTML = "";
    updateOffset(0);
    updateCount(0);
    updatefiltr(0);
    updateFilteredPokemon([]);
    $input.value = "";
    loadMorePokemon(allPokemonData);
  });
}
