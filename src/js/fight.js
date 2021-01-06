class BattleState {
  constructor(id, callback) {
    this.callback = callback;
  }
}

const ready = () => {
  let step = 'FIND_FACTORS';

  const box = new Box();
  box.setText('Expression blocks the way!');

  const equation = new Equation(6, -16);
  const arena = new Arena(() => {
    findFactorMenu.end = false;

    box.grow(() => {
      state = BattleState.CHOOSE;
    });
  });

  const attack = new Attack(equation, () => {
    state = BattleState.BATTLE;
    box.shrink(() => {
      arena.sendAttack(true);
    });
  });

  // When text is shown to the user
  BattleState.INFO = new BattleState(0);

  // When only one page of text is shown to the user, who can use the bottom buttons
  BattleState.CHOOSE = new BattleState(1);

  // When the user has chosen a button and is in the menu
  BattleState.MENU = new BattleState(2);

  // When the attack and damage animation is being played
  BattleState.ATTACK = new BattleState(3);

  // When the player can move around the arena
  BattleState.BATTLE = new BattleState(4);

  let state = BattleState.CHOOSE;

  BattleState.get = () => {
    return state;
  };

  ButtonManager.makeButton(20, textures.button.solve, textures.button.solveSel, () => {
    state = BattleState.MENU;
    currentMenu = new Menu([
      {
        name: 'Find factors',
        callback: () => {
          if (step === 'FIND_FACTORS') {
            currentMenu = findFactorMenu;
          } else {
            state = BattleState.ATTACK;
            currentMenu.end = true;
            attack.run(0);
          }
        }
      },
      {
        name: 'Factor',
        callback: () => {}
      },
      {
        name: 'Final groups',
        callback: () => {}
      }
    ]);
  });

  ButtonManager.makeButton(183, textures.button.help, textures.button.helpSel, () => {
    switch (step) {
      case 'FIND_FACTORS':
        box.setText('Find the factors of ' + equation.c + ' which add\nup to equal ' + equation.b);
        break;

      case 'FACTOR':
        box.setText('Factor out the items in the left and\nright parenthesis.')
        break;
    }
  });

  ButtonManager.makeButton(346, textures.button.item, textures.button.itemSel, () => {

  });

  ButtonManager.makeButton(510, textures.button.done, textures.button.doneSel, () => {

  });

  const factors = [];
  for (let i = 0; i <= Math.abs(equation.c); i++) {
    if (equation.c % i === 0) {
      factors.push(i);
    }
  }

  const factorMenuItems = [];
  factors.forEach((factor, i) => {
    let firstFactor = parseInt(factor);
    let secondFactor = factors[factors.length - i - 1];

    if (equation.c < 0) {
      secondFactor = '-' + secondFactor;
    }

    secondFactor = parseInt(secondFactor);

    let attackCallback;
    if (firstFactor + secondFactor === parseInt(equation.b)) {
      attackCallback = () => {
        attack.run(Math.floor(Math.random() * (textures.damage.length - 1)) + 1);
        step = 'FACTOR';
      };
    } else {
      attackCallback = () => {
        attack.run(0);
      };
    }

    factorMenuItems.push({
      name: factor + ' & ' + secondFactor,
      callback: () => {
        state = BattleState.ATTACK;
        currentMenu.end = true;
        attackCallback();
      }
    });
  });

  const findFactorMenu = new Menu(factorMenuItems, () => currentMenu = solveMenu);

  let currentMenu;

  currentFrame = {
    action: (action) => {
      switch (action) {
        case Action.CONFIRM:
          switch (state) {
            case BattleState.CHOOSE:
              ButtonManager.confirm();
              break;

            case BattleState.MENU:
              currentMenu.confirm();
              break;
          }
          break;

        case Action.CANCEL:
          if (state === BattleState.MENU) {
            if (currentMenu.cancel() === false) {
              state = BattleState.CHOOSE;
            }
          }
          break;

        case Action.LEFT:
          switch (state) {
            case BattleState.CHOOSE:
              if (ButtonManager.selected === 0) {
                ButtonManager.selected = 3;
              } else {
                ButtonManager.selected--;
              }
              break;

            case BattleState.MENU:
              currentMenu.left();
              break;
          }
          break;

        case Action.RIGHT:
          switch (state) {
            case BattleState.CHOOSE:
              if (ButtonManager.selected === 3) {
                ButtonManager.selected = 0;
              } else {
                ButtonManager.selected++;
              }
              break;

            case BattleState.MENU:
              currentMenu.right();
              break;
          }
          break;

        case Action.UP:
          switch (state) {
            case BattleState.MENU:
              currentMenu.up();
              break;
          }
          break;

        case Action.DOWN:
          switch (state) {
            case BattleState.MENU:
              currentMenu.down();
              break;
          }
          break;
      }
    },
    tick: () => {
      switch (state) {
        case BattleState.BATTLE:
          arena.update();
          break;
      }

      box.update();
      attack.update();
      equation.update();
    },
    render: () => {
      ButtonManager.render(state === BattleState.CHOOSE);

      ctx.fillStyle = 'white';
      ctx.textBaseline = 'top';

      box.render();
      equation.render();
      attack.render();

      switch (state) {
        case BattleState.MENU:
        case BattleState.ATTACK:
          currentMenu.render();
          break;

        case BattleState.BATTLE:
          arena.render();
          break;
      }
    },
  };
};
