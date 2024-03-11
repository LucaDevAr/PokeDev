import { modal } from "./modal.js";
export const allPokemonData = [];
const $cardsContainer = document.querySelector(".cards-container");
export let filteredPokemon = [];
export function updateFilteredPokemon(value) {
  filteredPokemon = value;
}
let offset = 0;
export function updateOffset(value) {
  offset = value;
}
let limit = 30;

export async function pokedex() {
  await firstLoadPokemonData();
  await getAllPokemonData();
  console.log(allPokemonData);
}

async function firstLoadPokemonData() {
  for (let i = 0; i < 30; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
    const pokemonData = await response.json();
    createPokemonCardHTML(pokemonData);
  }
}

async function getAllPokemonData() {
  for (let i = 0; i < 1025; i++) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
    const pokemonsData = await response.json();
    allPokemonData.push(pokemonsData);
  }
}
// Definimos los rangos de IDs para cada región
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

export function filterByRegion(regions) {
  regions.forEach((region) => {
    const { start, end } = regionRanges[region];
    const regionPokemon = allPokemonData.filter((pokemon) => {
      return pokemon.id >= start && pokemon.id <= end;
    });
    filteredPokemon = filteredPokemon.concat(regionPokemon);
  });
}

export function filterByType(types, filterCount) {
  filteredPokemon =
    filterCount == 0
      ? allPokemonData.filter((pokemon) => {
          return types.some((type) =>
            pokemon.types.some((t) => t.type.name === type)
          );
        })
      : filteredPokemon.filter((pokemon) => {
          return types.some((type) =>
            pokemon.types.some((t) => t.type.name === type)
          );
        });
}

var count = 0;
export function updateCount(value) {
  count = value;
}
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
    if (filteredPokemon.length > 0) {
      loadMorePokemon(filteredPokemon);
    } else {
      loadMorePokemon(allPokemonData);
    }
  }
});

async function createPokemonCardHTML(pokemon) {
  // console.log(pokemon.name);
  if (!pokemon) {
    console.error("El objeto pokemon es undefined");
    return;
  }
  const $cardsContainer = document.querySelector(".cards-container");
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.innerHTML = `
        <div class="top">
          <span>#${String(pokemon.id).padStart(4, "0")}</span>
          <i class="ri-heart-line heart"></i>
        </div>
        <img src="${
          pokemon.sprites.other.showdown.front_default ||
          pokemon.sprites.other.home.front_default
        }" alt="${pokemon.name}"/>
        <div class="bottom">
          <h3>${pokemon.name}</h3>
          <div class="types">${getTypeSvgCode(pokemon)}</div>
        </div>
      `;
  $cardsContainer.appendChild(pokemonCard);
  pokemonCard.addEventListener(
    "click",
    (e) => {
      if (e.target.classList.contains("heart")) {
        return;
      }
      modal(pokemon, getTypeSvgCode(pokemon));
    },
    true
  );
}

export async function loadMorePokemon(data) {
  for (let i = offset; i < offset + limit && i < data.length; i++) {
    createPokemonCardHTML(data[i]);
  }
  offset += limit;
}

