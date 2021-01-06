const Action = {
  CONFIRM: 0,
  CANCEL: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4,
  DOWN: 5
};

const initEvents = () => {
  document.onkeydown = (ev) => {
    switch (ev.key) {
      case 'Enter':
      case 'z':
        currentFrame.action(Action.CONFIRM);
        break;

      case 'Shift':
      case 'x':
        currentFrame.action(Action.CANCEL);
        break;

      case 'ArrowLeft':
        currentFrame.action(Action.LEFT);
        break;

      case 'ArrowRight':
        currentFrame.action(Action.RIGHT);
        break;

      case 'ArrowUp':
        currentFrame.action(Action.UP);
        break;

      case 'ArrowDown':
        currentFrame.action(Action.DOWN);
        break;
    }
  };
};
