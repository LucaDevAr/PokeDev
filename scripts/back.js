const $back = document.getElementById("back");
export function back() {
  $back.addEventListener("click", () => {
    history.back();
  });
}