function getTypeSvgCode(pokemon) {
  const types = pokemon.types;
  let svgCode = "";
  const typeSvgMap = {
    normal: `<div class="type-container normal-b">
              <div class="type normal-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M481 256C481 380.264 380.264 481 256 481C131.736 481 31 380.264 31 256C31 131.736 131.736 31 256 31C380.264 31 481 131.736 481 256ZM384.571 256C384.571 327.008 327.008 384.571 256 384.571C184.992 384.571 127.429 327.008 127.429 256C127.429 184.992 184.992 127.429 256 127.429C327.008 127.429 384.571 184.992 384.571 256Z" fill="white"/>
                </svg>
              </div>
              <span>Normal</span>
            </div>`,
    fighting: `<div class="type-container fighting-b">
                  <div class="type fighting-bg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M88.2336 42.5656C94.4299 18.1014 116.593 0 142.983 0C162.778 0 180.195 10.1847 190.279 25.6H206.792C217.051 15.0716 231.384 8.53333 247.245 8.53333C270.499 8.53333 290.471 22.5882 299.129 42.6667H312.954C321.617 37.2585 331.853 34.1333 342.818 34.1333C366.073 34.1333 386.044 48.1882 394.702 68.2667H432.297C432.618 68.2667 432.919 68.3532 433.178 68.5041C434.895 68.347 436.634 68.2667 438.391 68.2667C469.582 68.2667 494.866 93.5514 494.866 124.742V294.086L494.867 294.4L494.866 294.714V297.153C494.866 298.186 494.838 299.215 494.782 300.239C491.384 417.717 385.749 512 255.933 512C123.974 512 17 414.577 17 294.4C17 236.391 41.9249 183.683 82.5535 144.675C82.4522 201.228 83.4074 259.694 87.8107 258.691C99.6011 256.003 90.3891 80.8395 88.2336 42.5656Z" fill="white"/>
                    </svg>
                  </div>
                  <span>Fighting</span>
                </div>`,
    flying: `<div class="type-container flying-b">
                <div class="type flying-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M178.712 477.733C253.715 477.733 317.927 436.048 344.436 376.956C344.76 376.235 238.007 404.699 241.411 394.637C242.931 390.144 308.371 366.238 356.048 338.354C383.451 322.327 396.07 288.4 396.07 288.4C396.07 288.4 349.903 310.815 326.564 316.501C279.532 327.961 238.131 326.727 238.131 325.533C238.131 322.951 306.876 309.889 402.424 251.664C447.367 224.277 459.574 177.103 459.574 177.103C459.574 177.103 410.163 206.535 380.293 216.252C309.457 239.295 244.815 246.239 244.815 243.121C244.815 236.445 301.702 220.802 362.016 191.577C393.376 176.382 420.535 156.53 452.008 134.453C503.506 98.332 511.999 34 511.999 34C511.999 34 461.207 66.7601 436.42 77.6394C334.141 122.531 243.829 146.079 178.712 151.177C80.416 158.873 0 227.456 0 316.501C0 405.547 80.0119 477.733 178.712 477.733Z" fill="white"/>
                  </svg>
                </div>
                <span>Flying</span>
              </div>`,
    poison: `<div class="type-container poison-b">
                <div class="type poison-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M427.821 393.449C479.524 352.108 512 292.376 512 225.95C512 101.161 397.385 0 256 0C114.615 0 0 101.161 0 225.95C0 289.978 30.1737 347.786 78.6553 388.901C75.7171 399.046 74.1052 410.081 74.1052 421.62C74.1052 471.535 104.267 512 141.474 512C165.65 512 186.852 494.915 198.737 469.254C210.622 494.915 231.824 512 256 512C278.038 512 297.604 497.804 309.895 475.857C322.186 497.804 341.752 512 363.789 512C400.996 512 431.158 471.535 431.158 421.62C431.158 411.784 429.986 402.314 427.821 393.449ZM404.211 230.431C404.211 293.785 336.346 345.144 252.632 345.144C168.917 345.144 101.053 293.785 101.053 230.431C101.053 167.077 168.917 115.718 252.632 115.718C336.346 115.718 404.211 167.077 404.211 230.431Z" fill="white"/>
                  </svg>
                </div>
                <span>Poison</span>
              </div>`,
    ground: `<div class="type-container ground-b">
                <div class="type ground-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M112.764 439.754C112.625 439.754 112.528 439.617 112.574 439.486L243.289 70.134C243.318 70.0537 243.394 70 243.479 70H383.021C383.106 70 383.183 70.0541 383.211 70.1349L511.987 439.487C512.032 439.618 511.935 439.754 511.797 439.754H116.692H112.764ZM0.201306 441.199C0.0609122 441.199 -0.0362852 441.059 0.0129607 440.928L97.3526 181.056C97.3821 180.977 97.4571 180.925 97.541 180.925H182.118C182.258 180.925 182.355 181.064 182.307 181.195L88.1823 441.067C88.1535 441.146 88.0779 441.199 87.9932 441.199H0.201306Z" fill="white"/>
                  </svg>
                </div>
                <span>Ground</span>
              </div>`,
    rock: `<div class="type-container rock-b">
              <div class="type rock-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M395.138 244.757C395.109 244.717 395.097 244.667 395.105 244.618L427.769 54.1518C427.784 54.0641 427.861 54 427.949 54H438.287C438.367 54 438.437 54.0517 438.461 54.1277L512.051 287.131C512.074 287.203 512.049 287.283 511.989 287.33L457.73 329.693C457.649 329.756 457.532 329.74 457.471 329.657L395.138 244.757ZM-1 371.022C-1 371.101 -0.949204 371.171 -0.874109 371.196L110.975 407.767C111.029 407.785 111.089 407.776 111.136 407.744L361.145 235.144C361.187 235.115 361.215 235.07 361.222 235.02L388.032 55.1284C388.049 55.018 387.963 54.9188 387.852 54.9188H166.406C166.351 54.9188 166.3 54.943 166.265 54.9849L-0.957974 256.714C-0.98514 256.747 -1 256.788 -1 256.831V371.022ZM157.583 417.085L279.776 457.112C279.831 457.13 279.892 457.121 279.939 457.087L425.418 352.734C425.499 352.677 425.519 352.566 425.464 352.484L370.928 271.329C370.871 271.244 370.757 271.222 370.673 271.28L157.583 417.085Z" fill="white"/>
                </svg>
              </div>
              <span>Rock</span>
            </div>`,
    bug: `<div class="type-container bug-b">
            <div class="type bug-bg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="512" viewBox="0 0 512 512" width="512">
                <path clip-rule="evenodd" d="m342.198.501279c.373-.5317158 1.105-.660937 1.637-.288625l36.354 25.455546c.532.3723.661 1.1051.289 1.6368l-50.599 72.2623c24.599 7.8587 41.358 16.3357 41.358 16.3357s-40.964 70.462-110.443 70.462-118.85-65.672-118.85-65.672 17.506-11.172 43.456-20.7539l-55.5-66.1415c-.417-.4973-.352-1.2386.145-1.6558l33.997-28.52715c.498-.41723 1.239-.35238 1.656.14487l70.272 83.74688c6.017-.6806 12.147-1.061 18.333-1.061 8.891 0 17.771.6759 26.44 1.8229zm13.746 189.200721c18.541-13.242 46.597-47.804 46.597-47.804s71.664 56.79 71.664 177.206c0 120.415-123.896 192.888-123.896 192.888s-59.195-59.781-73.727-135.562c-14.531-75.781 21.496-159.927 21.496-159.927s39.324-13.559 57.866-26.801zm-199.683 0c-18.541-13.242-46.597-47.804-46.597-47.804s-71.664 56.79-71.664 177.206c0 120.415 123.896 192.888 123.896 192.888s59.195-59.781 73.727-135.562c14.531-75.781-21.496-159.927-21.496-159.927s-39.324-13.559-57.866-26.801z" fill="white" fill-rule="evenodd"/>
              </svg>
            </div>
            <span>Bug</span>
          </div>`,
    ghost: `<div class="type-container ghost-b">
              <div class="type ghost-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M368.952 510.227C322.769 512.591 269.896 512.591 251.928 510.227C111.77 491.788 0 389.313 0 250.8C0 112.287 114.615 0 256 0C397.385 0 512 112.287 512 250.8C512 315.221 487.207 373.969 446.46 418.387C435.395 430.448 450.577 438.908 466.002 447.504C481.13 455.935 496.492 464.496 487.564 476.712C477.726 490.173 424.392 507.389 368.952 510.227ZM220 219.45C220 241.092 202.091 258.637 180 258.637C157.909 258.637 140 241.092 140 219.45C140 204.935 148.055 192.264 160.024 185.491C160.713 204.362 176.229 219.449 195.269 219.449H220C220 219.449 220 219.45 220 219.45ZM343.976 185.491C343.287 204.362 327.771 219.449 308.731 219.449H284C284 219.449 284 219.45 284 219.45C284 241.092 301.909 258.637 324 258.637C346.091 258.637 364 241.092 364 219.45C364 204.935 355.945 192.264 343.976 185.491Z" fill="white"/>
                </svg>
              </div>
              <span>Ghost</span>
            </div>`,
    steel: `<div class="type-container steel-b">
              <div class="type steel-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.0511107 254.527C-0.0170046 254.411 -0.0170388 254.267 0.0510196 254.15L128.795 34.1843C128.862 34.0702 128.985 34 129.117 34H384.294C384.427 34 384.55 34.0708 384.617 34.1859L511.949 254.152C512.016 254.267 512.016 254.41 511.949 254.525L384.617 474.244C384.55 474.359 384.427 474.43 384.294 474.43H129.117C128.985 474.43 128.862 474.36 128.795 474.246L0.0511107 254.527ZM374.617 254.215C374.617 319.703 321.528 372.792 256.04 372.792C190.552 372.792 137.463 319.703 137.463 254.215C137.463 188.726 190.552 135.638 256.04 135.638C321.528 135.638 374.617 188.726 374.617 254.215Z" fill="white"/>
                </svg>
              </div>
              <span>Steel</span>
            </div>`,
    fire: `<div class="type-container fire-b">
              <div class="type fire-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M352.258 395.394C358.584 372.263 346.305 324.71 346.305 324.71C346.305 324.71 337.399 363.449 323.483 377.767C311.611 389.98 297.066 398.451 276.206 400.677C293.261 392.393 304.99 375.12 304.99 355.155C304.99 327.129 281.878 304.409 253.368 304.409C224.858 304.409 201.745 327.129 201.745 355.155C201.745 362.809 203.47 370.068 206.557 376.576C188.725 362.37 185.921 339.594 185.921 339.594C185.921 339.594 166.009 422.264 220.875 461.152C275.74 500.04 383.219 466.614 383.219 466.614C383.219 466.614 229.41 574.837 115.436 457.05C17.2568 355.584 89.8111 222.003 89.8111 222.003C89.8111 222.003 86.6777 234.395 86.6777 248.78C86.6777 263.165 94.477 274.11 94.477 274.11C94.477 274.11 117.742 225.071 135.848 205.128C152.984 186.254 174.465 170.946 193.019 157.724C207.301 147.546 219.849 138.604 227.343 130.223C268.62 84.0687 243.311 0 243.311 0C243.311 0 289.841 41.02 302.831 93.9978C307.783 114.192 304.597 137.169 301.749 157.716C297.125 191.072 293.388 218.025 326.793 216.276C380.775 213.449 333.866 130.223 333.866 130.223C333.866 130.223 456.318 194.583 447.17 307.145C438.021 419.707 313.324 445.297 313.324 445.297C313.324 445.297 345.931 418.525 352.258 395.394Z" fill="white"/>
                </svg>
              </div>
              <span>Fire</span>
            </div>`,
    water: `<div class="type-container water-b">
              <div class="type water-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M422.172 346.515C422.172 437.897 347.813 511.977 256.086 511.977C164.359 511.977 90 437.897 90 346.515C90 257.639 247.102 13.5479 255.718 0.22781C255.915 -0.0759384 256.258 -0.0759358 256.454 0.227813C265.07 13.5479 422.172 257.639 422.172 346.515ZM228.4 458.931C144.12 440.49 158.542 347.13 158.542 347.13C158.542 347.13 181.556 403.488 237.405 421.744C293.253 439.999 360.745 413.225 360.745 413.225C360.745 413.225 312.68 477.371 228.4 458.931Z" fill="white"/>
                /svg>
              </div>
              <span>Water</span>
            </div>`,
    grass: `<div class="type-container grass-b">
              <div class="type grass-bg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="512" viewBox="0 0 512 512" width="512">
                  <path clip-rule="evenodd" d="m97.4121 440.649c-1.7574-1.653-3.4954-3.338-5.2132-5.056-90.68455-90.684-90.68453-237.713 0-328.397 90.6841-90.6849 379.6401-96.7516 379.6401-96.7516s39.442 334.4646-51.242 425.1486c-80.54 80.54-205.522 89.55-296.005 27.031l72.908-89.471 116.55-25.163-95.139-9.511 60.462-61.562 68.824-15.077-54.422-16.117 54.422-98.176-77.41 86.828-29.893-42.183 10.523 69.648-53.917 60.782-24.993-76.9v102.268z" fill="white" fill-rule="evenodd"/>
                </svg>
              </div>
              <span>Grass</span>
            </div>`,
    electric: `<div class="type-container electric-b">
                  <div class="type electric-bg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M152.56 0.583659C152.461 0.29796 152.674 0 152.976 0H332.805C332.998 0 333.169 0.125587 333.226 0.309782L415.824 267.171C415.911 267.454 415.7 267.741 415.403 267.741H295.684C295.538 267.741 295.433 267.88 295.473 268.021L364.135 509.726C364.269 510.195 363.654 510.501 363.361 510.111L96.5295 155.267C96.3115 154.977 96.5184 154.563 96.881 154.563H205.536C205.687 154.563 205.793 154.414 205.743 154.271L152.56 0.583659Z" fill="white"/>
                    </svg>
                  </div>
                  <span>Electric</span>
                </div>`,
    psychic: `<div class="type-container psychic-b">
                <div class="type psychic-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M455.925 425.184C455.925 425.184 391.365 476.963 262.893 455.536C165.423 439.279 113.437 331.833 113.437 274.079C113.437 137.149 214.783 105.988 283.3 105.988C351.816 105.988 396.513 172.788 396.513 224.508C396.513 276.228 359.933 321.466 303.006 321.466C246.08 321.466 229.22 281.501 229.22 244.758C229.22 208.016 258.947 195.071 286.058 195.071C313.169 195.071 322.452 218.217 322.452 238.11C322.452 258.004 307.017 265.128 294.143 265.128C281.269 265.128 279.996 258.633 275.069 251.807C270.141 244.982 281.353 219.146 262.893 219.146C244.433 219.146 240.992 248.847 240.992 248.847C240.992 248.847 247.722 306.18 303.006 305.191C358.291 304.201 384.518 261.461 376.896 219.146C369.274 176.83 328.207 131.865 256.133 140.951C184.059 150.037 154.632 222.861 167.603 300.685C180.574 378.51 273.807 423.602 347.112 407.379C420.418 391.156 493.429 338.086 493.429 203.533C493.429 68.9789 376.896 -11.9002 237.941 1.42913C98.9859 14.7584 12.729 136.242 18.2502 282.207C23.7714 428.172 162.275 507.669 279.394 511.766C396.513 515.864 468.312 448.067 468.312 448.067C468.312 448.067 484.459 433.668 478.128 422.424C471.798 411.18 455.925 425.184 455.925 425.184Z" fill="white"/>
                  </svg>
                </div>
                <span>Psychic</span>
              </div>`,
    ice: `<div class="type-container ice-b">
            <div class="type ice-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M384.304 39.0418L385.879 177.392L265.209 235.319L263.721 104.69L384.304 39.0418Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M505.269 257.047L385.814 325.374L266.288 256.939L385.752 194.187L505.269 257.047Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M245.04 257.047L125.585 325.374L6.05861 256.939L125.523 194.187L245.04 257.047Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M124.243 38.4753L248.229 99.881L245.059 233.697L127.993 175.719L124.243 38.4753Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M387.678 473.525L263.692 412.119L266.862 278.302L383.928 336.281L387.678 473.525Z" fill="white"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="M128.525 474.77L126.949 336.42L247.62 278.493L249.108 409.121L128.525 474.77Z" fill="white"/>
              </svg>
            </div>
            <span>Ice</span>
          </div>`,
    dragon: `<div class="type-container dragon-b">
                <div class="type dragon-bg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M280.702 254.881C284.172 252.765 287.116 248.331 289.49 243.403C320.735 256.173 342.692 286.349 342.692 321.54C342.692 368.29 303.942 406.189 256.142 406.189C236.52 406.189 218.423 399.802 203.906 389.039C199.144 386.784 195.226 384.618 192.02 382.845C187.047 380.096 183.786 378.293 181.744 378.575C175.775 379.398 177.508 384.89 179.083 389.879C180.152 393.268 181.149 396.425 179.606 397.727C177.992 399.091 172.764 394.106 166.655 388.282C158.339 380.353 148.391 370.868 143.7 373.717C139.991 375.97 143.592 382.081 148 389.561L148.327 390.116C150.189 393.278 152.347 396.498 154.316 399.436C158.319 405.407 161.543 410.219 159.93 411.033C157.98 412.017 144.394 402.847 132.945 390.116C128.526 385.203 124.246 379.877 120.268 374.928L120.268 374.927C111.561 364.093 104.307 355.068 100.235 356.137C95.3365 357.423 99.0421 367.527 104.487 377.25C107.033 381.797 110.028 386.427 112.621 390.436L112.621 390.437C116.654 396.671 119.715 401.402 118.605 401.984C117.107 402.767 103.926 389.914 94.9734 373.717C89.6559 364.096 85.1909 353.464 81.5761 344.857C77.656 335.522 74.7359 328.569 72.8131 327.869C66.1325 325.438 66.1325 339.059 68.8119 358.718C69.1614 361.283 69.6819 363.973 70.3228 366.712C96.307 450.785 176.128 512 270.567 512C386.084 512 479.728 420.412 479.728 307.432C479.728 199.9 394.899 111.747 287.12 103.494C287.256 98.4284 289.9 88.383 289.9 88.383C289.9 88.383 308.927 42.3472 309.933 32.5099C309.999 31.857 310.078 31.1475 310.163 30.3919C311.348 19.7629 313.553 0 296.551 0C287.471 0 283.249 6.75464 278.42 14.4799L278.42 14.48C276.566 17.4457 274.622 20.5545 272.28 23.479C255.412 44.5436 227.048 70.8488 210.965 84.8631C176.971 114.484 143.619 138.828 124.167 153.026L124.167 153.026L124.166 153.027C115.319 159.484 109.348 163.843 107.5 165.644C93.574 179.22 43.6418 269.286 43.6418 269.286C43.6418 269.286 27.4943 298.182 33.2338 304.043C38.9733 309.903 52.8141 308.56 52.8141 308.56C52.8141 308.56 238.755 265.903 255.402 262.539C259.884 261.633 263.048 261.11 265.477 260.709C272.072 259.62 273.256 259.424 280.702 254.881ZM149.235 200.064C139.254 209.551 122.701 232.196 122.701 232.196C122.701 232.196 153.465 234.091 170.408 217.986C187.352 201.88 183.47 174.433 183.47 174.433C183.47 174.433 159.215 190.577 149.235 200.064Z" fill="white"/>
                  </svg>
                </div>
                <span>Dragon</span>
              </div>`,
    dark: `<div class="type-container dark-b">
              <div class="type dark-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M229.379 452.85C239.106 454.339 249.068 455.111 259.212 455.111C367.214 455.111 454.767 367.558 454.767 259.556C454.767 151.553 367.214 64 259.212 64C251.966 64 244.811 64.3941 237.77 65.1621C291.345 105.751 326.767 176.062 326.767 256C326.767 340.04 287.616 413.44 229.379 452.85ZM255.656 512C397.041 512 511.656 397.385 511.656 256C511.656 114.615 397.041 0 255.656 0C114.271 0 -0.34375 114.615 -0.34375 256C-0.34375 397.385 114.271 512 255.656 512Z" fill="white"/>
                </svg>
              </div>
              <span>Dark</span>
            </div>`,
    fairy: `<div class="type-container fairy-b">
              <div class="type fairy-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M102.726 405.978L184.848 382.166L255.778 511.857C255.871 512.025 256.112 512.025 256.204 511.857L327.134 382.166L409.257 405.978C409.441 406.031 409.612 405.86 409.557 405.676L385.741 325.179L511.856 256.204C512.025 256.112 512.025 255.871 511.857 255.779L384.702 186.235L409.557 102.225C409.612 102.041 409.441 101.87 409.257 101.923L325.208 126.294L256.204 0.126188C256.112 -0.0420597 255.871 -0.0420644 255.779 0.126184L186.775 126.294L102.726 101.923C102.542 101.87 102.371 102.041 102.426 102.225L127.281 186.235L0.126188 255.779C-0.0420597 255.871 -0.0420644 256.112 0.126184 256.204L126.241 325.179L102.426 405.676C102.371 405.86 102.542 406.031 102.726 405.978ZM166.452 256.876L224.631 288.695L256.45 346.873C256.542 347.042 256.784 347.042 256.876 346.873L288.695 288.695L346.873 256.876C347.041 256.784 347.041 256.542 346.873 256.45L288.695 224.631L256.876 166.453C256.784 166.284 256.542 166.284 256.45 166.453L224.631 224.631L166.452 256.45C166.284 256.542 166.284 256.784 166.452 256.876Z" fill="white"/>
                </svg>
              </div>
              <span>Fairy</span>
            </div>`,
  };
  types.forEach((type) => {
    if (type.type.name in typeSvgMap) {
      svgCode += typeSvgMap[type.type.name];
    }
  });
  return svgCode;
}
