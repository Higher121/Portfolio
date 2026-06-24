const board = document.getElementById("board");
const playerLabelEl = document.getElementById("playerLabel");
const opponentLabelEl = document.getElementById("opponentLabel");
const playerScoreEl = document.getElementById("playerScore");
const opponentScoreEl = document.getElementById("opponentScore");
const turnEl = document.getElementById("turn");
const statusEl = document.getElementById("statusMessage");
const winsEl = document.getElementById("wins");
const boardSizeSelect = document.getElementById("boardSize");
const gameModeSelect = document.getElementById("gameMode");
const soundToggle = document.getElementById("soundToggle");
const settingsModal = document.getElementById("settingsModal");
const closeSettingsBtn = document.getElementById("closeSettings");
const confettiCanvas = document.getElementById("confetti");
const newGameBtn = document.getElementById("newGameBtn");
const resetBtn = document.getElementById("resetBtn");
const settingsBtn = document.getElementById("settingsBtn");
const saveSettingsBtn = document.getElementById("saveSettings");

let size = Number(boardSizeSelect.value) || 5;
let mode = gameModeSelect.value || "ai";
let currentPlayer = "player";
let gameOver = false;
let scores = { player: 0, opponent: 0 };
let lineState = { h: [], v: [] };
let boxes = [];
let confettiFrame = null;

winsEl.textContent = Number(localStorage.getItem("wins") || 0);

function beep(freq = 560, duration = 80) {
    if (!soundToggle.checked) return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.start();
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration / 1000);
    osc.stop(ctx.currentTime + duration / 1000);
}

function initializeGame() {
    size = Number(boardSizeSelect.value) || 5;
    mode = gameModeSelect.value;
    currentPlayer = "player";
    gameOver = false;
    scores = { player: 0, opponent: 0 };
    boxes = [];

    updateModeLabels();
    updateScoreDisplay();
    updateTurnText();
    setStatus("Ready. Start by selecting a line.");
    buildBoard();
}

function updateModeLabels() {
    playerLabelEl.textContent = mode === "hotseat" ? "Player 1" : "Player";
    opponentLabelEl.textContent = mode === "hotseat" ? "Player 2" : "AI";
}

function updateScoreDisplay() {
    playerScoreEl.textContent = scores.player;
    opponentScoreEl.textContent = scores.opponent;
}

function updateTurnText() {
    turnEl.textContent = currentPlayer === "player" ? playerLabelEl.textContent : opponentLabelEl.textContent;
}

function setStatus(message) {
    statusEl.textContent = message;
}

function buildBoard() {
    board.innerHTML = "";
    lineState = {
        h: Array.from({ length: size }, () => Array(size - 1).fill(false)),
        v: Array.from({ length: size - 1 }, () => Array(size).fill(false))
    };

    boxes = Array.from({ length: size - 1 }, () =>
        Array.from({ length: size - 1 }, () => ({ owner: null }))
    );

    const cells = size * 2 - 1;
    const cellSize = 26;
    board.style.gridTemplateColumns = `repeat(${cells}, ${cellSize}px)`;
    board.style.gridTemplateRows = `repeat(${cells}, ${cellSize}px)`;

    for (let row = 0; row < cells; row += 1) {
        for (let col = 0; col < cells; col += 1) {
            const cell = document.createElement("div");

            if (row % 2 === 0 && col % 2 === 0) {
                cell.className = "dot";
            } else if (row % 2 === 0) {
                cell.className = "line-h";
                cell.dataset.type = "h";
                cell.dataset.row = row / 2;
                cell.dataset.col = (col - 1) / 2;
                addLineListener(cell);
            } else if (col % 2 === 0) {
                cell.className = "line-v";
                cell.dataset.type = "v";
                cell.dataset.row = (row - 1) / 2;
                cell.dataset.col = col / 2;
                addLineListener(cell);
            } else {
                cell.className = "box";
                cell.dataset.row = (row - 1) / 2;
                cell.dataset.col = (col - 1) / 2;
            }

            board.appendChild(cell);
        }
    }
}

