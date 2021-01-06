class Button {
  static Y = 400;
  static HEART_Y = Button.Y + 14;
  static selected = 0;
  static enabled = true;

  static buttons = [];

  static choose() {
    Button.buttons.forEach((button) => {
      if (button.id === Button.selected) {
        button.callback();
      }
    });
  };

  static renderAll(choose) {
    Button.buttons.forEach(button => button.render(choose));
  }

  constructor(x, texture, selTexture, callback) {
    this.x = x;
    this.id = Button.buttons.length;
    this.texture = texture;
    this.selTexture = selTexture;
    this.callback = callback;

    Button.buttons.push(this);
  }

  render(choose) {
    if (Button.selected === this.id && Button.enabled) {
      ctx.drawImage(this.selTexture, this.x, Button.Y);

      if (choose) {
        ctx.drawImage(textures.heart, this.x + 8, Button.HEART_Y);
      }
    } else {
      ctx.drawImage(this.texture, this.x, Button.Y);
    }
  }
}
