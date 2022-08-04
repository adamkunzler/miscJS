let screen = {
  width: 1000,
  height: 1000
};

let imageFiles = [
  'Chocolate.png',
  'Chocolate - sprinkles black.png',
  'Chocolate - sprinkles pink.png',
  'Chocolate - sprinkles rainbow.png',
  'Chocolate - sprinkles white.png',
  'Pink.png',
  'Pink - sprinkles black.png',
  'Pink - sprinkles pink.png',
  'Pink - sprinkles rainbow.png',
  'Pink - sprinkles white.png'
];

let donutImages = [];
let numDonuts = 20;
let donuts = [];
let donutDim = 500;
let donutHalfDim = donutDim / 2;
let maxDonutSpeed = 7;

function preload() {
  for (let i = 0; i < imageFiles.length; i++) {
    let img = loadImage(imageFiles[i]);
    donutImages.push(img);
  }
}

function setup() {
  createCanvas(screen.width, screen.height);
  angleMode(DEGREES);

  createDonuts();
}

function draw() {
  background('#C0D4E9');

  for (let i = 0; i < donuts.length; i++) {
    updateDonut(donuts[i]);
    drawDonut(donuts[i]);
  }
}

function mouseClicked() {
  let donut = createDonut(mouseX, mouseY);
  donuts.push(donut);
}

function updateDonut(donut) {
  donut.rotateAngle += donut.rotateSpeed * donut.rotateDir;

  donut.x += donut.xDir;
  //if (donut.x < 0) donut.xDir *= -1;
  //if (donut.x > screen.width - donutDim) donut.xDir *= -1;
  if(donut.x + donutDim < 0) donut.x = screen.width;
  if(donut.x > screen.width) donut.x = -donutDim;

  donut.y += donut.yDir;
  //if (donut.y < 0) donut.yDir *= -1;
  //if (donut.y > screen.height - donutDim) donut.yDir *= -1;
  if(donut.y + donutDim < 0) donut.y = screen.height;
  if(donut.y > screen.height) donut.y = -donutDim;
}

function drawDonut(donut) {
  push();

  let tx = donut.x + donutHalfDim;
  let ty = donut.y + donutHalfDim;

  // center the donut image, rotate it, then move it back...and draw
  translate(tx, ty); 
  rotate(donut.rotateAngle); 
  translate(-tx, -ty);
  image(donutImages[donut.imageIndex], donut.x, donut.y, donutDim, donutDim);

  pop();
}

function createDonuts() {
  for (let i = 0; i < numDonuts; i++) {
    donuts.push(createDonut());
  }
}

function createDonut(x, y) {
  let donut = {
    x: x ? x : Math.floor(random(screen.width - donutDim)),
    y: y ? y : Math.floor(random(screen.height - donutDim)),
    xDir: (random(maxDonutSpeed) + 1) * random([-1, 1]),
    yDir: (random(maxDonutSpeed) + 1) * random([-1, 1]),
    rotateDir: random([-1, 1]),
    rotateSpeed: random(3) + 1,
    rotateAngle: random(360),
    imageIndex: Math.floor(random(donutImages.length))
  };
  return donut;
}