function addLineListener(line) {
    line.addEventListener("click", () => {
        if (gameOver) return;
        if (mode === "ai" && currentPlayer !== "player") return;
        if (line.classList.contains("active")) return;

        const type = line.dataset.type;
        const row = Number(line.dataset.row);
        const col = Number(line.dataset.col);
        makeMove(type, row, col);
    });
}

function makeMove(type, row, col) {
    if (isLineActive(type, row, col) || gameOver) return;

    const lineElement = board.querySelector(`div[data-type="${type}"][data-row="${row}"][data-col="${col}"]`);
    if (!lineElement) return;

    activateLine(lineElement, type, row, col, currentPlayer);
}

function isLineActive(type, row, col) {
    return type === "h" ? lineState.h[row][col] : lineState.v[row][col];
}

function activateLine(element, type, row, col, owner) {
    lineState[type][row][col] = true;
    element.classList.add("active", owner === "player" ? "player" : "ai");
    beep(owner === "player" ? 720 : 320);

    const completedBoxes = claimBoxes(type, row, col, owner);
    if (completedBoxes > 0) {
        scores[owner] += completedBoxes;
        updateScoreDisplay();
        const ownerLabel = owner === "player" ? playerLabelEl.textContent : opponentLabelEl.textContent;
        setStatus(`${ownerLabel} completed ${completedBoxes} box${completedBoxes > 1 ? "es" : ""}.`);
    } else {
        currentPlayer = currentPlayer === "player" ? "opponent" : "player";
        updateTurnText();
        setStatus(`It's ${currentPlayer === "player" ? playerLabelEl.textContent : opponentLabelEl.textContent}'s turn.`);
    }

    if (isGameComplete()) {
        finishGame();
    } else if (mode === "ai" && currentPlayer === "opponent") {
        setTimeout(aiMove, 420);
    }
}

function claimBoxes(type, row, col, owner) {
    let claimed = 0;
    const adjacentBoxes = getAdjacentBoxes(type, row, col);

    adjacentBoxes.forEach(([boxRow, boxCol]) => {
        if (boxes[boxRow][boxCol].owner) return;
        if (isBoxComplete(boxRow, boxCol)) {
            boxes[boxRow][boxCol].owner = owner;
            const boxEl = board.querySelector(`.box[data-row="${boxRow}"][data-col="${boxCol}"]`);
            if (boxEl) boxEl.classList.add(owner === "player" ? "player" : "ai");
            claimed += 1;
        }
    });

    return claimed;
}

function getAdjacentBoxes(type, row, col) {
    const adjacency = [];
    if (type === "h") {
        if (row > 0) adjacency.push([row - 1, col]);
        if (row < size - 1) adjacency.push([row, col]);
    } else {
        if (col > 0) adjacency.push([row, col - 1]);
        if (col < size - 1) adjacency.push([row, col]);
    }
    return adjacency.filter(([boxRow, boxCol]) => boxes[boxRow] && boxes[boxRow][boxCol]);
}

function isBoxComplete(boxRow, boxCol) {
    return (
        lineState.h[boxRow][boxCol] &&
        lineState.h[boxRow + 1][boxCol] &&
        lineState.v[boxRow][boxCol] &&
        lineState.v[boxRow][boxCol + 1]
    );
}

function countBoxEdges(boxRow, boxCol) {
    let count = 0;
    if (lineState.h[boxRow][boxCol]) count += 1;
    if (lineState.h[boxRow + 1][boxCol]) count += 1;
    if (lineState.v[boxRow][boxCol]) count += 1;
    if (lineState.v[boxRow][boxCol + 1]) count += 1;
    return count;
}

