export function modal() {
  const $modal = document.querySelector(".modal"),
    $plus = $modal.querySelector(".more"),
    $close = $modal.querySelector("#back"),
    $cards = document.querySelectorAll(".pokemon-card"),
    $body = document.querySelector("body");

  $plus.addEventListener("click", () => {
    $modal.classList.toggle("info");
  });

  $cards.forEach((card) => {
    card.addEventListener("click", () => {
      $modal.classList.add("show");
      $body.style.overflowY = "hidden";
    });
  });

  $close.addEventListener("click", () => {
    $modal.classList.remove("show");
    $body.style.overflowY = "scroll";
    $modal.classList.remove("info");
  });
}
