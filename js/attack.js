class Attack {
  static BAR_WIDTH = 200;
  static MAX_BAR = 200;

  constructor(equation, done) {
    this.equation = equation;
    this.done = done;

    this.attack = 'MISS';
    this.frames = -1;
    this.jump = 0;
    this.tick = 0;
    this.y = 0;
    this.state = true;
    this.bar = Attack.MAX_BAR;
  }

  run() {
    state = 'ATTACK';
    sounds.cast.play();
    this.frames = 0;
    this.attack = answerCorrect ? random(7) + 33 : 'MISS';
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
          if (answerCorrect) {
            if (step === 'FACTOR') {
              if (leftFactored) {
                this.factorA();
              } else if (rightFactored) {
                this.factorC();
              } else {
                const factor1 = this.equation.correctFactors[0];
                const factor2 = this.equation.correctFactors[1];

                this.equation.a = '(' + this.equation.a + formatPlus(factor1) + 'x)';
                this.equation.b = '';
                this.equation.c = '(' + factor2 + 'x' + this.equation.c + ')';
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
      } else if (this.tick <= 33 && answerCorrect) {
        this.bar--;
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
      ctx.font = '30px Hachicro';
      if (answerCorrect) {
        ctx.fillStyle = '#ff1800';
      } else {
        ctx.fillStyle = 'white';
      }
      ctx.fillText(this.attack, (WIDTH / 2) - 30, 30 - this.y);

      if (answerCorrect) {
        ctx.strokeStyle = 'black';
        ctx.strokeWidth = 0.5;
        ctx.strokeRect(centerWidth(Attack.BAR_WIDTH + 2), 79, Attack.BAR_WIDTH + 2, 12);

        ctx.fillStyle = '#3f403f';
        ctx.fillRect(centerWidth(Attack.BAR_WIDTH), 80, Attack.BAR_WIDTH, 10);

        ctx.fillStyle = '#00d700';
        ctx.fillRect(centerWidth(Attack.BAR_WIDTH), 80, Attack.BAR_WIDTH * (this.bar / Attack.MAX_BAR), 10);
      }
    }
  }
}
