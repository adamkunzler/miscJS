// Daniel Shiffman
// http://youtube.com/thecodingtrain
// https://thecodingtrain.com/CodingChallenges/111-animated-sprite.html

// Horse Spritesheet from
// https://opengameart.org/content/2d-platformer-art-assets-from-horse-of-spring

// Animated Sprite
// https://youtu.be/3noMeuufLZY

class Sprite {
  constructor(animation, speed) {    
    this.animation = animation;
    this.w = this.animation[0].width;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
  }

  show(x, y, dx, dy) {
    let index = floor(this.index) % this.len;
    image(this.animation[index], x, y, dx, dy);
  }

  animate() {
    this.index += this.speed;
//     this.x += this.speed * 15;

//     if (this.x > width) {
//       this.x = -this.w;
//     }
  }
}