// Grab the canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreDisplay = document.getElementById("scoreDisplay");

// Game settings
const gridSize = 20; // Each cell size in pixels
const tileCount = 20; // Number of cells across in both directions (400/20 = 20)
let speed = 150; // Lower is faster; time in ms between updates

// Snake initial state
let snakePosX = 10; // Snake head x position (in grid cells)
let snakePosY = 10; // Snake head y position (in grid cells)
let snakeVelX = 0; // Snake movement X direction
let snakeVelY = 0; // Snake movement Y direction
let snakeBody = []; // Array holding the coordinates of all snake body parts
let snakeLength = 1; // Starting length of snake

// Food initial state
let foodX = 5; // Food x position (in grid cells)
let foodY = 5; // Food y position (in grid cells)

let score = 0;
let gameRunning = true;

// Listen for key presses to move the snake
document.addEventListener("keydown", keyDown);

// Game loop (update and draw) using setInterval
const gameLoop = setInterval(() => {
  if (gameRunning) {
    update();
    draw();
  }
}, speed);

// Update snake position, check collisions, etc.
function update() {
  // Move the snake head
  snakePosX += snakeVelX;
  snakePosY += snakeVelY;

  // 1) Check for wall collision -> end game
  if (
    snakePosX < 0 || 
    snakePosX >= tileCount || 
    snakePosY < 0 || 
    snakePosY >= tileCount
  ) {
    gameRunning = false;
    alert('Game Over! Your score: ' + score);
    clearInterval(gameLoop);
    return;
  }

  // 2) Insert head at the front of the snake body
  snakeBody.unshift({ x: snakePosX, y: snakePosY });

  // 3) Keep snake body at correct length
  if (snakeBody.length > snakeLength) {
    snakeBody.pop();
  }

  // 4) Check for food collision -> grow snake
  if (snakePosX === foodX && snakePosY === foodY) {
    snakeLength++;
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  }

  // 5) Check for self-collision
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].x === snakePosX && snakeBody[i].y === snakePosY) {
      gameRunning = false;
      alert('Game Over! Your score: ' + score);
      clearInterval(gameLoop);
      return;
    }
  }
}


// Draw everything on the canvas
function draw() {
  // Clear the canvas
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

// Handle keyboard controls
function keyDown(evt) {
  // Controls: Arrows or WASD
  switch (evt.key) {
    case "ArrowLeft":
    case "a":
      if (snakeVelX === 1) break; // Prevent moving in opposite direction directly
      snakeVelX = -1;
      snakeVelY = 0;
      break;
    case "ArrowUp":
    case "w":
      if (snakeVelY === 1) break;
      snakeVelX = 0;
      snakeVelY = -1;
      break;
    case "ArrowRight":
    case "d":
      if (snakeVelX === -1) break;
      snakeVelX = 1;
      snakeVelY = 0;
      break;
    case "ArrowDown":
    case "s":
      if (snakeVelY === -1) break;
      snakeVelX = 0;
      snakeVelY = 1;
      break;
  }
}
