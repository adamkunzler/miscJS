// TODO
//
// [] have fruit watch dragon flying around (if head < fruit)
// []
// []
// []
//
//
//


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
let fruitSprite;
let fruitScale = 128;
let eggScale = 64; // draw eggs at 64x64
let eggOffset;
let eggAnimationSpeed = .15;
let dragonAnimationSpeed = .15;

let dragonFile = 'dragon_spritesheet';
let dragonSpriteDetails = {};

// d l r u
let dragonSprites = [];

// itch.io
let slimeSpriteFiles = [
  'Slime_Medium_Blue',
  'Slime_Medium_Green',
  'Slime_Medium_Orange',
  'Slime_Medium_Red',
  'Slime_Medium_White'
];
let slimeSpriteDetails = [];

// 0 = orange
// orange[i] = d r u l
let slimeAnimations = [];

let slimes = [];

let wallHits = 0;
let bodyHits = 0;
let snakeIsMoving = false;

// --------------------------------------------------------------------------------------------------

function preload() {
  dragonSpriteDetails = {
    spritesheet: loadImage(dragonFile + '.png'),
    spritedata: loadJSON(dragonFile + '.json')
  };

  for (let i = 0; i < slimeSpriteFiles.length; i++) {
    let detail = {
      spritesheet: loadImage(slimeSpriteFiles[i] + '.png'),
      spritedata: loadJSON(slimeSpriteFiles[i] + '.json')
    };

    slimeSpriteDetails.push(detail);
  }

}

function setupSlimeSprites() {
  let imageWidth = 0;

  for (let i = 0; i < slimeSpriteDetails.length; i++) {
    let frames = slimeSpriteDetails[i].spritedata.frames;
    let slimeColorSet = [];

    // 4 rows of 4 sprites    
    for (let j = 0; j < 4; j++) {
      let slimeDirs = [];

      for (let k = 0; k < 4; k++) {
        let index = j * 4 + k;
        let pos = frames[index].position;
        let img = slimeSpriteDetails[i].spritesheet.get(pos.x, pos.y, pos.w, pos.h);
        imageWidth = pos.w;

        slimeDirs.push(img);
      }

      slimeColorSet.push(slimeDirs);
    }

    slimeAnimations.push(slimeColorSet);
  }
  
  eggOffset = (eggScale - cellDim) / 2;
}

function setupDragonSprites() {
  let frames = dragonSpriteDetails.spritedata.frames;
  let animations = [];

  // 4 rows of 3 sprites
  for (let i = 0; i < 4; i++) {
    let dirs = [];

    for (let j = 0; j < 3; j++) {
      let index = j + i * 3;
      let pos = frames[index].position;
      let img = dragonSpriteDetails.spritesheet.get(pos.x, pos.y, pos.w, pos.h);
      dirs.push(img);
    }

    animations.push(dirs);
  }

  let down = new Sprite(animations[0], dragonAnimationSpeed);
  let left = new Sprite(animations[1], dragonAnimationSpeed);
  let right = new Sprite(animations[2], dragonAnimationSpeed);
  let up = new Sprite(animations[3], dragonAnimationSpeed);
  dragonSprites.push(down, left, right, up);
}

function getNewEgg(eggIndex) {  
  let slimeAnimation = slimeAnimations[eggIndex];
  let egg = {
    down: new Sprite(slimeAnimation[0], eggAnimationSpeed),
    right: new Sprite(slimeAnimation[1], eggAnimationSpeed),
    up: new Sprite(slimeAnimation[2], eggAnimationSpeed),
    left: new Sprite(slimeAnimation[3], eggAnimationSpeed)
  };
  return egg;
}

function setup() {
  createCanvas(screenWidth, screenHeight);
  frameRate(speed);

  //setupSprites();
  setupSlimeSprites();
  setupDragonSprites();

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
  background(52, 52, 52);

  drawMap();

  drawFruit();

  drawSnake();

  updateSnake();

  drawText();
}

