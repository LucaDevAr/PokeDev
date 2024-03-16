import { modal } from "./modal.js";
import { createPokemonCardHTML } from "./cards.js";
import { getTypeSvgCode } from "./cards.js";
import { filterByType } from "./type.js";
export let allPokemonData = [];
export let filteredPokemon = [];
export function updateFilteredPokemon(value) {
  filteredPokemon = value;
}
let $cards = document.querySelectorAll(".pokemon-card");
export function getCards() {
  return $cards;
}
export function updateCards() {
  $cards = document.querySelectorAll(".pokemon-card");
  return $cards;
}
export async function pokedex() {
  await getAllPokemonData();
  createPokemonSlider();
  await firstLoadPokemonData();
  updateCards();
}

async function firstLoadPokemonData() {
  for (let i = 0; i < 30; i++) {
    await createPokemonCardHTML(allPokemonData[i]);
  }
}

async function getAllPokemonData() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1302");
  const data = await response.json();
  const pokemonList = data.results;

  await Promise.all(
    pokemonList.map(async (pokemon) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonData = await pokemonResponse.json();
      allPokemonData.push(pokemonData);
    })
  );
  allPokemonData.sort((a, b) => a.id - b.id);
  console.log(allPokemonData);
}

let swiperInstance;

export async function createPokemonSlider() {
  const $swiperContainer = document.querySelector(
    ".swiper-container .swiper-wrapper"
  );
  allPokemonData.slice(0, 1025).forEach((pokemon, index) => {
    const $slide = document.createElement("div");
    $slide.classList.add("swiper-slide");

    const $img = document.createElement("img");
    $img.src = pokemon.sprites.other.home.front_default;
    $img.alt = pokemon.name;
    $img.dataset.index = index;
    $slide.appendChild($img);
    $swiperContainer.appendChild($slide);
  });
  // Inicializar Swiper
  swiperInstance = new Swiper(".swiper-container", {
    slidesPerView: "5",
    freeMode: true,
    spaceBetween: `${(window.innerWidth - 200) / 4}`,
    centeredSlides: true,
    loop: false,
    on: {
      transitionEnd: function () {
        this.slideToLoop(this.activeIndex);
      },
    },
  });
  $swiperContainer.addEventListener("click", (event) => {
    const $clickedImg = event.target.closest("img");
    if ($clickedImg) {
      const index = parseInt($clickedImg.dataset.index);
      swiperInstance.slideTo(index);
    }
  });
  swiperInstance.on("slideChange", () => {
    const centerSlideIndex = swiperInstance.realIndex;
    const centerSlide = $swiperContainer.querySelector(
      `.swiper-slide:nth-child(${centerSlideIndex + 1})`
    );
    if (centerSlide) {
      const centerImg = centerSlide.querySelector("img");
      const alt = centerImg.alt;
      allPokemonData.forEach((pokemon) => {
        if (pokemon.name == alt) {
          const type = getTypeSvgCode(pokemon);
          modal(pokemon, type);
        }
      });
      console.log("Imagen en el centro:", alt);
      // Aquí puedes hacer lo que necesites con el alt de la imagen en el centro
    }
  });
}

export function goToSlide(index) {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
}
