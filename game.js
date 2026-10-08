const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart");
const resetScoreButton = document.getElementById("reset-score");
const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let scores = { X: 0, O: 0 };

const wins = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function winner() {
  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.every(Boolean) ? "draw" : null;
}

function render(winningCells = []) {
  boardElement.innerHTML = "";
  board.forEach((value, index) => {
    const cell = document.createElement("button");
    cell.className = "cell" + (value ? " " + value.toLowerCase() : "") + (winningCells.includes(index) ? " win" : "");
    cell.textContent = value;
    cell.disabled = gameOver || Boolean(value);
    cell.setAttribute("aria-label", "Cell " + (index + 1) + (value ? ": " + value : ""));
    cell.addEventListener("click", () => move(index));
    boardElement.appendChild(cell);
  });
  scoreXElement.textContent = scores.X;
  scoreOElement.textContent = scores.O;
}

function move(index) {
  if (gameOver || board[index]) return;
  board[index] = currentPlayer;
  const result = winner();
  if (result) {
    gameOver = true;
    if (result === "draw") {
      statusElement.textContent = "Draw game — play again!";
      render();
    } else {
      scores[result] += 1;
      statusElement.textContent = "Player " + result + " wins!";
      const winningCells = wins.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || [];
      render(winningCells);
    }
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.textContent = "Player " + currentPlayer + "'s turn";
    render();
  }
}

function restart() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  statusElement.textContent = "Player X's turn";
  render();
}

function resetScore() {
  scores = { X: 0, O: 0 };
  restart();
}

restartButton.addEventListener("click", restart);
resetScoreButton.addEventListener("click", resetScore);
render();
