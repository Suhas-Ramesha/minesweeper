const WIDTH = 8;
const HEIGHT = 8;
const MINES = 8;

const gameContainer = document.getElementById("game-container");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");

const grid = [];
const mines = new Set();
let revealedCells = 0;
let score = 0;
let timer = 0;
let timerInterval;

// Initialize game
function initGame() {
    // Reset timer and score
    clearInterval(timerInterval);
    timer = 0;
    score = 0;
    revealedCells = 0;

    // Update UI
    timerElement.textContent = `Time: 0s`;
    scoreElement.textContent = `Score: 0`;

    // Clear grid
    gameContainer.innerHTML = "";
    grid.length = 0;
    mines.clear();

    // Start timer
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `Time: ${timer}s`;
    }, 1000);

    // Create grid and randomize mines
    while (mines.size < MINES) {
        const randomCell = Math.floor(Math.random() * WIDTH * HEIGHT);
        mines.add(randomCell);
    }

    for (let row = 0; row < HEIGHT; row++) {
        const rowArray = [];
        for (let col = 0; col < WIDTH; col++) {
            const cellIndex = row * WIDTH + col;
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = cellIndex;

            cell.addEventListener("click", () => revealCell(cellIndex));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(cellIndex);
            });

            gameContainer.appendChild(cell);
            rowArray.push(cell);
        }
        grid.push(rowArray);
    }
}

// Toggle flag
function toggleFlag(index) {
    const row = Math.floor(index / WIDTH);
    const col = index % WIDTH;
    const cell = grid[row][col];

    if (!cell.classList.contains("revealed")) {
        if (cell.classList.contains("flagged")) {
            cell.classList.remove("flagged");
            score -= 10;
        } else {
            cell.classList.add("flagged");
            score += 10;
        }
        scoreElement.textContent = `Score: ${score}`;
    }
}

// Reveal cell
function revealCell(index) {
    const row = Math.floor(index / WIDTH);
    const col = index % WIDTH;
    const cell = grid[row][col];

    if (cell.classList.contains("revealed") || cell.classList.contains("flagged")) {
        return;
    }

    cell.classList.add("revealed");

    if (mines.has(index)) {
        cell.textContent = "💣";
        endGame(false);
        return;
    }

    revealedCells++;
    score += 20;
    scoreElement.textContent = `Score: ${score}`;

    const nearbyMines = countNearbyMines(row, col);
    if (nearbyMines > 0) {
        cell.textContent = nearbyMines;
    } else {
        revealSurroundingCells(row, col);
    }

    if (revealedCells + MINES === WIDTH * HEIGHT) {
        endGame(true);
    }
}

// Count nearby mines
function countNearbyMines(row, col) {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < HEIGHT && c >= 0 && c < WIDTH) {
                const index = r * WIDTH + c;
                if (mines.has(index)) {
                    count++;
                }
            }
        }
    }
    return count;
}

// Reveal surrounding cells
function revealSurroundingCells(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < HEIGHT && c >= 0 && c < WIDTH) {
                const index = r * WIDTH + c;
                revealCell(index);
            }
        }
    }
}

// End game
function endGame(won) {
    clearInterval(timerInterval);

    for (const mine of mines) {
        const row = Math.floor(mine / WIDTH);
        const col = mine % WIDTH;
        const cell = grid[row][col];
        cell.textContent = "💣";
        cell.classList.add("revealed");
    }

    setTimeout(() => {
        alert(won ? `You won! Final Score: ${score} | Time: ${timer}s` : `You lost! Final Score: ${score}`);
        initGame();
    }, 100);
}

// Start the game
initGame();
