const ready = () => {
  const textX = 40;
  const textY = 250;
  let textGoal = '';
  let textRender = '';

  let boxWidth = 600;

  class BattleState {
    constructor(id, callback) {
      this.callback = callback;
    }
  }

  BattleState.INFO = new BattleState(0, () => {
    // type text
  });

  BattleState.CHOOSE = new BattleState(1, () => {
    textGoal = '* Expression blocks the way!';
  });

  BattleState.MENU = new BattleState(2, () => {
    // menu items
  });

  let state = BattleState.CHOOSE;
  state.callback();

  const buttons = [
    new Button(20, 0, textures.button.solve, textures.button.solveSel),
    new Button(183, 1, textures.button.help, textures.button.helpSel),
    new Button(346, 2, textures.button.item, textures.button.itemSel),
    new Button(510, 3, textures.button.done, textures.button.doneSel)
  ];

  const equation = new Equation(6, -16);

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

    factorMenuItems.push({
      name: factor + ' & ' + secondFactor,
      callback: () => {
        if (firstFactor + secondFactor === parseInt(equation.b)) {
          console.log('Correct answer');
        } else {
          console.log('Incorrect answer');
        }
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
              state = BattleState.MENU;
              textGoal = '';
              textRender = '';

              state.callback();
              break;

            case BattleState.MENU:
              currentMenu.confirm();
              break;
          }
          break;

        case Action.CANCEL:
          textRender = textGoal;

          if (state === BattleState.MENU) {
            if (currentMenu.cancel() === false) {
              state = BattleState.CHOOSE;
              state.callback();
            }
          }
          break;

        case Action.LEFT:
          switch (state) {
            case BattleState.CHOOSE:
              if (Button.selected === 0) {
                Button.selected = 3;
              } else {
                Button.selected--;
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
              if (Button.selected === 3) {
                Button.selected = 0;
              } else {
                Button.selected++;
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
      // Typewriter
      if (state === BattleState.INFO || state === BattleState.CHOOSE) {
        // Check to see if there are letters left
        if (textGoal.length - textRender.length > 0) {
            textRender += textGoal[textRender.length];
        }
      }

      equation.update();
    },
    render: () => {
      // Draw all buttons
      buttons.forEach(button => button.render(state === BattleState.CHOOSE));

      // Draw dialogue box
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeRect((WIDTH - boxWidth) / 2, 240, boxWidth, 120);

      ctx.fillStyle = 'white';
      ctx.textBaseline = 'top';

      equation.draw();

      switch (state) {
        case BattleState.CHOOSE:
          // Draw typewriter
          ctx.textAlign = 'left';
          ctx.font = '30px Determination Mono';
          ctx.fillText(textRender, textX, textY);
          break;

        case BattleState.MENU:
          currentMenu.render();
          break;
      }
    },
  };
};
