class MovingEntity {
  constructor(x, y, dirX, dirY) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
  }

  update() {
    this.x += this.dirX;
    this.y += this.dirY;
  }
}

class BouncingEntity extends MovingEntity {
  constructor(x, y, dirX, dirY) {
    super(x, y, dirX, dirY);
  }

  update() {
    if (this.x < -Arena.LIMIT || this.x > Arena.LIMIT) {
      this.dirX = -this.dirX;
    }

    if (this.y < -Arena.LIMIT || this.y > Arena.LIMIT) {
      this.dirY = -this.dirY;
    }

    super.update();
  }
}

class Popper extends BouncingEntity {
  constructor() {
    super(20, -30, 2, 2);

    this.touched = false;
  }

  update() {
    super.update();

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

class BouncingOrb extends BouncingEntity {
  constructor() {
    super(20, -30, random(2) + 1, random(2) + 1);
  }

  update() {
    super.update();

    const a = this.x - Arena.playerX;
    const b = this.y - Arena.playerY;

    if (Math.sqrt((a * a) + (b * b)) <= 16) {
      player.subtractHealth(2);
    }
  }

  render() {
    const texture = textures.arena.i;
    ctx.drawImage(texture, this.x - (texture.width / 2) + 320, this.y - (texture.height / 2) + 300);
  }
}

class Particle extends MovingEntity {
  constructor(x, y, dirX, dirY) {
    super(x, y, dirX, dirY);

    this.lifetime = 0;
  }

  update() {
    if (this.lifetime <= 100) {
      super.update();
      this.lifetime++;

      const a = this.x - Arena.playerX;
      const b = this.y - Arena.playerY;

      if (Math.sqrt((a * a) + (b * b)) <= 16) {
        player.subtractHealth(2);
      }
    }
  }

  render() {
    if (this.lifetime < 100) {
      const texture = textures.arena.particle;
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
    this.attack = 0;

    this.entities = [];
    this.timeLeft = -1;
  }

  sendAttack() {
    this.timeLeft = 150;

    if (answerCorrect) {
      this.entities.push(new Popper());
    }

    switch (random(2)) {
      case 0:
        this.attack = 0;
        break;

      case 1:
        this.attack = 1;
        break;
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

      if (this.attack === 0) {
        if (this.timeLeft % 8 === 0) {
          const negative = random(2) === 0 ? -1 : 1;
          this.entities.push(new Particle(150 * negative, random(100) - 50, 3 * -negative, 0));
        }
      } else if (this.attack === 1) {
        if (this.timeLeft % 30 === 0) {
          this.entities.push(new BouncingOrb());
        }
      }

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
