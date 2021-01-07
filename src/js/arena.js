class Popper {
  constructor() {
    this.dirX = 2;
    this.dirY = 2;

    this.x = 20;
    this.y = -30;

    this.touched = false;
  }

  update() {
    if (this.x < -Arena.LIMIT || this.x > Arena.LIMIT) {
      this.dirX = -this.dirX;
    }

    if (this.y < -Arena.LIMIT || this.y > Arena.LIMIT) {
      this.dirY = -this.dirY;
    }

    this.x += this.dirX;
    this.y += this.dirY;

    const a = this.x - Arena.playerX;
    const b = this.y - Arena.playerY;

    if (Math.sqrt((a * a) + (b * b)) <= 16 && !this.touched) {
      this.touched = true;
      player.addHealth(5);
    }
  }

  render() {
    if (!this.touched) {
      const texture = textures.arena.popper;
      ctx.drawImage(texture, this.x - (texture.width / 2) + 320, this.y - (texture.height / 2) + 300);
    }
  }
}

class Arena {
  static SPEED = 3;
  static LIMIT = 50;

  static playerX = 0;
  static playerY = 0;

  constructor(callback) {
    this.callback = callback;

    this.entities = [];
    this.timeLeft = -1;
  }

  sendAttack(isPositive) {

    if (isPositive) {
      this.timeLeft = 150;
      this.entities.push(new Popper());
    } else {
    }
  }

  update() {
    if (leftHold) {
      if (Arena.playerX > -Arena.LIMIT) {
        Arena.playerX -= Arena.SPEED;
      }
    } else if (rightHold) {
      if (Arena.playerX < Arena.LIMIT) {
        Arena.playerX += Arena.SPEED;
      }
    }

    if (upHold) {
      if (Arena.playerY > -Arena.LIMIT) {
        Arena.playerY -= Arena.SPEED;
      }
    } else if (downHold) {
      if (Arena.playerY < Arena.LIMIT) {
        Arena.playerY += Arena.SPEED;
      }
    }

    if (this.timeLeft > -1) {
      this.timeLeft--;

      if (this.timeLeft === -1) {
        Arena.playerX = 0;
        Arena.playerY = 0;
        this.entities = [];

        this.callback();
      }
    }

    this.entities.forEach(entity => entity.update());
  }

  render() {
    const heart = textures.heart;
    ctx.drawImage(heart, Arena.playerX - (heart.width / 2) + 320, Arena.playerY - (heart.width / 2) + 300)

    this.entities.forEach(entity => entity.render());
  }
}
