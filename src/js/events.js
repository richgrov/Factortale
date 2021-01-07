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
        if (!leftHold) {
          currentFrame.action(Action.LEFT);
        }
        leftHold = true;
        break;

      case 'ArrowRight':
        if (!rightHold) {
          currentFrame.action(Action.RIGHT);
        }
        rightHold = true;
        break;

      case 'ArrowUp':
        if (!upHold) {
          currentFrame.action(Action.UP);
        }
        upHold = true;
        break;

      case 'ArrowDown':
        if (!downHold) {
          currentFrame.action(Action.DOWN);
        }
        downHold = true;
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
