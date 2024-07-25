const SLIDE_PUZZLE_ULR = "/slide-puzzle";
const WORDLE_ULR = "/wordle";
const INDEX = "/";



document.getElementById("slide-go-btn")?.addEventListener("click", () => {
  window.location.href = SLIDE_PUZZLE_ULR ;
});

document.getElementById("wordle-go-btn")?.addEventListener("click", () => {
  window.location.href = WORDLE_ULR;
});

document.getElementById("back-btn")?.addEventListener("click", () => {
  window.location.href = INDEX;
});