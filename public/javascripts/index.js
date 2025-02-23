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

document.getElementById("about-us-btn")?.addEventListener("click", () => {
  document.getElementById('btn-close').disabled = false;
    let modalElement = new bootstrap.Modal(document.getElementById('about-us-modal'));
    modalElement.show();
  });

