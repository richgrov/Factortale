class ButtonManager {
  static Y = 400;
  static HEART_Y = ButtonManager.Y + 14;

  selected = 0;
  buttons = [];

  confirm() {
    this.buttons.forEach((button) => {
      if (button.id === this.selected) {
        button.onClick();
      }
    });
  };

  render(choose) {
    this.buttons.forEach((button) => {
      if (this.selected === button.id && (state === 'CHOOSE' || state === 'MENU')) {
        ctx.drawImage(button.selectedTexture, button.x, ButtonManager.Y);

        if (choose) {
          ctx.drawImage(textures.heart, button.x + 8, ButtonManager.HEART_Y);
        }
      } else {
        ctx.drawImage(button.texture, button.x, ButtonManager.Y);
      }
    });
  }

  makeButton(x, texture, selectedTexture, onClick) {
    this.buttons.push({
      x: x,
      id: this.buttons.length,
      texture: texture,
      selectedTexture: selectedTexture,
      onClick: onClick
    });
  }
}
