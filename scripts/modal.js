export function modal(pokemonData, types) {
  const $modal = document.querySelector(".modal");
  $modal.innerHTML = `
        <!-- Top Modal -->
        <div class="top">
          <i class="ri-arrow-left-s-line ${
            pokemonData.types[0].type.name
          }-c" id="back"></i>
          <div class="variants ${pokemonData.types[0].type.name}-bg">
            <i class="ri-sparkling-2-line"></i>
            <img src="/assets/images/mega-stone.png" alt="" />
            <img src="/assets/images/gigamax.png" alt="" />
          </div>
          <i class="ri-heart-line ${pokemonData.types[0].type.name}-c"></i>
        </div>
        <!-- Middle Modal -->
        <div class="middle">
          <!-- Pokemon -->
          <div class="pokemon">
            <img src="${pokemonData.sprites.other.home.front_default}" alt="" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="560"
              height="380"
              viewBox="0 0 560 380"
              fill="none"
            >
              <path
                class="${pokemonData.types[0].type.name}-svg"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M159.922 0C71.5993 0 0 71.5993 0 159.922C0 234.46 50.9949 297.088 120 314.82V367.705C120 384.628 135.258 379.379 139.12 377.779C139.71 377.535 140.234 377.166 140.692 376.722L199.405 319.843H400.078C488.401 319.843 560 248.244 560 159.922C560 71.5993 488.401 0 400.078 0H159.922Z"
                fill="#181721"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M330 82C318.954 82 310 90.9543 310 102V222C310 233.046 318.954 242 330 242C341.046 242 350 233.046 350 222V102C350 90.9543 341.046 82 330 82ZM210 162L90 231.282V92.718L210 162ZM250 142C250 130.954 258.954 122 270 122C281.046 122 290 130.954 290 142V182C290 193.046 281.046 202 270 202C258.954 202 250 193.046 250 182V142ZM370 142C370 130.954 378.954 122 390 122C401.046 122 410 130.954 410 142V182C410 193.046 401.046 202 390 202C378.954 202 370 193.046 370 182V142ZM450 82C438.954 82 430 90.9543 430 102V222C430 233.046 438.954 242 450 242C461.046 242 470 233.046 470 222V102C470 90.9543 461.046 82 450 82Z"
                fill="#fff"
              />
            </svg>
          </div>
          <div class="header">
            <h3>${pokemonData.name}</h3>
            <div class="types">${types}</div>
            <span>#${String(pokemonData.id).padStart(4, "0")}</span>
          </div>
        </div>
        <!-- Info -->
        <div class="info ${pokemonData.types[0].type.name}-bg"></div>
        <!-- Slider Indicator -->
        <div class="indicator">
          <img src="/assets/images/pokemon/gengar-2.png" alt="" />
          <img src="/assets/images/pokemon/blastoise-2.png" alt="" />
          <img src="/assets/images/pokemon/venusaur-2.png" alt="" />
          <img src="/assets/images/pokemon/moltres-2.png" alt="" />
          <img src="/assets/images/pokemon/eevee-2.png" alt="" />
          <div class="indicator-label ${
            pokemonData.types[0].type.name
          }-bg"></div>
        </div>
        <!-- More -->
        <div class="more">
          <i class="ri-add-line ${pokemonData.types[0].type.name}-c"></i>
        </div>`;
  $modal.classList.add("show");

  const $plus = $modal.querySelector(".more"),
    $close = $modal.querySelector("#back");

  $plus.addEventListener("click", () => {
    $modal.classList.toggle("info");
  });

  $close.addEventListener("click", () => {
    $modal.classList.remove("show");
    $modal.classList.remove("info");
  });
}
