// Core Constants and Imports
import { testDictionary, realDictionary } from "./Objects/dictionary.js";
import { sixth_grade_unit_1 } from "./Objects/vocabularyPool.js";
import { COLUMNS_COUNT, HINT_LENGHT, ROWS_COUNT } from "./constants/wordle.js";
import { shuffle, playWinSound } from "./Utils.js";

// Game Configuration
const dictionary = realDictionary;
const vocabularyPool = sixth_grade_unit_1;
const animationDuration = 500; // ms

// Game State
const state = {
  secret: getRandomWordFromVocabularyPool(),
  grid: Array(ROWS_COUNT).fill().map(() => Array(COLUMNS_COUNT).fill('')),
  currentRow: 0,
  currentCol: 0,
};

// Utility Functions
function getRandomWordFromVocabularyPool() {
  return vocabularyPool[Math.floor(Math.random() * vocabularyPool.length)];
}

function isLetter(key) {
  return key.length === 1 && /[a-z]/i.test(key);
}

function getCurrentWord() {
  return state.grid[state.currentRow].join('');
}

function isValidWord(word) {
  return dictionary.includes(word.toLowerCase());
}

function countOccurrences(word, letter) {
  return [...word].filter((char) => char === letter).length;
}

function getPositionOccurrence(word, letter, position) {
  return [...word.slice(0, position + 1)].filter((char) => char === letter).length;
}

// DOM Manipulation
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

function updateGrid() {
  state.grid.forEach((row, rowIndex) => {
    row.forEach((letter, colIndex) => {
      const box = document.getElementById(`box${rowIndex}${colIndex}`);
      if (box) box.textContent = letter;
    });
  });
}

function revealWord(guess) {
  const { secret, currentRow } = state;

  guess.toLowerCase();
  [...guess].forEach((letter, i) => {
    const box = document.getElementById(`box${currentRow}${i}`);
    const secretOccurrences = countOccurrences(secret.word, letter);
    const guessOccurrences = countOccurrences(guess, letter);
    const positionOccurrence = getPositionOccurrence(guess, letter, i);

    setTimeout(() => {
      if (guessOccurrences > secretOccurrences && positionOccurrence > secretOccurrences) {
        box.classList.add('empty');
      } else if (letter === secret.word[i]) {
        box.classList.add('right');
      } else if (secret.word.includes(letter)) {
        box.classList.add('wrong');
      } else {
        box.classList.add('empty');
      }
    }, ((i + 1) * animationDuration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animationDuration) / 2}ms`;
  });

  checkGameEnd(guess);
}

function checkGameEnd(guess) {
  const isWinner = state.secret.word.toLowerCase() === guess.toLowerCase();
  const isGameOver = state.currentRow === ROWS_COUNT - 1;

  setTimeout(() => {
    if (isWinner) {
      showModal("Congratulations! You discovered the word 🥳!");
      playWinSound();
    } else if (isGameOver) {
      showModal(`Better luck next time! The word was ${state.secret.word}.`);
    }
  }, 3 * animationDuration);
}

function showModal(message) {
  $('#WinModalCenter').on('click', 'button.close', function (eventObject) {
    $('#WinModalCenter').modal('hide');
  });
  const modalTitle = document.getElementById("FinalModalTitle");
  modalTitle.textContent = message;
  $("#WinModalCenter").modal("show");
}

// Event Listeners
function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;

    if (key === 'Enter' && state.currentCol === COLUMNS_COUNT) {
      const word = getCurrentWord();
      if (isValidWord(word)) {
        revealWord(word);
        state.currentRow++;
        state.currentCol = 0;
      } else {
        alert("Not a valid word");
      }
    } else if (key === 'Backspace') {
      removeLetter();
    } else if (isLetter(key)) {
      addLetter(key);
    }
    updateGrid();
  };
}

function addLetter(letter) {
  if (state.currentCol < COLUMNS_COUNT) {
    state.grid[state.currentRow][state.currentCol] = letter;
    state.currentCol++;
  }
}

function removeLetter() {
  if (state.currentCol > 0) {
    state.currentCol--;
    state.grid[state.currentRow][state.currentCol] = '';
  }
}

function startup() {
  const game = document.getElementById("game");
  drawGrid(game);
  registerKeyboardEvents();
  populateHintModal();
  console.log(state.secret.word);
}

function populateHintModal() {
  const modalBody = document.getElementById("modal-hint-body");
  modalBody.innerHTML = '';

  const possibleWords = [state.secret];
  while (possibleWords.length < HINT_LENGHT) {
    const word = getRandomWordFromVocabularyPool();
    if (!possibleWords.some(w => w.word === word.word)) {
      possibleWords.push(word);
    }
  }
  shuffle(possibleWords);

  const table = document.createElement("table");
  table.classList.add("hint-table", "table", "table-stripe", "table-hover");

  const headerRow = document.createElement("tr");
  ["Word", "Meaning", "Audio"].forEach(headerText => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  possibleWords.forEach(({ word, meaning, audio_path }) => {
    const row = document.createElement("tr");

    const wordCell = document.createElement("td");
    wordCell.textContent = word;
    row.appendChild(wordCell);

    const meaningCell = document.createElement("td");
    meaningCell.textContent = meaning;
    row.appendChild(meaningCell);

    const audioCell = document.createElement("td");
    const audioButton = document.createElement("button");
    audioButton.textContent = "▶️";
    audioButton.addEventListener("click", () => {
      const audio = new Audio(audio_path);
      audio.play();
    });
    audioCell.appendChild(audioButton);
    row.appendChild(audioCell);

    table.appendChild(row);
  });

  modalBody.appendChild(table);
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

function showHintModal() {
  $('#HintModalCenter').on('click', 'button.close', function (eventObject) {
    $('#HintModalCenter').modal('hide');
  });
  $('#HintModalCenter').modal('show');
}



// Initialization
window.addEventListener("load", showHintModal);
startup();
