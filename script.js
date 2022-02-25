"use strict";
let topButtons;
let board;
let buttonX;
let startGame;
let buttonO;
let boardSize;
let restartGame;
let divForGameStatus;
let areaForGameStatus;
let allBoxes;
let gameRestart;
let gameStatus;
let gameActive = true;
let win = false;
createInputAreaForCreatingBoard();

function createInputAreaForCreatingBoard() {
  document
    .getElementById("inputForBoardSize")
    .addEventListener("keypress", function (element) {
      if (element.key === "Enter") {
        boardSize = document.getElementById("inputForBoardSize").value;
        createHtml();
        document.getElementById("inputForBoardSize").style.display = "none";
        document.getElementById("container").style.display="none"
        document.body.style.height="auto"
      }
    });
}
function createHtml() {
  topButtons = document.createElement("section");
  topButtons.id = `topButtons`;

  buttonX = document.createElement("div");
  buttonX.id = `buttonX`;
  buttonX.innerHTML = "X";
  topButtons.appendChild(buttonX);

  startGame = document.createElement("div");
  startGame.id = `startGame`;
  startGame.innerHTML = "PLAY";
  topButtons.appendChild(startGame);

  buttonO = document.createElement("div");
  buttonO.id = `buttonO`;
  buttonO.innerHTML = "O";
  topButtons.appendChild(buttonO);

  document.body.appendChild(topButtons);
  board = document.createElement("section");
  board.id = `board`;
  board.classList = "main";

  divForGameStatus = document.createElement("div");
  divForGameStatus.id = `divForGameStatus`;

  areaForGameStatus = document.createElement("h2");
  areaForGameStatus.id = `gameStatus`;
  divForGameStatus.appendChild(areaForGameStatus);

  restartGame = document.createElement("button");
  restartGame.id = `restartGame`;
  restartGame.innerHTML = "RESTART GAME";
  divForGameStatus.appendChild(restartGame);

  document.body.appendChild(board);
  document.body.appendChild(divForGameStatus);

  gameRestart = document.querySelector("button");
  gameStatus = document.getElementById("gameStatus");
  createMatrixBoard();
  buttonX.onclick = function () {
    startGameWithXbutton();
  };
  buttonO.onclick = function () {
    startGameWithObutton();
  };
  startGame.onclick = function () {
    startGameWithPlayButton(createMatrixBoard());
  };
  gameRestart.onclick = function () {
    onClickButtonRestartGame();
  };
}

