// Grab the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("scoreDisplay");

// Game settings
const gridSize = 20; // Each cell size in pixels
const tileCount = 20; // Number of cells across in both directions (400/20 = 20)
let speed = 150; // Lower is faster; time in ms between updates

// Snake initial state
let snakePosX = 10;
let snakePosY = 10;
let snakeVelX = 0;
let snakeVelY = 0;
let snakeBody = [];
let snakeLength = 1;

// Food initial state
let foodX = 5;
let foodY = 5;

let score = 0;
let gameRunning = true;

// Listen for key presses and touch events
document.addEventListener("keydown", keyDown);
canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;

// Game loop (update and draw) using setInterval
const gameLoop = setInterval(() => {
  if (gameRunning) {
    update();
    draw();
  }
}, speed);

// Update snake position, check collisions, etc.
function update() {
  snakePosX += snakeVelX;
  snakePosY += snakeVelY;

  // Check for wall collision
  if (
    snakePosX < 0 || 
    snakePosX >= tileCount || 
    snakePosY < 0 || 
    snakePosY >= tileCount
  ) {
    gameOver();
    return;
  }

  // Insert head at the front of the snake body
  snakeBody.unshift({ x: snakePosX, y: snakePosY });

  // Keep snake body at correct length
  if (snakeBody.length > snakeLength) {
    snakeBody.pop();
  }

  // Check for food collision
  if (snakePosX === foodX && snakePosY === foodY) {
    snakeLength++;
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  }

  // Check for self-collision
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].x === snakePosX && snakeBody[i].y === snakePosY) {
      gameOver();
      return;
    }
  }
}

// Draw everything on the canvas
function draw() {
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = "red";
  ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize, gridSize);

  // Draw snake
  ctx.fillStyle = "lime";
  snakeBody.forEach((part) => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });
}

// Place new food randomly within tileCount
function placeFood() {
  foodX = Math.floor(Math.random() * tileCount);
  foodY = Math.floor(Math.random() * tileCount);
}

// Handle game over
function gameOver() {
  gameRunning = false;
  alert('Game Over! Your score: ' + score);
  clearInterval(gameLoop);
}

// Handle keyboard controls
function keyDown(evt) {
  switch (evt.key) {
    case "ArrowLeft":
    case "a":
      if (snakeVelX !== 1) {
        snakeVelX = -1;
        snakeVelY = 0;
      }
      break;
    case "ArrowUp":
    case "w":
      if (snakeVelY !== 1) {
        snakeVelX = 0;
        snakeVelY = -1;
      }
      break;
    case "ArrowRight":
    case "d":
      if (snakeVelX !== -1) {
        snakeVelX = 1;
        snakeVelY = 0;
      }
      break;
    case "ArrowDown":
    case "s":
      if (snakeVelY !== -1) {
        snakeVelX = 0;
        snakeVelY = 1;
      }
      break;
  }
}

// Handle touch start
function handleTouchStart(evt) {
  const touch = evt.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

// Handle touch move
function handleTouchMove(evt) {
  if (!gameRunning) return;

  const touch = evt.touches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && snakeVelX !== -1) {
      snakeVelX = 1;
      snakeVelY = 0;
    } else if (deltaX < 0 && snakeVelX !== 1) {
      snakeVelX = -1;
      snakeVelY = 0;
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && snakeVelY !== -1) {
      snakeVelX = 0;
      snakeVelY = 1;
    } else if (deltaY < 0 && snakeVelY !== 1) {
      snakeVelX = 0;
      snakeVelY = -1;
    }
  }
}
