class Box {
  static INCREMENT = 30;

  static TEXT_X = 40;
  static TEXT_Y = 250;

  constructor() {
    this.textRender = [];
    this.textGoal = [''];

    this.done = true;

    this.renderWidth = 600;
    this.goalWidth = 600;
  }

  setText(text) {
    this.textGoal = ('* ' + text).split('\n');
    this.textRender = Array(this.textGoal.length).fill('');
  }

  complete() {
    this.textGoal.forEach((text, i) => {
      this.textRender[i] = this.textGoal[i];
    });
  }

  grow(callback) {
    this.goalWidth = 600;
    this.callback = callback;
    this.done = false;
  }

  shrink(callback) {
    this.goalWidth = 120;
    this.textGoal = '';
    this.callback = callback;
    this.done = false;
  }

  update() {
    if (this.renderWidth < this.goalWidth) {
      if (this.renderWidth + Box.INCREMENT > this.goalWidth) {
        this.renderWidth = this.goalWidth;
      } else {
        this.renderWidth += Box.INCREMENT;
      }
    } else if (this.renderWidth > this.goalWidth) {
      if (this.renderWidth - Box.INCREMENT < this.goalWidth) {
        this.renderWidth = this.goalWidth;
      } else {
        this.renderWidth -= Box.INCREMENT;
      }
    }

    // Typewriter
    if (state === 'INFO' || state === 'CHOOSE') {
      for (let i = 0; i < this.textGoal.length; i++) {
        const text = this.textGoal[i];
        if (text.length - this.textRender[i].length > 0) {
          sounds.type.menu.cloneNode(true).play();
          this.textRender[i] += text[this.textRender[i].length];
          break;
        }
      }
    } else {
      this.textRender = Array(this.textGoal.length).fill('');
    }

    if (!this.done) {
      this.done = true;
      this.callback();
    }
  }

  render() {
    if (state === 'INFO' || state === 'CHOOSE') {
      ctx.textAlign = 'left';
      ctx.font = '30px Determination Mono';

      this.textRender.forEach((text, i) => {
        ctx.fillText(text, Box.TEXT_X, Box.TEXT_Y + (i * 35));
      });
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect((WIDTH - this.renderWidth) / 2, 240, this.renderWidth, 120);
  }
}
