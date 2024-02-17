export function input() {
  const $input = document.querySelector("input");
  const placeholder = $input.getAttribute("placeholder");
  function truncarPlaceholder() {
    // Calcula el ancho disponible restando el padding izquierdo y derecho del ancho total del input
    const anchoDisponible =
      $input.offsetWidth -
      parseFloat(window.getComputedStyle($input).paddingLeft) -
      parseFloat(window.getComputedStyle($input).paddingRight);

    if ($input.scrollWidth > anchoDisponible) {
      $input.setAttribute("title", placeholder);
      let truncado = placeholder.substring(
        0,
        Math.floor((anchoDisponible - 10) / 10)
      ); // Ajuste aquí
      $input.setAttribute("placeholder", truncado + "...");
    }
  }
  truncarPlaceholder();
  window.addEventListener("resize", truncarPlaceholder);
}
