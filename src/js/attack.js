class Attack {
  constructor(equation, done) {
    this.equation = equation;
    this.done = done;

    this.attack = 0;
    this.frames = -1;
    this.jump = 0;
    this.tick = 0;
    this.y = 0;
    this.state = true;
  }

  run(attack) {
    this.frames = 0;
    this.attack = attack;
  }

  update() {
    if (this.state) {
      if (this.frames > -1) {
        if (this.frames <= 5) {
          this.frames += 0.25;
        } else {
          if (this.attack !== 0) {
            this.equation.shake();
          }

          this.state = false;
          this.frames = -1;
        }
      }
    } else {
      this.tick++;
      if (this.jump <= 4) {
        this.jump += 0.2;
      }
      this.y = Math.sin(this.jump) * 15;

      if (this.tick >= 50) {
        this.done();

        this.state = true;
        this.tick = 0;
        this.jump = 0;
        this.y = 0;
      }
    }
  }

  render() {
    if (this.state) {
      if (this.frames !== -1) {
        const frame = textures.attack[Math.floor(this.frames)];
        if (this.frames >= 4) {
          // Draw the last few frames from the bottom of the image
          ctx.drawImage(frame, WIDTH / 2, 140 - frame.height);
        } else {
          ctx.drawImage(frame, WIDTH / 2, 70);
        }
      }
    } else {
      const img = textures.damage[this.attack];
      ctx.drawImage(img, (WIDTH / 2) - (img.width / 2), 70 - this.y);
    }
  }
}
