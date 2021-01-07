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

  run() {
    sounds.cast.play();
    this.frames = 0;
    this.attack = answerCorrect ? random(textures.damage.length - 1) + 1 : 0;
  }

  factorA() {
    this.equation.a = 'x(x + ' + this.equation.correctFactors[0] + ')';
  }

  factorC() {
    const factor = this.equation.correctFactors[1];
    this.equation.c = factor + '(x + ' + (this.equation.originalC / factor) + ')';
  }

  update() {
    if (this.state) {
      if (this.frames > -1) {
        if (this.frames <= 5) {
          this.frames += 0.25;
        } else {
          if (this.attack !== 0) {
            if (step === 'FACTOR') {
              if (leftFactored) {
                this.factorA();
              } else if (rightFactored) {
                this.factorC();
              } else {
                const factor1 = this.equation.correctFactors[0];
                const factor2 = this.equation.correctFactors[1];

                this.equation.a = '(' + this.equation.a + (factor1 > 0 ? '+' + factor1 : factor1) + 'x)';
                this.equation.b = '';
                this.equation.c = '(' + (factor2 > 0 ? '+' + factor2 : factor2) + 'x' + this.equation.c + ')';
              }
            } else if (step === 'FINAL') {
              this.factorA();
              this.factorC();
            } else {
              this.equation.a = '';
              this.equation.b = answer;
              this.equation.c = '';
            }

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
