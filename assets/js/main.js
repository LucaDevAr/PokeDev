import { pokedex } from "../../scripts/pokedex.js";
import { header } from "../../scripts/header.js";
import { back } from "../../scripts/back.js";
import { input } from "../../scripts/input.js";
import { accordion } from "../../scripts/accordion.js";
import { filters } from "../../scripts/filters.js";
import { searchBar } from "../../scripts/search-bar.js";
import { scroll } from "../../scripts/scroll.js";

document.addEventListener("DOMContentLoaded", async () => {
  await pokedex();
});
scroll();
header();
back();
input();
accordion();
filters();
searchBar();
