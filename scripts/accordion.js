export function accordion() {
  const $accordionItem = document.querySelectorAll(".accordion__item");
  $accordionItem.forEach((item) => {
    let $header = item.querySelector(".accordion__header");
    $header.addEventListener("click", (e) => {
      item.classList.toggle("open");
      let $content = item.querySelector(".accordion__content");
      item.classList.contains("open")
        ? ($content.style.height = `${$content.scrollHeight}px`)
        : ($content.style.height = "0px");
    });
  });

  const $types = document.querySelectorAll(
    ".accordion__content .type-container"
  );

  $types.forEach((type) => {
    type.addEventListener("click", (e) => {
      type.classList.toggle("disable");
    });
  });

  const $region = document.querySelectorAll(".accordion__content .card");

  $region.forEach((region) => {
    region.addEventListener("click", (e) => {
      region.classList.toggle("active");
    });
  });
}