function drawText() {
  textSize(24);
  stroke(200);
  fill(200);
  
  let numBlobs = snake.length - 1;
  let score = (numBlobs * 10) - ((wallHits + bodyHits) * 10);
  if(score < 0) score = 0;
  
  text(`Blobs: ${numBlobs}`, 10, 25);
  text(`Wall Hits: ${wallHits}`, 10, 55);
  text(`Body Hits: ${bodyHits}`, 10, 85);
  text(`SCORE: ${score}`, screenWidth / 2 - 75, 25); // just making shit up with the math
}

function drawFruit() {
  // stroke(250, 0, 0);
  // fill(250, 0, 0);
  // square(fruit.x * cellDim, fruit.y * cellDim, cellDim);
  let fruitOffset = (fruitScale - cellDim) / 2;
  let x = (fruit.x * cellDim) - fruitOffset;
  let y = (fruit.y * cellDim) - fruitOffset;
    
  fruitSprite.show(x, y, fruitScale, fruitScale);
  fruitSprite.animate();
}

// TODO - still something weird here
function newFruit() {
  let tries = 0;
  while (tries <= 20) {
    fruit = {
      x: Math.floor(Math.random() * mapWidth),
      y: Math.floor(Math.random() * mapHeight),
      eggIndex: random([0, 1, 2, 3, 4])
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
    
  // 0 is the up animation
  fruitSprite = new Sprite(slimeAnimations[fruit.eggIndex][0], eggAnimationSpeed);
}

function drawSnake() {
  // draw the tail segments
  for (let i = 1; i < snake.length; i++) {

    let ex = snake[i].x - eggOffset;
    let ey = snake[i].y - eggOffset;

    // slimes index is snake index - 1 (snake 1 = slime 0)                        
    if (snake[i].xDir === 1) {
      slimes[i - 1].right.show(ex, ey, eggScale, eggScale);
      slimes[i - 1].right.animate();
    } else if (snake[i].xDir === -1) {
      slimes[i - 1].left.show(ex, ey, eggScale, eggScale);
      slimes[i - 1].left.animate();
    } else if (snake[i].yDir === 1) {
      slimes[i - 1].down.show(ex, ey, eggScale, eggScale);
      slimes[i - 1].down.animate();
    } else if (snake[i].yDir === -1) {
      slimes[i - 1].up.show(ex, ey, eggScale, eggScale);
      slimes[i - 1].up.animate();
    }
  }

  // draw the head
  let sx = 72; // 144 | 72 (96 2/3rds)
  let sy = 48; // 96 | 48 (64 2/4rds)
  let dx = snake[0].x - ((sx - cellDim) / 2);
  let dy = snake[0].y - ((sy - cellDim) / 2);

  if (snake[0].xDir === 1) {
    dragonSprites[2].show(dx, dy, sx, sy);
    dragonSprites[2].animate();
  } else if (snake[0].xDir === -1) {
    dragonSprites[1].show(dx, dy, sx, sy);
    dragonSprites[1].animate();
  } else if (snake[0].yDir === 1 || (snake[0].xDir === 0 && snake[0].yDir === 0)) {
    dragonSprites[0].show(dx, dy, sx, sy);
    dragonSprites[0].animate();
  } else if (snake[0].yDir === -1) {
    dragonSprites[3].show(dx, dy, sx, sy);
    dragonSprites[3].animate();
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
  if (hit) {
    if(snakeIsMoving) wallHits++;
    snakeIsMoving = false;
    return;
  }

  let collide = checkCollisionWithSelf(nextSnakePos);
  if (collide) {
    if(snakeIsMoving) bodyHits++;
    snakeIsMoving = false;
    return;
  }

  snakeIsMoving = true;
  
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

    let newEgg = getNewEgg(fruit.eggIndex);
    slimes.push(newEgg);
        
    newFruit();
  } else {

    // moving from the end of the tail up to the head
    // this is because if we go head to tail, the segment 
    // direction changes too soon.
    for (let i = snake.length - 1; i >= 0; i--) {
      // move each snake segment
      snake[i].x += snake[i].xDir * snakeSpeed;
      snake[i].y += snake[i].yDir * snakeSpeed;

      // if not the head and your lined up with a cell...update the
      // segment direction the same as the direction of the segment
      // in front of you
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
    stroke(40);
  else
    noStroke();

  fill(52, 52, 52);

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