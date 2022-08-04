let screenWidth = 1000;
let screenHeight = 1000;

let speed = 7;

let map = [];
let mapWidth = 25;
let mapHeight = 25;
let cellDim = 40;

let snake = [];
let fruit;
let snakeXDir = 0;
let snakeYDir = 0;

function setup() {
  createCanvas(screenWidth, screenHeight);
  
  frameRate(speed);

  createMap();

  newFruit();

  snake.push({
    x: Math.floor(mapWidth / 2),
    y: Math.floor(mapHeight / 2)
  });
}

function draw() {
  background(220);

  drawMap();

  // draw fruit
  stroke(250, 0, 0);
  fill(250, 0, 0);
  square(fruit.x * cellDim, fruit.y * cellDim, cellDim);

  drawSnake();

  updateSnake();      
}

function newFruit() {
  let tries = 0;
  while (tries <= 20) {
    fruit = {
      x: Math.floor(Math.random() * mapWidth),
      y: Math.floor(Math.random() * mapHeight)
    };

    let found = true;
    for (let i = 0; i < snake.length; i++) {
      if (fruit.x === snake[i].x && fruit.y === snake[i].y) {
        found = false;
      }
    }

    if (found) break;
    tries++;
  }
}

function drawSnake() {
  let diameter = cellDim * 0.75;
  let offset = cellDim / 2; 
  
  stroke(0);
  fill(50);

  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      //stroke(0, 225, 0);
      //fill(0, 225, 0);
    } else {
      //stroke(0, 150, 0);
      //fill(0, 150, 0);
    }

    let x = snake[i].x * cellDim;
    let y = snake[i].y * cellDim;

    if (i === 0) {
      circle(x + offset, y + offset, cellDim);      
    } else {
      circle(x + offset, y + offset, cellDim * 0.75);
    }
  }
}

function updateSnake() {
  let nextSnakePos = {
    x: snake[0].x + snakeXDir,
    y: snake[0].y + snakeYDir,
  };

  let hit = checkBounds(nextSnakePos);
  if (hit) return;

  let collide = checkCollision(nextSnakePos);
  if (collide) return;

  // check if fruit
  if (nextSnakePos.x === fruit.x && nextSnakePos.y === fruit.y) {
    snake.unshift({
      x: nextSnakePos.x,
      y: nextSnakePos.y
    });

    newFruit();
  } else {
    // not fruit...just move the body            
    snake.pop();
    snake.unshift(nextSnakePos);
  }  
}

function checkCollision(nextSnakePos) {
  if (snake.length < 2) return false;

  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === nextSnakePos.x && snake[i].y === nextSnakePos.y)
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

  if (nextSnakePos.x > mapWidth - 1) {
    nextSnakePos.x = mapWidth - 1;
    return true;
  }

  // check top/bottom bounds  
  if (nextSnakePos.y < 0) {
    nextSnakePos.y = 0;
    return true;
  }

  if (nextSnakePos.y > mapHeight - 1) {
    nextSnakePos.y = mapHeight - 1;
    return true;
  }

  return false;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW && snakeXDir !== 1) {
    snakeXDir = -1;
    snakeYDir = 0;
  } else if (keyCode === RIGHT_ARROW && snakeXDir !== -1) {
    snakeXDir = 1;
    snakeYDir = 0;
  } else if (keyCode === UP_ARROW && snakeYDir !== 1) {
    snakeXDir = 0;
    snakeYDir = -1;
  } else if (keyCode === DOWN_ARROW && snakeYDir !== -1) {
    snakeXDir = 0;
    snakeYDir = 1;
  }
}

function drawMap() {
  stroke(200);
  //noStroke();
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
