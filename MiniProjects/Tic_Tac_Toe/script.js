const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset-btn');
const resetButtonBottom = document.getElementById('reset-btn-bottom');
const boardSizeSelect = document.getElementById('board-size');
const symbolSelect = document.getElementById('symbol-set');
const gameBoard = document.getElementById('game-board');

const winLine = document.createElement('div');
winLine.id = 'win-line';
winLine.className = 'win-line';
winLine.setAttribute('aria-hidden', 'true');
gameBoard.appendChild(winLine);

const symbolThemes = {
    classic: ['X', 'O'],
    emoji1: ['😄', '😎'],
    emoji2: ['🌞', '🌚'],
};

let boardSize = 3;
let symbols = symbolThemes.classic;
let currentPlayerIndex = 0;
let board = [];
let gameActive = true;
let winningPatterns = [];
let cells = [];

function updateStatus(message) {
    statusText.textContent = message;
}

function generateWinningPatterns(size) {
    const patterns = [];

    for (let row = 0; row < size; row += 1) {
        const pattern = [];
        for (let col = 0; col < size; col += 1) {
            pattern.push(row * size + col);
        }
        patterns.push(pattern);
    }

    for (let col = 0; col < size; col += 1) {
        const pattern = [];
        for (let row = 0; row < size; row += 1) {
            pattern.push(row * size + col);
        }
        patterns.push(pattern);
    }

    const diagonalOne = [];
    const diagonalTwo = [];
    for (let index = 0; index < size; index += 1) {
        diagonalOne.push(index * size + index);
        diagonalTwo.push(index * size + (size - 1 - index));
    }

    patterns.push(diagonalOne, diagonalTwo);
    return patterns;
}

function buildBoard() {
    gameBoard.innerHTML = '';
    gameBoard.appendChild(winLine);
    cells = [];

    for (let index = 0; index < boardSize * boardSize; index += 1) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = index;
        cell.addEventListener('click', handleCellClick);
        gameBoard.appendChild(cell);
        cells.push(cell);
    }
}

function getWinLineStyle(pattern) {
    const first = pattern[0];
    const row = Math.floor(first / boardSize);
    const col = first % boardSize;

    const rowMatch = pattern.every(index => Math.floor(index / boardSize) === row);
    if (rowMatch) {
        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = cells[first].getBoundingClientRect();
        const centerY = cellRect.top + cellRect.height / 2 - boardRect.top;
        return { '--left': '50%', '--top': `${centerY}px`, '--rot': '0deg' };
    }

    const colMatch = pattern.every(index => index % boardSize === col);
    if (colMatch) {
        const boardRect = gameBoard.getBoundingClientRect();
        const cellRect = cells[first].getBoundingClientRect();
        const centerX = cellRect.left + cellRect.width / 2 - boardRect.left;
        return { '--left': `${centerX}px`, '--top': '50%', '--rot': '90deg' };
    }

    const diagOne = pattern.every((index, idx) => index === idx * boardSize + idx);
    if (diagOne) {
        return { '--left': '50%', '--top': '50%', '--rot': '45deg' };
    }

    return { '--left': '50%', '--top': '50%', '--rot': '-45deg' };
}

function highlightWinningPattern(pattern) {
    pattern.forEach(index => {
        const cell = cells[index];
        cell.classList.add('winning');
    });

    const styleVars = getWinLineStyle(pattern);
    winLine.className = 'win-line active';
    Object.entries(styleVars).forEach(([name, value]) => {
        winLine.style.setProperty(name, value);
    });
}

function checkWinner() {
    for (const pattern of winningPatterns) {
        const first = board[pattern[0]];
        if (first === '') {
            continue;
        }

        if (pattern.every(index => board[index] === first)) {
            return { player: symbols[first], pattern };
        }
    }
    return null;
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (!gameActive || board[index] !== '') {
        return;
    }

    board[index] = currentPlayerIndex;
    cell.textContent = symbols[currentPlayerIndex];
    cell.classList.add('active');

    const winner = checkWinner();

    if (winner) {
        gameActive = false;
        highlightWinningPattern(winner.pattern);
        updateStatus(`Player ${winner.player} wins!`);
        return;
    }

    if (board.every(value => value !== '')) {
        gameActive = false;
        updateStatus("It's a draw!");
        return;
    }

    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    updateStatus(`Player ${symbols[currentPlayerIndex]}'s turn`);
}

function resetGame() {
    board.fill('');
    currentPlayerIndex = 0;
    gameActive = true;
    winLine.className = 'win-line';
    winLine.style.removeProperty('--left');
    winLine.style.removeProperty('--top');
    winLine.style.removeProperty('--rot');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('active', 'winning');
    });
    updateStatus(`Player ${symbols[currentPlayerIndex]}'s turn`);
}

function initializeGame() {
    boardSize = Number(boardSizeSelect.value);
    symbols = symbolThemes[symbolSelect.value] || symbolThemes.classic;
    board = Array(boardSize * boardSize).fill('');
    winningPatterns = generateWinningPatterns(boardSize);
    currentPlayerIndex = 0;
    gameActive = true;
    gameBoard.style.setProperty('--board-size', boardSize);
    winLine.className = 'win-line';
    winLine.style.removeProperty('--left');
    winLine.style.removeProperty('--top');
    winLine.style.removeProperty('--rot');
    buildBoard();
    updateStatus(`Player ${symbols[currentPlayerIndex]}'s turn`);
}

boardSizeSelect.addEventListener('change', initializeGame);
symbolSelect.addEventListener('change', initializeGame);
resetButton.addEventListener('click', resetGame);
resetButtonBottom.addEventListener('click', resetGame);

initializeGame();
