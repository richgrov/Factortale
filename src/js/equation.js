class Equation {
  static random() {
    // Random even number from 2 - 10
    let c = (random(9) + 2) * 2;

    if (random(2) === 0) {
      c = -c;
    }

    // Get factors of c
    const factors = findFactors(c);

    // Pick a random pair of factors (excluding the first and last) and make b
    let index = random(factors.length - 2) + 1;

    const factor2 = factors[factors.length - index - 1];

    const b = factors[index] + (c < 0 ? -factor2 : factor2);

    // Formatting can't handle -1x, 0x, 1x, due to no leading number
    // Bad way of doing things, but works
    if (b > -2 && b < 2) {
      return Equation.random();
    }

    return new Equation(b, c);
  }

  constructor(b, c) {
    this.tick = 0;
    this.y = 70;

    this.shakeTick = -1;
    this.x = 0;

    this.a = 'x\u00B2';

    if (b >= 0) {
      this.b = '+' + b + 'x';
    } else {
      this.b = b + 'x';
    }

    if (c >= 0) {
      this.c = '+' + c;
    } else {
      this.c = c;
    }

    this.originalC = this.c;
    this.free = false;
  }

  shake() {
    sounds.damage.play();
    this.shakeTick = 0;
  }

  update() {
    if (this.free) return;

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

    if (this.free) {
      ctx.fillStyle = 'gray';
    }

    ctx.textAlign = 'right';
    ctx.fillText(this.a, this.center(90), this.y);

    ctx.textAlign = 'center';
    ctx.fillText(this.b, this.center(0), this.y);

    ctx.textAlign = 'left';
    ctx.fillText(this.c, this.center(-90), this.y);
  }

  center(x) {
    return ((WIDTH / 2) - (x / 2)) + this.x;
  }
}
