export function modal() {
  const $modal = document.querySelector(".modal"),
    $plus = $modal.querySelector(".more"),
    $close = $modal.querySelector("#back"),
    $cards = document.querySelector(".cards-container");

  $plus.addEventListener("click", () => {
    $modal.classList.toggle("info");
  });

  $cards.addEventListener("click", (e) => {
    console.log(e);
    if (
      e.target.classList.contains("pokemon-card") ||
      e.target.closest(".pokemon-card")
    ) {
      $modal.classList.add("show");
    }
  });

  $close.addEventListener("click", () => {
    $modal.classList.remove("show");
    $modal.classList.remove("info");
  });
}
