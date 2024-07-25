import { testDictionary, realDictionary} from "./Objects/dictionary.js";
import { sixth_grade_unit_1} from "./Objects/vocabularyPool.js";
import {COLUMNS_COUNT, HINT_LENGHT, ROWS_COUNT} from "./constants/wordle.js";
import {shuffle} from "./Utils.js";

const dictionary = realDictionary;
const vocabularyPool = sixth_grade_unit_1;
const state = {
  secret: getRandomWordFromVocabularyPool(),
  grid: Array(ROWS_COUNT)
    .fill()
    .map(() => Array(COLUMNS_COUNT).fill('')),

  currentRow: 0,
  currentCol: 0,
};

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      if (box) {
        box.textContent = state.grid[i][j];
      }
    }
  }
}


function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = "box";
  box.id = `box${row}${col}`;
  box.textContent = letter;

  container.appendChild(box);
  return box;
}

function drawGrid(container) {
  const grid = document.createElement("div");
  grid.className = "grid";

  for (let i = 0; i < ROWS_COUNT; i++) {
    for (let j = 0; j < COLUMNS_COUNT; j++) {
      drawBox(grid, i, j);
    }
  }
  container.appendChild(grid);
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isValidWord(word) {
  word = word.toLowerCase();
  return dictionary.includes(word);
}
function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revealWord(guess) {
  guess.toLowerCase();

  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent.toLowerCase();
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret.toLowerCase() === guess.toLowerCase();
  const isGameOver = state.currentRow === ROWS_COUNT - 1;

  setTimeout(() => {
    if (isWinner) {
      showWinModal("Congratulations! Yow discovered the word 🥳! ")
    } else if (isGameOver) {
      showWinModal(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    // if commits word
    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isValidWord(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert("Not a valid word");
        }
      }
    }
    // if delete
    if (key === 'Backspace') {
      removeLetter();
    }
    // if add
    key.toLowerCase();
    if (isLetter(key)) {
      addLetter(key)
    }
    updateGrid();
  };
}


function startup() {
  const game = document.getElementById("game");
  drawGrid(game);

  registerKeyboardEvents();

  populateHintModal();

  console.log(state.secret);
}

document.getElementById("btn-newgame")?.addEventListener("click", () =>{
  location.reload();
})

document.getElementById("btn-hints")?.addEventListener("click", () =>{
  showHintModal();
})

function showWinModal(text) {
  $('#WinModalCenter').on('click', 'button.close', function (eventObject) {
    $('#WinModalCenter').modal('hide');
  });
  const modalTitle = document.getElementById("FinalModalTitle");
  modalTitle.textContent = text;
  $('#WinModalCenter').modal('show');

}

document.getElementById("btn-instructions")?.addEventListener("click", () => {
  $('#instructions-modal').on('click', 'button.close', function (eventObject) {
    $('#instructions-modal').modal('hide');
  });

  $('#instructions-modal').modal('show');

})

document.addEventListener('DOMContentLoaded', function () {
  const keys = document.querySelectorAll('.key');

  keys.forEach(key => {
    key.addEventListener('click', function () {
      const keyValue = key.dataset.key;

      const keyboardEvent = new KeyboardEvent('keydown', { key: keyValue });
      document.body.dispatchEvent(keyboardEvent);
    });
  });
});

function showHintModal() {
  $('#HintModalCenter').on('click', 'button.close', function (eventObject) {
    $('#HintModalCenter').modal('hide');
  });
  $('#HintModalCenter').modal('show');
}

function populateHintModal() {
  const modalBody = document.getElementById("modal-hint-body");

  let posibleWords = [state.secret];
  while (posibleWords.length < HINT_LENGHT) {
    let word = getRandomWordFromVocabularyPool();
    if (!posibleWords.includes(word)) {
      posibleWords.push(word);
    }
  }
  shuffle(posibleWords);
  let textBody = document.createElement("p");
  textBody.classList.add("textBody")
  for (let element in posibleWords) {
    console.log(posibleWords[element])
    textBody.innerHTML += posibleWords[element] + "<br>";
  }

/*
  for (let i = 0; i < characterSelected.description.length ; i++) {
    textBody.innerHTML += `${characterSelected.description[i]} <br>`;
  }

 */
  console.log(posibleWords);

  modalBody.append(textBody);
}

function getRandomWordFromVocabularyPool() {
  return vocabularyPool[Math.floor(Math.random() * vocabularyPool.length)];
}

window.addEventListener("load", () => {
  showHintModal();
})


startup();