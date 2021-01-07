class Entity {
  constructor(x, y, dirX, dirY, collisionDistance, callback) {
    this.x = x;
    this.y = y;
    this.dirX = dirX;
    this.dirY = dirY;
    this.collisionDistance = collisionDistance;
    this.callback = callback;
  }

  update() {
    this.x += this.dirX;
    this.y += this.dirY;

    const a = this.x - Arena.playerX;
    const b = this.y - Arena.playerY;

    if (Math.sqrt((a * a) + (b * b)) <= this.collisionDistance) {
      this.callback();
    }
  }
}

class BouncingEntity extends Entity {
  constructor(x, y, dirX, dirY, collisionDistance, callback) {
    super(x, y, dirX, dirY, collisionDistance, callback);
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
    super(20, -30, 2, 2, 16, () => {
      if (!this.touched) {
        player.addHealth(5);
        this.touched = true;
      }
    });

    this.touched = false;
  }

  update() {
    super.update();
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
    super(20, -30, random(2) + 1, random(2) + 1, 16, () => player.subtractHealth(2));
  }

  update() {
    super.update();
  }

  render() {
    const texture = textures.arena.i;
    ctx.drawImage(texture, this.x - (texture.width / 2) + 320, this.y - (texture.height / 2) + 300);
  }
}

class Particle extends Entity {
  constructor(x, y, dirX, dirY) {
    super(x, y, dirX, dirY, 16, () => player.subtractHealth(3));

    this.lifetime = 0;
  }

  update() {
    if (this.lifetime <= 100) {
      super.update();
      this.lifetime++;
    }
  }

  render() {
    if (this.lifetime < 100) {
      const texture = textures.arena.particle;
      ctx.drawImage(texture, this.x - (texture.width / 2) + 320, this.y - (texture.height / 2) + 300);
    }
  }
}

class Wall extends Entity {
  constructor(x, y) {
    super(x, y, 0, 2, 16, () => player.subtractHealth(4));

    this.lifetime = 0;
  }

  update() {
    if (this.lifetime <= 80) {
      super.update();
      this.lifetime++;
    }
  }

  render() {
    if (this.lifetime < 80) {
      const texture = textures.arena.wall;
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
    this.timeLeft = 300;

    if (answerCorrect) {
      this.entities.push(new Popper());
    }

    switch (random(3)) {
      case 0:
        this.attack = 0;
        break;

      case 1:
        this.attack = 1;
        break;

      case 2:
        this.timeLeft = 500;
        this.attack = 2;
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
      } else if (this.attack === 2) {
        if (this.timeLeft % 45 === 0) {
          const gap = random(5);

          for (let i = 0; i < 5; i++) {
            if (i !== gap) {
              this.entities.push(new Wall((i * 25) - 50, -100));
            }
          }
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
    if (player.hurtTicks > 0 && player.hurtTicks % 5 <= 1) {
      ctx.globalAlpha = 0.7;
    }

    const heart = textures.heart;
    ctx.drawImage(heart, Arena.playerX - (heart.width / 2) + 320, Arena.playerY - (heart.width / 2) + 300);

    ctx.globalAlpha = 1;

    this.entities.forEach(entity => entity.render());
  }
}
