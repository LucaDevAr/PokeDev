export function header() {
  const $pokemonContainer = document.querySelector(".cards-container"),
    $header = document.querySelector("header");
  $pokemonContainer.addEventListener("scroll", () => {
    $pokemonContainer.scrollTop > 0
      ? $header.classList.add("shadow")
      : $header.classList.remove("shadow");
  });
}
