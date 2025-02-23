import { shuffle, playWinSound } from "./Utils.js";
import { CharacterSP } from "./Objects/CharacterSP.js";
import { AUDIOS_HEROES_PATH } from "./constants/slidepuzzle.js";

const CONFIG = {
    allowOnlyAdjacentMoves: false,
    rows: 3,
    columns: 3,
    blankTileName: "3.jpg",
    initialTurns: 0,
    imagePath: "images/slide_puzzle/",
};

const imgCharacters = [
    "juan_santamaria", "carmen_lyra", "shirley_cruz", "batman", "wonder_woman",
    "superman", "aquaman", "flash", "ironman", "spiderman", "thor",
];

let currTile = null;
let otherTile = null;
let turns = CONFIG.initialTurns;
let characterSelected = "";
const charactersMap = new Map();

window.onload = initializeGame;

document.getElementById("btn-newgame")?.addEventListener("click", () => location.reload());
document.getElementById("btn-instructions")?.addEventListener("click", showInstructionsModal);

function initializeGame() {
    initCharactersMap();
    const shuffledImages = shuffleImages();
    characterSelected = selectRandomCharacter();
    setupBoard(shuffledImages);
}

function shuffleImages() {
    const imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
    shuffle(imgOrder);
    return imgOrder;
}

function selectRandomCharacter() {
    const randomIndex = Math.floor(Math.random() * imgCharacters.length);
    const character = imgCharacters[randomIndex];
    return charactersMap.get(character);
}

function setupBoard(imgOrder) {
    const board = document.getElementById("board");
    const fullPath = `${CONFIG.imagePath}${characterSelected.filename}/`;

    for (let r = 0; r < CONFIG.rows; r++) {
        for (let c = 0; c < CONFIG.columns; c++) {
            const tile = createTile(r, c, imgOrder.shift(), fullPath);
            board.appendChild(tile);
        }
    }
}

function createTile(row, col, imgName, fullPath) {
    const tile = document.createElement("img");
    tile.id = `${row}-${col}`;
    tile.src = `${fullPath}${imgName}.jpg`;
    tile.classList.add("board_tile");

    if (isMobileDevice()) {
        tile.addEventListener("click", onClickTile);
    } else {
        addDragEventListeners(tile);
    }

    return tile;
}

function addDragEventListeners(tile) {
    tile.addEventListener("dragstart", () => (currTile = tile));
    tile.addEventListener("dragover", (e) => e.preventDefault());
    tile.addEventListener("dragenter", (e) => e.preventDefault());
    tile.addEventListener("drop", () => {
        otherTile = tile;
        swapTiles();
        handleWin();
    });
}

function onClickTile() {
    if (!currTile) {
        currTile = this;
        currTile.style.boxShadow = "0 0 20px #00f";
    } else {
        otherTile = this;
        swapTiles();
        resetTileSelection();
        handleWin();
    }
}

function resetTileSelection() {
    if (currTile) currTile.style.boxShadow = "none";
    currTile = null;
}

function swapTiles() {
    if (!isValidMove()) return;

    const currImg = currTile.src;
    currTile.src = otherTile.src;
    otherTile.src = currImg;

    turns++;
}

function isValidMove() {
    const [currRow, currCol] = currTile.id.split("-").map(Number);
    const [otherRow, otherCol] = otherTile.id.split("-").map(Number);

    const isAdjacent =
        (currRow === otherRow && Math.abs(currCol - otherCol) === 1) ||
        (currCol === otherCol && Math.abs(currRow - otherRow) === 1);

    return !CONFIG.allowOnlyAdjacentMoves || isAdjacent;
}

function handleWin() {
    if (checkWinner()) {
        playWinSound().then(showWinModal);
    }
}

function checkWinner() {
    const tiles = Array.from(document.getElementsByClassName("board_tile"));
    for (let i = 0; i < tiles.length - 1; i++) {
        const currNum = extractTileNumber(tiles[i].src);
        const nextNum = extractTileNumber(tiles[i + 1].src);
        if (currNum > nextNum) return false;
    }
    return true;
}

function extractTileNumber(src) {
    return parseInt(src.match(/(\d)\.jpg$/)[1]);
}

function showWinModal() {
    const modal = document.getElementById("WinModalCenter");
    clearModalBody();

    const modalBody = document.getElementById("modal-winner-body");
    const message = `<h2>You discovered the image of ${characterSelected.name}</h2>`;
    const description = characterSelected.description.join("<br>");

    modalBody.innerHTML = `${message}<br>${description}`;
    modal.style.display = "block";

    characterSelected.playAudio().then(() => enableButtons());
}

function clearModalBody() {
    const modalBody = document.getElementById("modal-winner-body");
    modalBody.innerHTML = "";
}

function enableButtons() {
    document.getElementById("btn-newgame").disabled = false;
    document.getElementById("btn-close").disabled = false;
}

function showInstructionsModal() {
    $('#instructions-modal').on('click', 'button.close', function (eventObject) {
        $('#instructions-modal').modal('hide');
    });

    $('#instructions-modal').modal('show');

}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

