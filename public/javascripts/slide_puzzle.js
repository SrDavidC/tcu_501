import {shuffle, playWinSound} from "./Utils.js";
import {CharacterSP} from "./Objects/CharacterSP.js";
import {AUDIOS_HEROES_PATH} from "./constants/slidepuzzle.js";

let allowOnlyAdjacentMoves = false;
let rows = 3;
let columns = 3;

let currTile;
let otherTile;
let blankTileName = "3.jpg";
let turns = 0;


let path = "images/slide_puzzle/"
// let imgOrder = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"];
const imgCharacters =
    ["juan_santamaria", "carmen_lyra",
        "shirley_cruz", "batman", "wonder_woman",
        "superman", "aquaman", "flash", "ironman", "spiderman",
        "thor"
    ];
let characterSelected = "";
const characters_map = new Map();

window.onload = function () {
    initCharactersMap();
    shuffle(imgOrder);
    let randomIndex = Math.floor(Math.random() * imgCharacters.length);
    let character = imgCharacters[randomIndex];
    characterSelected = characters_map.get(character);
    let fullPath = path + character + "/";
    // tcu_501/public/images/slide_puzzle/juan_santamaria/1.jpg
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // <img id="0-0" src= 1.jpg>
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = fullPath + imgOrder.shift() + ".jpg";
            tile.classList.add("board_tile");
            if (isMobileDevice()) {
                tile.addEventListener("click", onClickTile)
            } else {
                tile.addEventListener("dragstart", dragStart);  //click an image to drag
                tile.addEventListener("dragover", dragOver);    //moving image around while clicked
                tile.addEventListener("dragenter", dragEnter);  //dragging image onto another one
                tile.addEventListener("dragleave", dragLeave);  //dragged image leaving anohter image
                tile.addEventListener("drop", dragDrop);        //drag an image over another image, drop the image
                tile.addEventListener("dragend", dragEnd);      //after drag drop, swap the two tiles
            }
            document.getElementById("board").append(tile);
        }
    }
}

document.getElementById("btn-newgame")?.addEventListener("click", () => {
    location.reload();
})

function onClickTile() {
    if (currTile == null) {
        currTile = this;
        currTile.style.boxShadow = "0 0 20px #00f";
    } else {
        otherTile = this;
        swapTiles();
        currTile.style.boxShadow = "none";
        currTile = null;

        handleWin();
    }
}

function handleWin() {
    let isWinner = checkWinner();
    if (isWinner) {
        // console.log("Ganaste!!");
        playWinSound().then(() => {
            showWinModal();
        })
    }
}

function dragEnd() {
    swapTiles();
    // showWinModal();
    handleWin();
}

function showWinModal() {
    $('#WinModalCenter').on('click', 'button.close', function (eventObject) {
        $('#WinModalCenter').modal('hide');
    });
    document.getElementById('btn-close').disabled = true;
    const modalBody = document.getElementById("modal-winner-body");
    const textBodyElements = modalBody.children
    const textBodyArray = Array.from(textBodyElements);

    for (let element of textBodyArray) {
        element.parentNode.removeChild(element);
    }


    $('#WinModalCenter').modal('show');
    let textBody = document.createElement("p");
    textBody.classList.add("textBody");
    textBody.innerHTML += `<h2> You discovered the image of ${characterSelected.name}</h2> <br>`;
    textBody.innerHTML += `This is some information about this famous <br>`;

    for (let i = 0; i < characterSelected.description.length; i++) {
        textBody.innerHTML += `${characterSelected.description[i]} <br>`;
    }
    modalBody.append(textBody);
    characterSelected.playAudio().then(() => {
        document.getElementById('btn-newgame').disabled = false;
        document.getElementById('btn-close').disabled = false;
    });
}

document.getElementById("btn-instructions")?.addEventListener("click", () => {
    $('#instructions-modal').on('click', 'button.close', function (eventObject) {
        $('#instructions-modal').modal('hide');
    });

    $('#instructions-modal').modal('show');

})


function swapTiles() {
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);


    let moveLeft = r === r2 && c2 === c - 1;
    let moveRight = r === r2 && c2 === c + 1;

    let moveUp = c === c2 && r2 === r - 1;
    let moveDown = c === c2 && r2 === r + 1;

    let isAdjacent = moveRight || moveDown || moveLeft || moveUp;

    if (allowOnlyAdjacentMoves && !isAdjacent)
        return

    if (!(otherTile.src.includes(blankTileName)))
        return

    let currImg = currTile.src;
    let otherImg = otherTile.src;

    currTile.src = otherImg;
    otherTile.src = currImg;

    turns += 1;
    document.getElementById("turns").innerText = turns;
}

function checkWinner() {
    const board = document.getElementById("board");
    let tiles = board.getElementsByClassName("board_tile");
    let isWinner = true;
    // console.log(tiles);
    for (let i = 0; i < tiles.length - 1; i++) {
        let src = tiles[i].src;
        let number = parseInt(src.substring(src.length - 5, src.length - 4))
        let nextNumber = parseInt(tiles[i + 1].src.substring(src.length - 5, src.length - 4));
        // console.log(number);
        if (number > nextNumber) {
            isWinner = false;
            break;
        }
    }
    // console.log("\n");
    return isWinner;
}

