class Box {
  static INCREMENT = 30;

  constructor() {
    this.done = true;

    this.renderWidth = 600;
    this.goalWidth = 600;
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

    if (!this.done) {
      this.done = true;
      this.callback();
    }
  }

  render() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect((WIDTH - this.renderWidth) / 2, 240, this.renderWidth, 120);
  }
}
