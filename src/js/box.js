class Box {
  static INCREMENT = 30;

  static TEXT_X = 40;
  static TEXT_Y = 250;

  constructor(initialText) {
    this.textGoal = initialText;
    this.textRender = '';

    this.done = true;

    this.renderWidth = 600;
    this.goalWidth = 600;
  }

  static setText(text) {
    this.textGoal = text;
  }

  resize(value, callback) {
    this.callback = callback;

    this.goalWidth = value;
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
    if (BattleState.get() === BattleState.INFO || BattleState.get() === BattleState.CHOOSE) {
      if (this.textGoal.length - this.textRender.length > 0) {
        sounds.type.menu.cloneNode(true).play();
        this.textRender += this.textGoal[this.textRender.length];
      }
    } else {
      this.textRender = '';
    }

    if (!this.done) {
      this.done = true;
      this.callback();
    }
  }

  render() {
    if (BattleState.get() === BattleState.INFO || BattleState.get() === BattleState.CHOOSE) {
      ctx.textAlign = 'left';
      ctx.font = '30px Determination Mono';
      ctx.fillText(this.textRender, Box.TEXT_X, Box.TEXT_Y);
    }

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect((WIDTH - this.renderWidth) / 2, 240, this.renderWidth, 120);
  }
}
