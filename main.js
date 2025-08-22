const WIDTH = 16;
const HEIGHT = 16;
const unitSpace = 40;
let score = 0;

const board = document.querySelector(".board");
const scoreEl = document.querySelector(".score");

// RIGHT BOTTOM LEFT TOP
let DIRECTION = "LEFT";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

let food = { x: getRandomInt(0, WIDTH), y: getRandomInt(0, HEIGHT) };
let snake = [
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) },
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 1 },
  { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 2 },
];

const drawBoard = () => {
  board.innerHTML = "";
  board.style.width = `${unitSpace * WIDTH}px`;
  board.style.height = `${unitSpace * HEIGHT}px`;

  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const tileEl = document.createElement("div");
      tileEl.setAttribute("x", row);
      tileEl.setAttribute("y", col);
      tileEl.className = "tile";
      board.appendChild(tileEl);
    }
  }

  const foodEl = document.querySelector(`[x="${food.x}"][y="${food.y}"]`);
  if (foodEl) foodEl.classList.add("food");

  for (let i = 0; i < snake.length; i++) {
    const dot = snake[i];
    const tile = document.querySelector(`[x="${dot.x}"][y="${dot.y}"]`);
    if (!tile) continue;
    if (i === 0) {
      tile.classList.add("head");
    } else {
      tile.classList.add("body");
    }
  }

  if (scoreEl) {
    scoreEl.textContent = `Score: ${score}`;
  }
};

let speed = 200;
let gameInterval;

function gameLoop() {
  const newSnake = [];

  if (DIRECTION === "RIGHT") {
    newSnake[0] = { x: snake[0].x, y: (snake[0].y + 1) % WIDTH };
  } else if (DIRECTION === "LEFT") {
    let nextY = snake[0].y - 1;
    if (nextY === -1) nextY = WIDTH - 1;
    newSnake[0] = { x: snake[0].x, y: nextY };
  } else if (DIRECTION === "BOTTOM") {
    newSnake[0] = { x: (snake[0].x + 1) % HEIGHT, y: snake[0].y };
  } else if (DIRECTION === "TOP") {
    let nextX = snake[0].x - 1;
    if (nextX === -1) nextX = HEIGHT - 1;
    newSnake[0] = { x: nextX, y: snake[0].y };
  }

  if (snake.some((dot) => dot.x === newSnake[0].x && dot.y === newSnake[0].y)) {
    snake = [
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) },
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 1 },
      { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) - 2 },
    ];
    score = 0;
    DIRECTION = "LEFT";
    speed = 200;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
    drawBoard();
    return;
  }

  const ateFood = newSnake[0].x === food.x && newSnake[0].y === food.y;

  for (let i = 0; i < snake.length; i++) {
    newSnake.push(snake[i]);
  }

  if (ateFood) {
    score++;
    do {
      food = { x: getRandomInt(0, WIDTH), y: getRandomInt(0, HEIGHT) };
    } while (snake.some((dot) => dot.x === food.x && dot.y === food.y));

    speed = Math.max(50, speed - 50); 
    clearInterval(gameInterval); 
    gameInterval = setInterval(gameLoop, speed);
  } else {
    newSnake.pop();
  }

  snake = newSnake;
  drawBoard();
}

gameInterval = setInterval(gameLoop, speed);
drawBoard();

window.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "w" && DIRECTION !== "BOTTOM") {
    DIRECTION = "TOP";
  } else if (key === "s" && DIRECTION !== "TOP") {
    DIRECTION = "BOTTOM";
  } else if (key === "d" && DIRECTION !== "LEFT") {
    DIRECTION = "RIGHT";
  } else if (key === "a" && DIRECTION !== "RIGHT") {
    DIRECTION = "LEFT";
  }
});
