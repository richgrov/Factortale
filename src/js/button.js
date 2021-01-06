class Button {
  static Y = 400;
  static HEART_Y = Button.Y + 14;
  static selected = 0;

  constructor(x, id, texture, selTexture) {
    this.x = x;
    this.id = id;
    this.texture = texture;
    this.selTexture = selTexture;
  }

  render(choose) {
    if (Button.selected === this.id) {
      ctx.drawImage(this.selTexture, this.x, Button.Y);

      if (choose) {
        ctx.drawImage(textures.heart, this.x + 8, Button.HEART_Y);
      }
    } else {
      ctx.drawImage(this.texture, this.x, Button.Y);
    }
  }
}