function initCharactersMap() {
    charactersMap.set("juan_santamaria", new CharacterSP("Juan Santamaria",
            ["Juan Santamaria Day is a" +
            " holiday in Costa Rica, and it is celebrated on April 11th. \n" +
            "The holiday commemorates the Battle of Rivas, made famous by the heroic actions of the National Hero, Juan Santamaria:" +
            " the \"Little Drummer Boy\".\n", "He is brave.", "Juan Santamaría was successful in his mission and his actions helped" +
            " Costa Ricans win the battle, Santamaria was killed by enemy fire.\n"]
            , AUDIOS_HEROES_PATH + "Juan_Santamaria.wav", "juan_santamaria"
        )
    )

    charactersMap.set("carmen_lyra", new CharacterSP("Carmen Lyra", [
            "María Isabel Carvajal (Carmen Lyra) was a writer.",
            "She wrote and published the fairy tale collection \"Cuentos de mi tía Panchita\" and was the first female Costa Rican writer. \n"
            , "She was an intellectual, smart, brave and visionary woman.\n",
            "Carmen Lyra’s face is on the 20000 colones bill.\n"]
        , AUDIOS_HEROES_PATH + "Carmen_Lyra.wav", "carmen_lyra")
    )

    charactersMap.set("shirley_cruz", new CharacterSP("Shirley Cruz", [
            "Shirley Cruz Traña was born on August 28, 1985, in San José, Costa Rica. She is a Costa Rican soccer player.",
            "She currently plays in the Chinese club Jiangsu Suning of the Chinese Women’s Super League.",
            "She was the first female professional soccer player in Costa Rica and is the most successful Central American player as a professional soccer player.",
            "She is an extraordinary athlete, strong, disciplined, confident and hard working. She is a leader."]
        , AUDIOS_HEROES_PATH + "Shirley_Cruz.wav", "shirley_cruz")
    )

    charactersMap.set("superman", new CharacterSP("Superman", [
            "Superman is a superhero.",
            "He comes from a place called Krypton. His real name is Clark Kent.",
            "He can fly, be super strong, and really fast.",
            "Superman is a good guy who helps people",]
        , AUDIOS_HEROES_PATH + "Superman.wav", "superman")
    )

    charactersMap.set("batman", new CharacterSP("Batman", [
            "Bruce Wayne was born in a big city called Gotham City.",
            "He is born in a wealthy family.",
            "When he is a child, criminals killed his parents. He promises to take revenge.",
            "He takes a secret identity inspired in the capacities of bats and becomes Batman.",
            "He develops special weapons to fight all criminals at Gotham city as well as mental and physical abilities.",
            "He is very smart and can solve all types of riddles.",
            "He can fly like bats; he has a lot of physical strength and ability to fight the villains."
        ], AUDIOS_HEROES_PATH + "Batman.wav", "batman"
        )
    )

    charactersMap.set("wonder_woman", new CharacterSP("Wonder Woman", [
                "Wonder Woman’s real name is Princess Diana.",
                "She is a descendent of the mythical Amazon Women of Greece. Princess Diana is the daughter of Zeus.",
                "Wonder Woman is immortal, this means she cannot die.",
                "She wears bulletproof bracelets.",
                "She also has great strength and speed.",
                "Wonder Woman’s most special fighting tool is her Lasso of Truth. If she wraps this rope around a person and asks them questions, they tell the truth."
            ]
            , AUDIOS_HEROES_PATH + "Wonder_Woman.wav", "wonder_woman"
        ),
    )

    charactersMap.set("aquaman", new CharacterSP("Aquaman", [
                "Aquaman is the king of the ocean.",
                "He can swim fast and talk to fish.",
                "He is very strong in the water. Aquaman takes care of the sea and its animals.",
            ]
            , AUDIOS_HEROES_PATH + "Aquaman.wav", "aquaman"
        ),
    )

    charactersMap.set("flash", new CharacterSP("The Flash", [
                "The Flash is the fastest superhero.",
                "He runs very, very fast. He is faster than a car or a plane.",
                "The Flash helps people very quickly. He is also very kind.",
            ]
            , AUDIOS_HEROES_PATH + "The_Flash.wav", "flash"
        ),
    )

    charactersMap.set("thor", new CharacterSP("Thor", [
                "Thor is the god of thunder.",
                "He has a magic hammer. Only Thor can lift it.",
                "He is very strong.",
                "Thor can make lightning with his hammer. He protects people from bad guys."
            ]
            , AUDIOS_HEROES_PATH + "Thor.wav", "thor"
        ),
    )

    charactersMap.set("ironman", new CharacterSP("Iron Man", [
                "Iron Man is very smart. He wears a metal suit.",
                "The suit can fly and shoot lasers. ",
                "Iron Man builds cool machines.",
                "He uses them to save the world."
            ]
            , AUDIOS_HEROES_PATH + "Iron_Man.wav", "ironman"
        ),
    )

    charactersMap.set("spiderman", new CharacterSP("Spider-Man", [
                "Spider-Man is a superhero",
                "He can climb walls like a spider.",
                "He swings with his webs. He is fast and strong.",
                "He helps people when they are in danger."
            ]
            , AUDIOS_HEROES_PATH + "Spider_Man.wav", "spiderman"
        ),
    )

}
