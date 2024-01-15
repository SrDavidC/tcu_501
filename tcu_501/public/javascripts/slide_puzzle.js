import { shuffle, playWinSound } from "./Utils.js";
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
let imgCharacters =
  ["juan_santamaria", "carmen_lyra", "shirley_cruz", "batman", "wonder_woman", "superman"];




window.onload = function () {
  shuffle(imgOrder);
  let randomIndex = Math.floor(Math.random() * imgCharacters.length);
  let character = imgCharacters[randomIndex];
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
    console.log("Ganaste!!");
    playWinSound();

  }
}

function dragEnd() {
  swapTiles();

  handleWin();
}

function swapTiles() {
  let currCoords = currTile.id.split("-");
  let r = parseInt(currCoords[0]);
  let c = parseInt(currCoords[1]);

  let otherCoords = otherTile.id.split("-");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);


  let moveLeft = r == r2 && c2 == c-1;
  let moveRight = r == r2 && c2 == c+1;

  let moveUp = c == c2 && r2 == r-1;
  let moveDown = c == c2 && r2 == r+1;

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
  const board =  document.getElementById("board");
  let tiles = board.getElementsByClassName("board_tile");
  let isWinner = true;
  // console.log(tiles);
  for (let i = 0; i < tiles.length - 1; i++) {
    let src = tiles[i].src;
    let number = parseInt(src.substring(src.length - 5,src.length - 4))
    let nextNumber = parseInt (tiles[i+1].src.substring(src.length - 5,src.length - 4));
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
