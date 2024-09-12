export function changeCarousel(pokemonsData) {
  const swiperInstance = getSwiperInstance();
  const $swiperWrapper = document.querySelector(".swiper-wrapper");

  // Limpiar el contenido actual del slider
  $swiperWrapper.innerHTML = "";

  let pokemons;
  if (pokemonsData.length >= 1025) {
    pokemons = pokemonsData.slice(0, 1025);
  } else {
    pokemons = pokemonsData;
  }

  // Crear y agregar nuevos slides al slider
  pokemons.forEach((pokemon, index) => {
    const $slide = document.createElement("div");
    $slide.classList.add("swiper-slide");

    const $img = document.createElement("img");
    $img.src = pokemon.sprites.other.home.front_default;
    $img.alt = pokemon.name;
    $img.dataset.index = index;
    $slide.appendChild($img);
    $swiperWrapper.appendChild($slide);
  });

  // Actualizar el slider sin recrear la instancia
  swiperInstance.update();
}

export function getSwiperInstance() {
  // Obtener la instancia del swiper existente
  return document.querySelector(".swiper-container").swiper;
}
