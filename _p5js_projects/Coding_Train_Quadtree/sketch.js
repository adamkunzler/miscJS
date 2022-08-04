let qt;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qt = new QuadTree(boundary, 4);
  
  //randomPoints(1500);
  randomPointsCircle(1500);
}

function draw() {
  background(0);

  if(mouseIsPressed) {
    //let m = new Point(mouseX, mouseY);
    //qt.insert(m)
  }
  
  qt.show();  
  
  drawQueryRange();
  
  drawFPS();
}

function drawQueryRange() {
  stroke(0, 255, 0);
  strokeWeight(1);
  rectMode(CENTER);
  noFill();
  
  let range = new Rectangle(mouseX, mouseY, 100, 100);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  
  // ------------------------------
  
  stroke(0, 255, 0);
  noFill();
  strokeWeight(5);
  
  let points = qt.query(range);    
  for(let i = 0; i < points.length; i++) {
    point(points[i].x, points[i].y);
  }
}

function drawFPS() {
  // FPS
  textSize(32);
  fill(0, 255, 0);
  stroke(0, 255, 0);
  strokeWeight(2);
  text(`${frameRate().toFixed(0)} FPS`, 35, 35);  
}

function randomPoints(numPoints) {
  for(let i = 0; i < numPoints; i++) {
    let p = new Point(Math.random() * width, Math.random() * height);
    qt.insert(p);
  }
}

function randomPointsCircle(numPoints) {
  for(let i = 0; i < numPoints; i++) {
    let a = Math.random();
    let b = Math.random();
    let r = width / 2;
    
    // a needs to be less than b
    if( a < b) [a, b] = [b, a];
    
    let x = (b * r * Math.cos(2 * PI * a / b));
    let y = (b * r * Math.sin(2 * PI * a / b));
    
    x += width / 4;
    y += height / 4;
    
    let p = new Point(x, y);
    qt.insert(p);
  }
}