function dragStart() {
    currTile = this; // image to be dragged
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {

}

function dragDrop() {
    otherTile = this; // image to be dropped on
}

function isMobileDevice() {
    return window.innerWidth <= 768;
}

function initCharactersMap() {

    // ["juan_santamaria", "carmen_lyra", "shirley_cruz", "batman", "wonder_woman", "superman"];

    characters_map.set("juan_santamaria", new CharacterSP("Juan Santamaria",
            ["Juan Santamaria Day is a" +
            " holiday in Costa Rica, and it is celebrated on April 11th. \n" +
            "The holiday commemorates the Battle of Rivas, made famous by the heroic actions of the National Hero, Juan Santamaria:" +
            " the \"Little Drummer Boy\".\n", "He is brave.", "Juan Santamaría was successful in his mission and his actions helped" +
            " Costa Ricans win the battle, Santamaria was killed by enemy fire.\n"]
            , AUDIOS_HEROES_PATH + "Juan Santamaria.wav"
        )
    )

    characters_map.set("carmen_lyra", new CharacterSP("Carmen Lyra", [
            "María Isabel Carvajal (Carmen Lyra) was a writer.",
            "She wrote and published the fairy tale collection \"Cuentos de mi tía Panchita\" and was the first female Costa Rican writer. \n"
            , "She was an intellectual, smart, brave and visionary woman.\n",
            "Carmen Lyra’s face is on the 20000 colones bill.\n"]
        , AUDIOS_HEROES_PATH + "Carmen Lyra.wav")
    )

    characters_map.set("shirley_cruz", new CharacterSP("Shirley Cruz", [
            "Shirley Cruz Traña was born on August 28, 1985, in San José, Costa Rica. She is a Costa Rican soccer player.",
            "She currently plays in the Chinese club Jiangsu Suning of the Chinese Women’s Super League.",
            "She was the first female professional soccer player in Costa Rica and is the most successful Central American player as a professional soccer player.",
            "She is an extraordinary athlete, strong, disciplined, confident and hard working. She is a leader."]
        , AUDIOS_HEROES_PATH + "Shirley Cruz.wav")
    )

    characters_map.set("superman", new CharacterSP("Superman", [
            "Superman is a superhero.",
            "He comes from a place called Krypton. His real name is Clark Kent.",
            "He can fly, be super strong, and really fast.",
            "Superman is a good guy who helps people",]
        , AUDIOS_HEROES_PATH + "Superman.wav")
    )

    characters_map.set("batman", new CharacterSP("Batman", [
            "Bruce Wayne was born in a big city called Gotham City.",
            "He is born in a wealthy family.",
            "When he is a child, criminals killed his parents. He promises to take revenge.",
            "He takes a secret identity inspired in the capacities of bats and becomes Batman.",
            "He develops special weapons to fight all criminals at Gotham city as well as mental and physical abilities.",
            "He is very smart and can solve all types of riddles.",
            "He can fly like bats; he has a lot of physical strength and ability to fight the villains."
        ], AUDIOS_HEROES_PATH + "Batman.wav"
        )
    )

    characters_map.set("wonder_woman", new CharacterSP("Wonder Woman", [
                "Wonder Woman’s real name is Princess Diana.",
                "She is a descendent of the mythical Amazon Women of Greece. Princess Diana is the daughter of Zeus.",
                "Wonder Woman is immortal, this means she cannot die.",
                "She wears bulletproof bracelets.",
                "She also has great strength and speed.",
                "Wonder Woman’s most special fighting tool is her Lasso of Truth. If she wraps this rope around a person and asks them questions, they tell the truth."
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )

    characters_map.set("aquaman", new CharacterSP("Aquaman", [
                "Aquaman is the king of the ocean.",
                "He can swim fast and talk to fish.",
                "He is very strong in the water. Aquaman takes care of the sea and its animals.",
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )

    characters_map.set("flash", new CharacterSP("The Flash", [
                "The Flash is the fastest superhero.",
                "He runs very, very fast. He is faster than a car or a plane.",
                "The Flash helps people very quickly. He is also very kind.",
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )

    characters_map.set("thor", new CharacterSP("Thor", [
                "Thor is the god of thunder.",
                "He has a magic hammer. Only Thor can lift it.",
                "He is very strong.",
                "Thor can make lightning with his hammer. He protects people from bad guys."
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )

    characters_map.set("ironman", new CharacterSP("Iron Man", [
                "Iron Man is very smart. He wears a metal suit.",
                "The suit can fly and shoot lasers. ",
                "Iron Man builds cool machines.",
                "He uses them to save the world."
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )

    characters_map.set("spiderman", new CharacterSP("Spider-Man", [
                "Spider-Man is a superhero",
                "He can climb walls like a spider.",
                "He swings with his webs. He is fast and strong.",
                "He helps people when they are in danger."
            ]
            , AUDIOS_HEROES_PATH + "Wonder Woman.wav"
        ),
    )




    console.log(characters_map)

}
