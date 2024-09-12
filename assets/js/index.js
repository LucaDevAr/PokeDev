import { pokedex } from "../../scripts/pokedex.js";
import { header } from "../../scripts/header.js";
import { accordion } from "../../scripts/accordion.js";
import { filters } from "../../scripts/filters.js";
import { searchBar } from "../../scripts/search-bar.js";
import { scroll } from "../../scripts/scroll.js";
document.addEventListener("DOMContentLoaded", async () => {
  await pokedex();
});
scroll();
header();
accordion();
filters();
searchBar();
