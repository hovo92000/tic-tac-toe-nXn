"use strict";
let topButtons;
let board;
let buttonX;
let startGame;
let buttonO;
let boardSize;
let restartGameButton;
let divForGameStatus;
let areaForGameStatus;
let allBoxes;
let divForGoBackButtons;
let menuButton;
let gameStatus;
let gameActive = true;
let win = false;
createInputAreaForCreatingBoard();

function createInputAreaForCreatingBoard() {
  document.addEventListener("keypress", function (element) {
    if (element.key === "Enter") {
      clickAndStart();
    }
  });
  const startWithClickButton = document.querySelector("#inputButton");
  startWithClickButton.onclick = () => {
    clickAndStart();
  };
}
function clickAndStart() {
  createSectionForButtons();
  createXbutton();
  createPlaybutton();
  createObutton();
  createBoard();
  createDivForGameStatus();
  createAreaForGameStatus();
  createDivForGoBackButtons();
  createMenuButton();
  createRestartGame();

  document.body.appendChild(divForGameStatus);

  gameStatus = document.getElementById("gameStatus");
  menuButton.style.display = "none";
  menuButton.onclick = function () {
    menuButton.style.display = "none";
    mySymbol = "";
    board.remove();
    divForGameStatus.remove();
    restartGameButton.style.display = "none";
    document.getElementById("container").style.display = "flex";
    divForGameStatus.style.display = "none";
  };
  restartGameButton.onclick = function () {
    onClickButtonRestartGame();
  };
  buttonX.onclick = function () {
    startGameWithXbutton();
  };
  buttonO.onclick = function () {
    startGameWithObutton();
  };
  startGame.onclick = function () {
    if (mySymbol !== "") {
      startGameWithPlayButton(createMatrixBoard());
    }
  };
  boardSize = document.getElementById("inputForBoardSize").value;
  document.getElementById("container").style.display = "none";
  topButtons.style.display = "flex";
}
function createSectionForButtons() {
  topButtons = document.createElement("section");
  topButtons.id = `topButtons`;
  let containerDivForInputBoardSize = document.getElementById("container");
  containerDivForInputBoardSize.appendChild(topButtons);
}
function createXbutton() {
  buttonX = document.createElement("div");
  buttonX.id = `buttonX`;
  buttonX.innerHTML = "X";
  topButtons.appendChild(buttonX);
}
function createPlaybutton() {
  startGame = document.createElement("div");
  startGame.id = `startGame`;
  startGame.innerHTML = "PLAY";
  topButtons.appendChild(startGame);
}
function createObutton() {
  buttonO = document.createElement("div");
  buttonO.id = `buttonO`;
  buttonO.innerHTML = "O";
  topButtons.appendChild(buttonO);
}
function createBoard() {
  document.body.appendChild(topButtons);
  board = document.createElement("section");
  board.id = `board`;
  board.classList = "main";
  document.body.appendChild(board);
  board.style.display = "none";
  createMatrixBoard();
}
function createDivForGameStatus() {
  divForGameStatus = document.createElement("div");
  divForGameStatus.id = `divForGameStatus`;
  divForGameStatus.style.display = "none";
}
function createAreaForGameStatus() {
  areaForGameStatus = document.createElement("h2");
  areaForGameStatus.id = `gameStatus`;
  divForGameStatus.appendChild(areaForGameStatus);
}
function createDivForGoBackButtons() {
  divForGoBackButtons = document.createElement("div");
  divForGoBackButtons.id = `divForGoBackButtons`;
  divForGameStatus.appendChild(divForGoBackButtons);
}
function createMenuButton() {
  menuButton = document.createElement("button");
  menuButton.id = `menuButton`;
  menuButton.innerHTML = "MENU";
  divForGoBackButtons.appendChild(menuButton);
}
function createRestartGame() {
  restartGameButton = document.createElement("button");
  restartGameButton.id = `restartGame`;
  restartGameButton.innerHTML = "RESTART";
  divForGoBackButtons.appendChild(restartGameButton);
}

function createMatrixBoard() {
  let box = "";
  let boardWidth = 0;
  let matrix = new Array();
  let indexForBoxId = 0;
  for (let row = 0; row < boardSize; row++) {
    matrix[row] = new Array();
    for (let col = 0; col < boardSize; col++) {
      box += ` <div class=boxes id=box${indexForBoxId++}> ` + " </div>  ";
      matrix[row][col] = indexForBoxId - 1;
    }
    boardWidth += 160;
    board.style.width = boardWidth + "px";
  }
  document.getElementById("board").innerHTML = box;
  allBoxes = document.querySelectorAll("#board div");
  if (boardSize > 3) {
    boardWidth = 500;
    board.style.width = boardWidth + "px";
    for (let i = 0; i < allBoxes.length; i++) {
      allBoxes[i].style.width = boardWidth / +boardSize + "px";
      allBoxes[i].style.height = boardWidth / +boardSize + "px";
      if (boardSize > 10) {
        allBoxes[i].style.fontSize = "1.4vw";
        if (boardSize > 20) {
          allBoxes[i].style.fontSize = "1vw";
          if (boardSize > 40) {
            allBoxes[i].style.fontSize = "0.5vw";
          }
        }
      }
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
let color = "rgb(49, 255, 49)";
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
          allBoxes[j].style.backgroundColor = "#5bccf6";
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
      allBoxes[indices[toAdd]].innerHTML;
      if (mySymbol === "X") {
        color = "rgb(255, 60, 60)";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
        color = "rgb(49, 255, 49)";
      }
    } else if (gameActive === false && win === false) {
      allBoxes[indices[toAdd]].innerHTML = "X";
      if (mySymbol === "O") {
        color = "rgb(255, 60, 60)";
        getAllTheMovesAndCheckThem(matrix, allBoxes);
        color = "rgb(49, 255, 49)";
      }
    }
  }
}

let mySymbol = "";
function startGameWithXbutton() {
  mySymbol = "X";
  gameActive = true;
  buttonX.style.backgroundColor = "#ffbf4b";
  buttonX.style.border = "#1px solid black";

  if (mySymbol === "X") {
    buttonO.style.backgroundColor = "#373234";
  }
}
function startGameWithObutton() {
  mySymbol = "O";
  gameActive = false;
  buttonO.style.backgroundColor = "#ffbf4b";
  buttonO.style.border="#1px solid black"
  if (mySymbol === "O") {
    buttonX.style.backgroundColor = "#373234";
  }
}

function startGameWithPlayButton(allBoxesAndMatrix) {
  if (mySymbol === "X" || mySymbol === "O") {
    buttonX.style.pointerEvents = "none";
    buttonO.style.pointerEvents = "none";
    buttonX.style.backgroundColor = "#373234";
    buttonO.style.backgroundColor = "#373234";
    board.style.pointerEvents = "painted";
    startGame.style.pointerEvents = "none";
  }
  divForGameStatus.style.display = "flex";
  topButtons.style.display = "none";
  restartGameButton.style.display = "block";
  board.style.display = "flex";
  gameStatus.innerHTML = "";
  menuButton.style.display = "block";
  win = false;
  createMatrixBoard();
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
  board.style.pointerEvents = "none";
  restartGameButton.style.display = "none";
  topButtons.style.display = "flex";
  board.style.display = "none";
  menuButton.style.display = "none";
}
function gameStop() {
  board.style.pointerEvents = "none";
}
