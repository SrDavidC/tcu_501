export function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function playWinSound() {
  return new Promise((resolve, reject) => {
    let audio = new Audio("sounds/win.mp3");

    audio.addEventListener('ended', () => {
      resolve();
    });

    audio.addEventListener('error', (error) => {
      reject(error);
    });

    audio.play();
  });
}

