// Constants
const board = ['', '', '', '', '', '', '', '', ''];
const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';

// Elements
const cells = document.querySelectorAll('.cell');
const restartButton = document.querySelector('.restart');

// Add event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', resetGame);

// Handle cell click
function handleCellClick(event) {
  const index = Array.from(cells).indexOf(event.target);
  if (board[index] !== '') {
    return;
  }
  board[index] = HUMAN_PLAYER;
  event.target.textContent = HUMAN_PLAYER;
  if (checkWin(board, HUMAN_PLAYER)) {
    endGame('You win!');
    return;
  }
  if (checkTie(board)) {
    endGame('Tie game!');
    return;
  }
  const bestMoveIndex = getBestMoveIndex(board, AI_PLAYER);
  board[bestMoveIndex] = AI_PLAYER;
  cells[bestMoveIndex].textContent = AI_PLAYER;
  if (checkWin(board, AI_PLAYER)) {
    endGame('You lose!');
    return;
  }
  if (checkTie(board)) {
    endGame('Tie game!');
  }
}

// Get best move index using minimax algorithm
function getBestMoveIndex(board, player) {
  const availableMoves = getAvailableMoves(board);
  let bestMoveIndex = null;
  let bestScore = player === AI_PLAYER ? -Infinity : Infinity;
  availableMoves.forEach(moveIndex => {
    board[moveIndex] = player;
    const score = minimax(board, player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER);
    board[moveIndex] = '';
    if (player === AI_PLAYER && score > bestScore) {
      bestScore = score;
      bestMoveIndex = moveIndex;
    } else if (player === HUMAN_PLAYER && score < bestScore) {
      bestScore = score;
      bestMoveIndex = moveIndex;
    }
  });
  return bestMoveIndex;
}

// Get available moves
function getAvailableMoves(board) {
  return board.reduce((moves, value, index) => {
    if (value === '') {
      moves.push(index);
    }
    return moves;
  }, []);
}

// Minimax algorithm
function minimax(board, player) {
  const gameResult = getGameResult(board);
  if (gameResult !== null) {
    return gameResult;
  }
  const availableMoves = getAvailableMoves(board);
  const scores = availableMoves.map(moveIndex => {
    board[moveIndex] = player;
    const score = minimax(board, player === AI_PLAYER ? HUMAN_PLAYER : AI_PLAYER);
    board[moveIndex] = '';
    return score;
  });
  if (player === AI_PLAYER) {
    return Math.max(...scores);
  } else {
    return Math.min(...scores);
  }
}

// Check if game is over
function getGameResult(board) {
  if (checkWin(board, HUMAN_PLAYER)) {
    return -1;
  }
  if (checkWin(board, AI_PLAYER)) {
    return 1;
  }
  if (checkTie(board)) {
    return 0;
  }
  return null;
}

// Check if player has won
function checkWin(board, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

// Check if game is a tie
function checkTie(board) {
  return board.every(value => value !== '');
}

// End game
function endGame(message) {
  alert(message);
  resetGame();
}

// Reset game
function resetGame() {
  board.fill('');
  cells.forEach(cell => cell.textContent = '');
}