let particles = [];
let numParticles = 1500;
let capacity = 75;
let particleSize = 4;

function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(640, 480);
      
  for(let i = 0; i < numParticles; i++) {
    //let p = new Particle(Math.random() * width, Math.random() * height, particleSize);
    let p = getRandomParticleFromCircle(width / 2, 3, 3);
    particles.push(p);      
  }
}

function draw() {
  background(0);
  
  let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  let qtree = new QuadTree(boundary, capacity);
  
  for(let p of particles) {
    let point = new Point(p.x, p.y, p);
    qtree.insert(point);
    
    p.move();
    p.render();
    p.setHighlight(false);
  }
  
  for(let p of particles) {
    let range = new Circle(p.x, p.y, p.r * 2);
    let points = qtree.query(range);
    for(let point of points) {
      let other = point.userData;
      if(p === other) continue;
      
      let isIntersect = p.intersects(other);
      if(isIntersect) p.setHighlight(true);
    }
  }
  
  //qtree.show(false);
  
  drawFPS();
}

// let qt;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
  
//   let boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
//   qt = new QuadTree(boundary, 4);
  
//   //randomPoints(1500);
//   randomPointsCircle(1500);
// }

// function draw() {
//   background(0);

//   if(mouseIsPressed) {
//     //let m = new Point(mouseX, mouseY);
//     //qt.insert(m)
//   }
  
//   qt.show();  
  
//   drawQueryRange();
  
//   drawFPS();
// }

// function drawQueryRange() {
//   stroke(0, 255, 0);
//   strokeWeight(1);
//   rectMode(CENTER);
//   noFill();
  
//   let range = new Rectangle(mouseX, mouseY, 100, 100);
//   rect(range.x, range.y, range.w * 2, range.h * 2);
  
//   // ------------------------------
  
//   stroke(0, 255, 0);
//   noFill();
//   strokeWeight(5);
  
//   let points = qt.query(range);    
//   for(let i = 0; i < points.length; i++) {
//     point(points[i].x, points[i].y);
//   }
// }

function drawFPS() {
  // FPS
  textSize(32);
  fill(0, 255, 0);
  stroke(0, 255, 0);
  strokeWeight(2);
  text(`${frameRate().toFixed(0)} FPS`, 35, 35);  
}

// function randomPoints(numPoints) {
//   for(let i = 0; i < numPoints; i++) {
//     let p = new Point(Math.random() * width, Math.random() * height);
//     qt.insert(p);
//   }
// }

function getRandomParticleFromCircle(r, xOffset = 1, yOffset = 1) {
  let a = Math.random();
  let b = Math.random();

  // a needs to be less than b
  if( a < b) [a, b] = [b, a];

  let x = (b * r * Math.cos(2 * PI * a / b));
  let y = (b * r * Math.sin(2 * PI * a / b));

  x += width / xOffset;
  y += height / yOffset;

  let p = new Particle(x, y, particleSize);
  return p;  
}

