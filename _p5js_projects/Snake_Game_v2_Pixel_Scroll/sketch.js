let screenWidth = 1000;
let screenHeight = 1000;

let speed = 60;

let map = [];
let mapWidth = 25;
let mapHeight = 25;
let cellDim = 40;
let showMapGrid = true;

let snake = [];
let snakeSpeed = 4; // needs to be a factor of cellDim
let fruit;

let stepsPerCell = cellDim / snakeSpeed;
console.log('steps per cell: ', stepsPerCell);

let lockToCells = true;
let isCircles = true;

function setup() {
  createCanvas(screenWidth, screenHeight);
  frameRate(speed);

  createMap();

  newFruit();

  snake.push({
    x: Math.floor(mapWidth / 2) * cellDim,
    y: Math.floor(mapHeight / 2) * cellDim,
    xDir: 0,
    yDir: 0,
    nextXDir: 0,
    nextYDir: 0
  });
}

function draw() {
  background(220);

  drawMap();

  drawFruit();

  drawSnake();

  updateSnake();

  textSize(24);
  stroke(0);
  fill(0);
  //text(`x: ${snake[0].x}, y: ${snake[0].y}`, 50, 50);
  //text(`x: ${snake[0].x % cellDim}, y: ${snake[0].y % cellDim}`, 50, 80);
  //text(`x: ${Math.floor(snake[0].x / cellDim)}, y: ${Math.floor(snake[0].y / cellDim)}`, 50, 110);
  text(`Score: ${snake.length}`, 10, 25);
}

function drawFruit() {
  stroke(250, 0, 0);
  fill(250, 0, 0);
  square(fruit.x * cellDim, fruit.y * cellDim, cellDim);
}

// TODO - still something weird here
function newFruit() {
  let tries = 0;
  while (tries <= 20) {
    fruit = {
      x: Math.floor(Math.random() * mapWidth),
      y: Math.floor(Math.random() * mapHeight)
    };

    let found = true;
    for (let i = 0; i < snake.length; i++) {
      if (fruit.x === snake[i].x * cellDim && fruit.y === snake[i].y * cellDim) {
        found = false;
      }
    }

    if (found) break;
    tries++;
  }
}

function drawSnake() {

  let offset = cellDim / 6;
  let dim = cellDim * (2 / 3);
  let cOffset = cellDim / 2;

  stroke(44, 9, 73);
  fill(135, 95, 168);

  for (let i = 0; i < snake.length; i++) {
    let x = snake[i].x;
    let y = snake[i].y;

    if (i === 0) {
      if (isCircles)
        circle(x + cOffset, y + cOffset, dim);
      else
        square(x + offset, y + offset, dim);
    } else {
      if (isCircles)
        circle(x + cOffset, y + cOffset, dim);
      else
        square(x + offset, y + offset, dim);
    }
  }
}

function updateSnake() {

  updateSnakeDirection();

  let nextSnakePos = {
    x: snake[0].x + (snake[0].xDir * snakeSpeed),
    y: snake[0].y + (snake[0].yDir * snakeSpeed),
    xDir: snake[0].xDir,
    yDir: snake[0].yDir
  };

  let hit = checkBounds(nextSnakePos);
  if (hit) return;

  let collide = checkCollisionWithSelf(nextSnakePos);
  if (collide) return;

  // check if fruit
  let gotFruit = checkFruitHit(nextSnakePos);
  if (gotFruit) {
    // add a new head where the fruit is (with same dir as current head)
    let newHead = {
      x: fruit.x * cellDim,
      y: fruit.y * cellDim,
      xDir: snake[0].xDir,
      yDir: snake[0].yDir,
      nextXDir: snake[0].nextXDir,
      nextYDir: snake[0].nextYDir
    };

    snake.unshift(newHead);

    newFruit();

    stepNum = 0;

  } else {

    for (let i = snake.length - 1; i >= 0; i--) {
      snake[i].x += snake[i].xDir * snakeSpeed;
      snake[i].y += snake[i].yDir * snakeSpeed;

      if (i > 0 && snake[i].x % cellDim === 0 && snake[i].y % cellDim === 0) {
        snake[i].xDir = snake[i - 1].xDir;
        snake[i].yDir = snake[i - 1].yDir;
      }
    }
  }

}

