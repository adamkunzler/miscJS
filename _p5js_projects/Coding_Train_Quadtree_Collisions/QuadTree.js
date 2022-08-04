//
//
//
class Point {
  constructor(x, y, userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }  
}

//
// x,y represent center
// w,h represent distance from center to edge
//
class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  
  contains(point) {
    const greaterThanLeft = point.x > this.x - this.w;
    const lessThanRight = point.x < this.x + this.w;
    const greaterThanTop = point.y > this.y - this.h;
    const lessThanBottom = point.y < this.y + this.h;
    
    return greaterThanLeft && lessThanRight && greaterThanTop && lessThanBottom;
  }
  
  intersects(range) {
    return !(range.x - range.w > this.x + this.w
      || range.x + range.w < this.x - this.w
      || range.y - range.h > this.y + this.h
      || range.y + range.h < this.y - this.h);
  }
}

//
//
//
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }
  
  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= this.rSquared;
  }

  intersects(range) {

    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    // radius of the circle
    let r = this.r;

    let w = range.w / 2;
    let h = range.h / 2;

    let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersection
    if (xDist > (r + w) || yDist > (r + h))
      return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h)
      return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

//
//
//
class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.isDivided = false;
  }
  
  //
  //
  //
  insert(point) {
    // point doesn't fit in boundary bounds
    if(!this.boundary.contains(point)) {      
      return false;
    }
    
    // still capacity...add and return
    if(this.points.length < this.capacity) {
      this.points.push(point);      
      return true;
    }
    
    // no capacity...check if we can subdivide
    if(!this.isDivided) {      
      this.subdivide();      
    }
    
    // now try to insert point into a quadrant        
    if(this.topLeft.insert(point)) return true;    
    if(this.topRight.insert(point)) return true;    
    if(this.bottomLeft.insert(point)) return true;    
    if(this.bottomRight.insert(point)) return true;
    
    return false;
  }
  
  //
  //
  //
  subdivide() {
    this.isDivided = true;
    
    //console.log('\nSUBDIVIDE\n');
    const w = this.boundary.w;
    const h = this.boundary.h;
    const halfWidth = w / 2;
    const halfHeight = h / 2;
    const x = this.boundary.x;
    const y = this.boundary.y;
            
    const tl = new Rectangle(x - halfWidth, y - halfHeight, halfWidth, halfHeight);
    this.topLeft = new QuadTree(tl, this.capacity);
    
    const tr = new Rectangle(x + halfWidth, y - halfHeight, halfWidth, halfHeight);
    this.topRight = new QuadTree(tr, this.capacity);
    
    const bl = new Rectangle(x - halfWidth, y + halfHeight, halfWidth, halfHeight);
    this.bottomLeft = new QuadTree(bl, this.capacity);
    
    const br = new Rectangle(x + halfWidth, y + halfHeight, halfWidth, halfHeight);
    this.bottomRight = new QuadTree(br, this.capacity);
  }
  
  //
  //
  //
  query(range, found = []) {        
    // does quadtree and range overlap?            
    if(!this.boundary.intersects(range)) return found;      
        
    // add all the points
    for(let p of this.points) {
      if(range.contains(p)) {
        found.push(p);
      }
    }
    
    // not divided, return the points
    if(!this.isDivided) return found;
    
    // we're divided, query each quadrant
    this.topLeft.query(range, found);
    this.topRight.query(range, found);
    this.bottomLeft.query(range, found);
    this.bottomRight.query(range, found);
        
    // return the points
    return found;
  }
  
  
  
  
  
  
  //
  //
  //
  show(showPoints = true) {           
    this.showQuadrants();
    
    this.showPoints(showPoints);
       
    // not divided? then we're done
    if(!this.isDivided) return;
      
    // draw are divided quadrants
    this.topLeft.show(showPoints);
    this.topRight.show(showPoints);
    this.bottomLeft.show(showPoints);
    this.bottomRight.show(showPoints);
  }
  
  showPoints(showPoints = true) {    
    if(showPoints) {
      stroke(255, 0, 0);
      fill(255, 0, 0);
      strokeWeight(2);
      for(let i = 0; i < this.points.length; i++) {
        point(this.points[i].x, this.points[i].y);
      }
    }
  }
  
  showQuadrants() {
    stroke(255);
    strokeWeight(1);
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h * 2);
  }
}