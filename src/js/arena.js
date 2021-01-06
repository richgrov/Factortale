class Arena {
  static SPEED = 5;
  static LIMIT = 100;

  constructor() {
    this.playerX = 0;
    this.playerY = 0;
  }

  sendAttack(isPositive) {
    if (isPositive) {

    } else {
      
    }
  }

  update() {
    if (leftHold) {
      if (this.playerX > -Arena.LIMIT) {
        this.playerX -= Arena.SPEED;
      }
    } else if (rightHold) {
      if (this.playerX < Arena.LIMIT) {
        this.playerX += Arena.SPEED;
      }
    }

    if (upHold) {
      if (this.playerY > -Arena.LIMIT) {
        this.playerY -= Arena.SPEED;
      }
    } else if (downHold) {
      if (this.playerY < Arena.LIMIT) {
        this.playerY += Arena.SPEED;
      }
    }
  }

  render() {
    const heart = textures.heart;
    ctx.drawImage(heart, (this.playerX / 2) - (heart.width / 2) + 320, (this.playerY / 2) - (heart.width / 2) + 300);
  }
}