function checkFruitHit(nextSnakePos) {
  let isDownOrRight = nextSnakePos.xDir > 0 || nextSnakePos.yDir > 0;

  let x = isDownOrRight ? Math.ceil(nextSnakePos.x / cellDim) : Math.floor(nextSnakePos.x / cellDim);
  let y = isDownOrRight ? Math.ceil(nextSnakePos.y / cellDim) : Math.floor(nextSnakePos.y / cellDim);

  if (x === fruit.x && y === fruit.y) {
    return true;
  }
  return false;
}

function checkCollisionWithSelf(nextSnakePos) {
  if (snake.length < 2) return false;

  let isDownOrRight = nextSnakePos.xDir > 0 || nextSnakePos.yDir > 0;
  
  let nx = isDownOrRight ? Math.ceil(nextSnakePos.x / cellDim) : Math.floor(nextSnakePos.x / cellDim);
  let ny = isDownOrRight ? Math.ceil(nextSnakePos.y / cellDim) : Math.floor(nextSnakePos.y / cellDim);
  
  for (let i = 1; i < snake.length; i++) {
    let x = Math.floor(snake[i].x / cellDim);
    let y = Math.floor(snake[i].y / cellDim);
    
    if (nx === x && ny === y)
      return true;
  }

  return false;
}

function checkBounds(nextSnakePos) {
  // check left/right bounds  
  if (nextSnakePos.x < 0) {
    nextSnakePos.x = 0;
    return true;
  }

  if (nextSnakePos.x > mapWidth * cellDim - cellDim) {
    nextSnakePos.x = mapWidth * cellDim - 1;
    return true;
  }

  // check top/bottom bounds  
  if (nextSnakePos.y < 0) {
    nextSnakePos.y = 0;
    return true;
  }

  if (nextSnakePos.y > mapHeight * cellDim - cellDim) {
    nextSnakePos.y = mapHeight * cellDim - 1;
    return true;
  }

  return false;
}

function updateSnakeDirection() {
  let i = 0;
  // horizontal alignment with tile and there's a Y direction change
  if (snake[i].x % cellDim === 0 && snake[i].nextYDir !== 0) {
    snake[i].xDir = 0;
    snake[i].yDir = snake[i].nextYDir;
    snake[i].nextXDir = 0;
    snake[i].nextYDir = 0;
  }
  // vertical alignment with tile and there's an X direction change
  else if (snake[i].y % cellDim === 0 && snake[i].nextXDir !== 0) {
    snake[i].yDir = 0;
    snake[i].xDir = snake[i].nextXDir;
    snake[i].nextXDir = 0;
    snake[i].nextYDir = 0;
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && snake[0].xDir !== 1) {

    snake[0].nextXDir = -1;
    snake[0].nextYDir = 0;

  } else if (keyCode === RIGHT_ARROW && snake[0].xDir !== -1) {

    snake[0].nextXDir = 1;
    snake[0].nextYDir = 0;

  } else if (keyCode === UP_ARROW && snake[0].yDir !== 1) {

    snake[0].nextXDir = 0;
    snake[0].nextYDir = -1;

  } else if (keyCode === DOWN_ARROW && snake[0].yDir !== -1) {

    snake[0].nextXDir = 0;
    snake[0].nextYDir = 1;

  }

  if (keyCode === 32) { // space

  }

  if (keyCode === 70) { // F    

  }
}

function drawMap() {
  if (showMapGrid)
    stroke(200);
  else
    noStroke();

  fill(225);

  for (let y = 0; y < mapHeight; y++) {
    for (let x = 0; x < mapWidth; x++) {
      let i = map[x + y * mapWidth];
      square(x * cellDim, y * cellDim, cellDim);
    }
  }
}

function createMap() {
  map = [];
  let dim = mapWidth * mapHeight;
  for (let i = 0; i < dim; i++)
    map.push(0);
}