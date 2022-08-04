class Particle {
  constructor(x, y, r = 8) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.highlight = false;
    
    this.xdir = Math.random() * 3 - 1;
    this.ydir = Math.random() * 3 - 1;
  }
  
  intersects(other) { 
    let d = dist(this.x, this.y, other.x, other.y);
    return d < (this.r + other.r);
  }
  
  setHighlight(value) {
    this.highlight = value;
  }
  
  move() {
    this.x += Math.random() * 2 * this.xdir;
    if(this.x > width) {
      this.x = width;
      this.xdir *= -1;
    }
    if(this.x < 0) {
      this.x = 0;
      this.xdir *= -1;
    }
    
    this.y += Math.random() * 2 * this.ydir;
    if(this.y > height) {
      this.y = height;
      this.ydir *= -1;
    }
    if(this.y < 0) {
      this.y = 0;
      this.ydir *= -1;
    }
    
    let rn = Math.floor(Math.random() * 55);
    if(rn === 3) {
      this.xdir *= -1;      
    } else if(rn === 1) {
      this.ydir *= -1;
    }
  }
  
  render() {
    noStroke();
    
    if(this.highlight) {
      fill(255);
    } else {
      fill(100);
    }    
    
    circle(this.x, this.y, this.r * 2);
  }
}