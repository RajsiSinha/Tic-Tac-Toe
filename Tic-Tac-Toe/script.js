const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const modeSelector = document.getElementById('mode');

let currentPlayer = 'X';
let board = Array(9).fill(null);
let gameMode = 'AI';

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');

  if (board[index] || checkWinner()) return;

  makeMove(index, currentPlayer);

  if (gameMode === 'AI' && !checkWinner() && board.some(cell => !cell)) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const index = getBestMove();
  makeMove(index, 'O');
}

function makeMove(index, player) {
  board[index] = player;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.classList.add('taken');

  if (checkWinner()) {
    statusText.textContent = `Player ${player} wins!`;
    return;
  } else if (board.every(cell => cell)) {
    statusText.textContent = "It's a draw!";
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function getBestMove() {
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O';
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'X';
      if (checkWinner()) {
        board[i] = null;
        return i;
      }
      board[i] = null;
    }
  }

  const availableCells = board.map((val, index) => (val ? null : index)).filter(val => val !== null);
  return availableCells[Math.floor(Math.random() * availableCells.length)];
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function restartGame() {
  board.fill(null);
  currentPlayer = 'X';
  statusText.textContent = "Player X's turn";
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('taken');
  });
}

function changeMode() {
  gameMode = modeSelector.value;
  restartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
modeSelector.addEventListener('change', changeMode);
