class Player {
  static BAR_X = 270;
  static MAX_WIDTH = 50;
  static SIZE = 25;

  constructor() {
    this.health = 20;
    this.maxHealth = 20;
    this.lastHurt = Date.now();
  }

  addHealth(amount) {
    const now = Date.now();
    if (now - this.lastHurt > 1000) {
      this.health = Math.min(this.health + amount, this.maxHealth);
      sounds.heal.play();
      this.lastHurt = now;
    }
  }

  subtractHealth(amount) {
    const now = Date.now();
    if (now - this.lastHurt > 1000) {
      this.health = Math.max(this.health - amount, 0);
      sounds.hurt.play();
      this.lastHurt = now;
    }
  }

  render() {
    ctx.fillStyle = 'white';
    ctx.font = Player.SIZE + 'px Mars Needs Cunnilingus';
    ctx.fillText('GREEN  LV 1', 20 , 370);

    ctx.fillStyle = 'red';
    ctx.fillRect(Player.BAR_X, 372, 40 , 20);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(Player.BAR_X, 372, 40 * (this.health / this.maxHealth), 20);

    ctx.fillStyle = 'white';
    ctx.fillText(this.health + ' / ' + this.maxHealth, 320, 370);
  }
}
