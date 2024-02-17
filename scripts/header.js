export function header() {
  window.addEventListener("scroll", function () {
    const $header = document.querySelector("header");
    if (window.scrollY > 0) {
      $header.classList.add("shadow");
    } else {
      $header.classList.remove("shadow");
    }
  });
}