function createMatrixBoard() {
  let str = "";
  let boardWidth = 0;
  let matrix = new Array();
  let indexForBoxId = 0;
  for (let row = 0; row < boardSize; row++) {
    matrix[row] = new Array();
    for (let col = 0; col < boardSize; col++) {
      str += ` <div class=boxes id=box${indexForBoxId++}> ` + " </div>  ";
      matrix[row][col] = indexForBoxId - 1;
    }
    boardWidth += 160;
    board.style.width = boardWidth + "px";
  }
  document.getElementById("board").innerHTML = str;
  allBoxes = document.querySelectorAll("#board div");
  board.style.pointerEvents = "none";
  if (boardSize > 5) {
    boardWidth = 1000;
    board.style.width = boardWidth + "px";
    for (let i = 0; i < allBoxes.length; i++) {
      allBoxes[i].style.width = boardWidth / +boardSize + "px";
      allBoxes[i].style.height = boardWidth / +boardSize + "px";
    }
  }
  renderSymbols(matrix, allBoxes);
  getAllTheMovesAndCheckThem(matrix, allBoxes, board);
  const objectReturningMatrixAndAllBoxses = {
    matrix: matrix,
    allBoxes: allBoxes,
  };
  return objectReturningMatrixAndAllBoxses;
}
const getAllTheMovesAndCheckThem = (matrix, allBoxes) => {
  let diagonalMoves = [];
  let equalBasedDiagonal = [];
  let rightToLeftBasedDiagonal = [];
  let leftToRightMoves = [];
  let topToBottomMoves = [];
  for (let row = 0; row < matrix.length; row++) {
    topToBottomMoves.push([]);
    for (let col = 0; col < matrix.length; col++) {
      topToBottomMoves[row].push(matrix[col][row]);
      if (row === col) {
        equalBasedDiagonal.push(matrix[row][col]);
      }
      if (row + col === boardSize - 1) {
        rightToLeftBasedDiagonal.push(matrix[row][col]);
      }
    }
    leftToRightMoves.push(matrix[row]);
  }
  diagonalMoves.push(equalBasedDiagonal, rightToLeftBasedDiagonal);
  winningMessage(diagonalMoves, allBoxes, leftToRightMoves, topToBottomMoves);
  drawGame(allBoxes);
};
let color = "green";
function winningMessage(
  diagonalMoves,
  allBoxes,
  leftToRightMoves,
  topToBottomMoves
) {
  let winner = 0;
  for (let row = 0; row < diagonalMoves.length; row++) {
    for (let col = 1; col < boardSize; col++) {
      if (
        allBoxes[diagonalMoves[row][col]].innerHTML ===
          allBoxes[diagonalMoves[row][col - 1]].innerHTML &&
        allBoxes[diagonalMoves[row][col]].innerText !== ""
      ) {
        winner++;
        if (winner === +boardSize - 1) {
          for (let i = 0; i < boardSize; i++) {
            allBoxes[diagonalMoves[row][i]].style.backgroundColor = color;
            gameStatus.innerHTML = `Player ${
              allBoxes[diagonalMoves[row][i]].innerHTML
            } has Won!`;
            win = true;
            gameStop();
          }
        }
      }
    }
    winner = 0;
  }
  isCheckingHorizontalBoxes(leftToRightMoves);
  isCheckingVerticalBoxes(topToBottomMoves);
}
function isCheckingHorizontalBoxes(leftToRightMoves) {
  let winnerForHorizontal = 0;
  for (let row = 0; row < leftToRightMoves.length; row++) {
    for (let col = 1; col < leftToRightMoves.length; col++) {
      if (
        allBoxes[leftToRightMoves[row][col] - 1].innerHTML ===
          allBoxes[leftToRightMoves[row][col]].innerHTML &&
        allBoxes[leftToRightMoves[row][col]].innerText !== ""
      ) {
        winnerForHorizontal++;
        if (winnerForHorizontal === +boardSize - 1) {
          for (let i = 0; i < boardSize; i++) {
            allBoxes[leftToRightMoves[row][i]].style.backgroundColor = color;
            gameStatus.innerHTML = `Player ${
              allBoxes[leftToRightMoves[row][i]].innerHTML
            } has Won!`;
            win = true;
            gameStop();
          }
        }
      }
    }
    winnerForHorizontal = 0;
  }
}
function isCheckingVerticalBoxes(topToBottomMoves) {
  let winnerForVertical = 0;
  for (let row = 0; row < topToBottomMoves.length; row++) {
    for (let col = 1; col < topToBottomMoves.length; col++) {
      if (
        allBoxes[topToBottomMoves[row][col]].innerHTML ===
          allBoxes[topToBottomMoves[row][col - 1]].innerHTML &&
        allBoxes[topToBottomMoves[row][col]].innerText !== ""
      ) {
        winnerForVertical++;
        if (winnerForVertical === +boardSize - 1) {
          for (let i = 0; i < boardSize; i++) {
            allBoxes[topToBottomMoves[row][i]].style.backgroundColor = color;
            gameStatus.innerHTML = `Player ${
              allBoxes[topToBottomMoves[row][i]].innerHTML
            } has Won!`;
            win = true;
            gameStop();
          }
        }
      }
    }
    winnerForVertical = 0;
  }
}
function drawGame(allBoxes) {
  let count = 0;
  for (let i = 0; i < allBoxes.length; i++) {
    if (allBoxes[i].innerHTML !== "  " && win === false) {
      count++;
      if (count === allBoxes.length) {
        for (let j = 0; j < allBoxes.length; j++) {
          allBoxes[j].style.backgroundColor = "blue";
        }
        gameStatus.innerHTML = "DRAW!";
        gameStop();
      }
    }
  }
}
function renderSymbols(matrix, allBoxes) {
  for (let i = 0; i < allBoxes.length; i++) {
    allBoxes[i].addEventListener("click", (e) => {
      if (e.target.innerHTML === "X" || e.target.innerHTML === "O") {
        return;
      }
      if (gameActive) {
        e.target.innerHTML = "X";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
      } else {
        e.target.innerHTML = "O";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
      }
      setTimeout(renderSymbolsRandom, 400, matrix, allBoxes);
    });
  }
}
function renderSymbolsRandom(matrix, allBoxes) {
  let indices = new Array();
  let index = 0;
  for (let i = 0; i < allBoxes.length; i++) {
    if (allBoxes[i].innerText === "") {
      indices[index++] = i;
    }
  }
  let toAdd = Math.floor(Math.random() * indices.length);
  if (allBoxes[indices[toAdd]] !== undefined) {
    if (gameActive === true && win === false) {
      allBoxes[indices[toAdd]].innerHTML = "O";
      if (mySymbol === "X") {
        color = "red";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
        color = "green";
      }
    } else if (gameActive === false && win === false) {
      allBoxes[indices[toAdd]].innerHTML = "X";
      if (mySymbol === "O") {
        color = "red";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
        color = "green";
      }
    }
  }
}

let mySymbol = "";
function startGameWithXbutton() {
  mySymbol = "X";
  gameActive = true;
  buttonX.style.backgroundColor = "rgb(110, 184, 0)";
  if (mySymbol === "X") {
    buttonO.style.backgroundColor = "rgb(173, 255, 47)";
  }
}
function startGameWithObutton() {
  mySymbol = "O";
  gameActive = false;
  buttonO.style.backgroundColor = "rgb(110, 184, 0)";
  if (mySymbol === "O") {
    buttonX.style.backgroundColor = "rgb(173, 255, 47)";
  }
}

function startGameWithPlayButton(allBoxesAndMatrix) {
  if (mySymbol === "X" || mySymbol === "O") {
    buttonX.style.pointerEvents = "none";
    buttonO.style.pointerEvents = "none";
    buttonX.style.backgroundColor = "rgb(173, 255, 47)";
    buttonO.style.backgroundColor = "rgb(173, 255, 47)";
    board.style.pointerEvents = "painted";
    startGame.style.pointerEvents = "none";
  }
  if (mySymbol === "O") {
    renderSymbolsRandom(allBoxesAndMatrix.matrix, allBoxes);
  }
}
function onClickButtonRestartGame() {
  startGame.style.pointerEvents = "painted";
  buttonX.style.pointerEvents = "painted";
  buttonO.style.pointerEvents = "painted";
  win = false;
  gameActive = true;
  gameStatus.innerHTML = "";
  mySymbol = "";
  createMatrixBoard();
}
function gameStop(allBoxes) {
  board.style.pointerEvents = "none";
}
