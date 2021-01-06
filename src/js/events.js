const Action = {
  CONFIRM: 0,
  CANCEL: 1,
  LEFT: 2,
  RIGHT: 3,
  UP: 4,
  DOWN: 5
};

let leftHold = false;
let rightHold = false;
let upHold = false;
let downHold = false;

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
        leftHold = true;
        currentFrame.action(Action.LEFT);
        break;

      case 'ArrowRight':
        rightHold = true;
        currentFrame.action(Action.RIGHT);
        break;

      case 'ArrowUp':
        upHold = true;
        currentFrame.action(Action.UP);
        break;

      case 'ArrowDown':
        downHold = true;
        currentFrame.action(Action.DOWN);
        break;
    }
  };

  document.onkeyup = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        leftHold = false;
        break;

      case 'ArrowRight':
        rightHold = false;
        break;

      case 'ArrowUp':
        upHold = false;
        break;

      case 'ArrowDown':
        downHold = false;
        break;
    }
  }
};