function getAvailableLines() {
    const available = [];

    lineState.h.forEach((row, rowIndex) => {
        row.forEach((active, colIndex) => {
            if (!active) available.push({ type: "h", row: rowIndex, col: colIndex });
        });
    });

    lineState.v.forEach((row, rowIndex) => {
        row.forEach((active, colIndex) => {
            if (!active) available.push({ type: "v", row: rowIndex, col: colIndex });
        });
    });

    return available;
}

function aiMove() {
    if (gameOver) return;

    const available = getAvailableLines();
    if (!available.length) {
        finishGame();
        return;
    }

    const winningMove = available.find((line) => completesBox(line.type, line.row, line.col));
    const safeMove = available.find((line) => !createsDanger(line.type, line.row, line.col));
    const choice = winningMove || safeMove || available[Math.floor(Math.random() * available.length)];

    makeMove(choice.type, choice.row, choice.col);
}

function completesBox(type, row, col) {
    return getAdjacentBoxes(type, row, col).some(([boxRow, boxCol]) => {
        if (boxes[boxRow][boxCol].owner) return false;
        return countBoxEdges(boxRow, boxCol) === 3;
    });
}

function createsDanger(type, row, col) {
    return getAdjacentBoxes(type, row, col).some(([boxRow, boxCol]) => {
        if (boxes[boxRow][boxCol].owner) return false;
        return countBoxEdges(boxRow, boxCol) === 2;
    });
}

function isGameComplete() {
    const claimed = scores.player + scores.opponent;
    return claimed === (size - 1) * (size - 1);
}

function finishGame() {
    gameOver = true;
    const playerName = playerLabelEl.textContent;
    const opponentName = opponentLabelEl.textContent;
    let message = "Game complete.";

    if (scores.player > scores.opponent) {
        message = `${playerName} wins ${scores.player} to ${scores.opponent}!`;
        if (mode === "ai") saveWin();
        launchConfetti();
    } else if (scores.opponent > scores.player) {
        message = `${opponentName} wins ${scores.opponent} to ${scores.player}.`;
    } else {
        message = `Draw: ${scores.player}-${scores.opponent}.`;
    }

    setStatus(message);
}

function saveWin() {
    const newWins = Number(localStorage.getItem("wins") || 0) + 1;
    localStorage.setItem("wins", newWins);
    winsEl.textContent = newWins;
}

function showSettings() {
    settingsModal.style.display = "flex";
}

function hideSettings() {
    settingsModal.style.display = "none";
}

function attachEventListeners() {
    newGameBtn.addEventListener("click", initializeGame);
    resetBtn.addEventListener("click", initializeGame);
    settingsBtn.addEventListener("click", showSettings);
    closeSettingsBtn.addEventListener("click", hideSettings);
    saveSettingsBtn.addEventListener("click", () => {
        hideSettings();
        initializeGame();
    });

    window.addEventListener("click", (event) => {
        if (event.target === settingsModal) hideSettings();
    });

    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") hideSettings();
    });

    window.addEventListener("resize", () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    });
}

function launchConfetti() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const particles = Array.from({ length: 130 }, () => ({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        size: Math.random() * 8 + 4,
        velocity: Math.random() * 3 + 2,
        hue: Math.random() * 360,
        rotation: Math.random() * Math.PI * 2
    }));

    let life = 240;

    const animate = () => {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles.forEach((particle) => {
            ctx.fillStyle = `hsl(${particle.hue}, 85%, 60%)`;
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            ctx.restore();

            particle.y += particle.velocity;
            particle.x += Math.sin(particle.y / 20) * 1.2;
            if (particle.y > confettiCanvas.height + 20) particle.y = -20;
        });

        life -= 1;
        if (life > 0) {
            confettiFrame = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            cancelAnimationFrame(confettiFrame);
        }
    };

    if (confettiFrame) cancelAnimationFrame(confettiFrame);
    animate();
}

attachEventListeners();
initializeGame();
