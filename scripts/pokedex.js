import { modal } from "./modal.js";
import { createPokemonCardHTML } from "./cards.js";
import { getTypeSvgCode } from "./cards.js";
import { getVariants } from "./cards.js";

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
}

let swiperInstance;

export async function createPokemonSlider() {
  const $swiperContainer = document.querySelector(
    ".swiper-container .swiper-wrapper"
  );
  let centerSlideIndex = 0;
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
  const calculateSpaceBetween = (img, slides) => {
    return (window.innerWidth - img) / slides;
  };
  swiperInstance = new Swiper(".swiper-container", {
    slidesPerView: "5",
    freeMode: true,
    spaceBetween: calculateSpaceBetween(200, 4),
    centeredSlides: true,
    loop: false,
    on: {
      transitionEnd: function () {
        this.slideToLoop(this.activeIndex);
      },
    },
  });
  swiperInstance.on("slideChange", () => {
    centerSlideIndex = swiperInstance.realIndex;
    const centerSlide = $swiperContainer.querySelector(
      `.swiper-slide:nth-child(${centerSlideIndex + 1})`
    );
    if (centerSlide) {
      const centerImg = centerSlide.querySelector("img");
      const alt = centerImg.alt;
      allPokemonData.forEach((pokemon) => {
        if (pokemon.name == alt) {
          const variant = getVariants(pokemon);
          const type = getTypeSvgCode(pokemon);
          modal(pokemon, type, variant);
        }
      });
    }
  });

  window.addEventListener("resize", () => {
    const $line = document.querySelector(".line");
    const $tab = document.querySelector("h3.active");
    const currentCenterSlide = swiperInstance.slides[centerSlideIndex];
    const currentCenterSlideOffset =
      currentCenterSlide.offsetLeft - swiperInstance.translate;
    if (window.innerWidth >= "920") {
      swiperInstance.params.slidesPerView = "9";
      swiperInstance.params.spaceBetween = calculateSpaceBetween(360, 8);
      swiperInstance.update();
      setTimeout(() => {
        const $line = document.querySelector(".line");
        const $tab = document.querySelector("h3.active");
        $line.style.opacity = "1";
        $line.style.left = $tab.offsetLeft + "px";
      }, 1600);
    } else {
      swiperInstance.params.slidesPerView = "5";
      swiperInstance.params.spaceBetween = calculateSpaceBetween(200, 4);
      swiperInstance.update();
      $line.style.opacity = "1";
      $line.style.left = $tab.offsetLeft + "px";
    }
    swiperInstance.slideTo(centerSlideIndex, 0);
    swiperInstance.setTranslate(-currentCenterSlideOffset);
    setTimeout(() => {
      const $line = document.querySelector(".line");
      const $tab = document.querySelector("h3.active");
      $line.style.opacity = "1";
      $line.style.left = $tab.offsetLeft + "px";
    }, 1600);
  });

  $swiperContainer.addEventListener("click", (event) => {
    const $clickedImg = event.target.closest("img");
    if ($clickedImg) {
      const index = parseInt($clickedImg.dataset.index);
      swiperInstance.slideTo(index);
      updateCenterSlides(index);
      console.log(index);
    }
  });
}

export function goToSlide(index) {
  if (swiperInstance) {
    swiperInstance.slideTo(index);
  }
}
