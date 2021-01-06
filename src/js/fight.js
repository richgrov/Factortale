class BattleState {
  constructor(id, callback) {
    this.callback = callback;
  }
}

const ready = () => {
  let answerCorrect = false;

  const box = new Box('* Expression blocks the way!');
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
  BattleState.ATTACK = new BattleState(3, () => {
    currentMenu.end = true;

    if (answerCorrect) {
      attack.run(Math.floor(Math.random() * (textures.damage.length - 1)) + 1);
    } else {
      attack.run(0);
    }
  });

  // When the player can move around the arena
  BattleState.BATTLE = new BattleState(4);

  let state = BattleState.CHOOSE;

  BattleState.get = () => {
    return state;
  };

  ButtonManager.makeButton(20, textures.button.solve, textures.button.solveSel, () => {
    currentMenu = solveMenu;
  });

  ButtonManager.makeButton(183, textures.button.help, textures.button.helpSel, () => {

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

    answerCorrect = firstFactor + secondFactor === parseInt(equation.b);

    factorMenuItems.push({
      name: factor + ' & ' + secondFactor,
      callback: () => {
        state = BattleState.ATTACK;
        state.callback();
      }
    });
  });

  const findFactorMenu = new Menu(factorMenuItems, () => currentMenu = solveMenu);

  const solveMenu = new Menu([
    {
      name: 'Find factors',
      callback: () => {
        currentMenu = findFactorMenu;
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

  let currentMenu = solveMenu;

  currentFrame = {
    action: (action) => {
      switch (action) {
        case Action.CONFIRM:
          switch (state) {
            case BattleState.CHOOSE:
              ButtonManager.confirm();
              state = BattleState.MENU;
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
