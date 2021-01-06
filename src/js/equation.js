class Equation {
  constructor(b, c) {
    this.tick = 0;
    this.y = 70;

    this.shakeTick = -1;
    this.x = 0;

    if (b >= 0) {
      this.b = '+' + b;
    } else {
      this.b = b;
    }

    if (c >= 0) {
      this.c = '+' + c;
    } else {
      this.c = c;
    }
  }

  shake() {
    this.shakeTick = 0;
  }

  update() {
    this.tick += 0.1;
    this.y = 100 + (Math.sin(this.tick) * 2);

    if (this.shakeTick > -1 && this.shakeTick < 50) {
      this.shakeTick += 3;
      this.x = Math.sin(this.shakeTick) * 10;
    } else {
      this.shakeTick = -1;
    }
  }

  render() {
    ctx.font = '40px Papyrus';

    ctx.textAlign = 'right';
    ctx.fillText('x\u00B2', this.center(50), this.y);

    ctx.textAlign = 'center';
    ctx.fillText(this.b, this.center(0), this.y);

    ctx.textAlign = 'left';
    ctx.fillText(this.c, this.center(-50), this.y);
  }

  center(x) {
    return ((WIDTH / 2) - (x / 2)) + this.x;
  }
}
