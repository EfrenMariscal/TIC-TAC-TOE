const cells = document.querySelectorAll('[data-cell]');
const winningMessageText = document.getElementById('winning-message');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const xScoreDisplay = document.getElementById('x-score');
const oScoreDisplay = document.getElementById('o-score');
let xScore = 0;
let oScore = 0;
let turn = 'X';
let gameMode = '2p';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function startGame(mode) {
    gameMode = mode;
    startScreen.style.display = 'none';
    gameContainer.style.display = 'flex';
    resetGame();
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('marked');
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessageText.textContent = '';
    turn = 'X';
}

function handleClick(event) {
    const cell = event.target;
    cell.textContent = turn;
    cell.classList.add('marked');

    if (checkWin()) {
        updateScore(turn);
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        if (gameMode === 'cpu' && turn === 'O') {
            setTimeout(computerMove, 500);  // Espera medio segundo para el movimiento de la CPU
        }
    }

    setTimeout(() => cell.classList.remove('marked'), 300);
}

function computerMove() {
    let availableCells = [...cells].filter(cell => cell.textContent === '');
    let randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    randomCell.textContent = 'O';
    randomCell.classList.add('marked');
    randomCell.removeEventListener('click', handleClick);

    if (checkWin()) {
        updateScore('O');
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        turn = 'X';
    }

    setTimeout(() => randomCell.classList.remove('marked'), 300);
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return cells[index].textContent === turn;
        });
    });
}

function isDraw() {
    return [...cells].every(cell => cell.textContent !== '');
}

function endGame(draw) {
    if (draw) {
        winningMessageText.textContent = "¡Es un empate!";
    } else {
        winningMessageText.textContent = `¡${turn} ha ganado!`;
    }

    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function updateScore(player) {
    if (player === 'X') {
        xScore++;
        xScoreDisplay.textContent = `X: ${xScore}`;
    } else if (player === 'O') {
        oScore++;
        oScoreDisplay.textContent = `O: ${oScore}`;
    }
}
