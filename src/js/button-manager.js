class ButtonManager {
  static Y = 400;
  static HEART_Y = ButtonManager.Y + 14;
  static selected = 0;

  static buttons = [];

  static confirm() {
    ButtonManager.buttons.forEach((button) => {
      if (button.id === ButtonManager.selected) {
        button.onClick();
      }
    });
  };

  static render(choose) {
    ButtonManager.buttons.forEach((button) => {
      if (ButtonManager.selected === button.id && (BattleState.get() === BattleState.CHOOSE || BattleState.get() === BattleState.MENU)) {
        ctx.drawImage(button.selectedTexture, button.x, ButtonManager.Y);

        if (choose) {
          ctx.drawImage(textures.heart, button.x + 8, ButtonManager.HEART_Y);
        }
      } else {
        ctx.drawImage(button.texture, button.x, ButtonManager.Y);
      }
    });
  }

  static makeButton(x, texture, selectedTexture, onClick) {
    ButtonManager.buttons.push({
      x: x,
      id: ButtonManager.buttons.length,
      texture: texture,
      selectedTexture: selectedTexture,
      onClick: onClick
    });
  }
}
