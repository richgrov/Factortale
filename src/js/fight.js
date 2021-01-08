let state;
let nextState;

let answerCorrect = false;
let step = 'FIND_FACTORS';
let leftFactored = false;
let rightFactored = false;
let answer;

const player = new Player();

const ready = () => {
  state = 'CHOOSE';

  const box = new Box();
  box.setText('Expression blocks the way!');

  const equation = Equation.random();
  const arena = new Arena(() => {
    solveMenu.selection = 0;
    findFactorMenu.selection = 0;
    factorChooseMenu.selection = 0;

    box.grow(() => {
      if (step === 'FACTOR') {
        if (leftFactored) {
          box.setText('X was factored out of the left\ngroup.')
        } else if (rightFactored) {
          box.setText(equation.correctFactors[1] + ' was factored out of the right\ngroup.')
        } else {
          box.setText(
            'Factor 1 (' + equation.correctFactors[0] + ') was grouped with A.' +
            '\n* Factor 2 (' + equation.correctFactors[1] + ') was grouped with B.'
          );
        }
      } else if (step === 'FINAL') {
        box.setText('Both groups have been factored.');
      } else if (step === 'DONE') {
        box.setText('New groups are formed.');
      } else {
        box.setText('Expression remains the same.');
      }
      state = 'CHOOSE';
    });
  });

  const attack = new Attack(equation, () => {
    state = 'BATTLE';
    box.shrink(() => {
      arena.sendAttack();
    });
  });

  ButtonManager.makeButton(20, textures.button.solve, textures.button.solveSel, () => {
    state = 'MENU';
    currentMenu = solveMenu;
  });

  const leftFactorMenu = () => {
    const array = shuffle([
      {
        name: 'Factor out x',
        callback: () => {
          leftFactored = true;

          if (rightFactored) {
            step = 'FINAL';
          }

          answerCorrect = true;
          attack.run();
        }
      },
      {
        name: 'Factor out ' + equation.correctFactors[0],
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: 'Factor out x\u00B2',
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: 'Factor out ' + -equation.correctFactors[0],
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    ]);

    return new Menu(array, () => currentMenu = factorChooseMenu);
  };

  const rightFactorMenu = () => {
    const array = shuffle([
      {
        name: 'Factor out ' + equation.correctFactors[1],
        callback: () => {
          rightFactored = true;

          if (leftFactored) {
            step = 'FINAL';
          }

          answerCorrect = true;
          attack.run();
        }
      },
      {
        name: 'Factor out x',
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: 'Factor out ' + -equation.correctFactors[1],
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: 'Factor out ' + equation.originalC,
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    ]);

    return new Menu(array, () => currentMenu = factorChooseMenu);
  };

  const factorChooseMenu = new Menu([
    {
      name: 'Left',
      callback: () => {
        if (leftFactored) {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        } else {
          currentMenu = leftFactorMenu();
        }
      }
    },
    {
      name: 'Right',
      callback: () => {
        if (rightFactored) {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        } else {
          currentMenu = rightFactorMenu();
        }
      }
    }
  ], () => currentMenu = solveMenu);

  const finalGroupsMenu = () => {
    let firstFactor = equation.correctFactors[0];
    let secondFactor = equation.correctFactors[1];

    firstFactor = firstFactor > 0 ? '+' + firstFactor : firstFactor;
    secondFactor = secondFactor > 0 ? '+' + secondFactor : secondFactor;

    answer = '(x' + secondFactor + ')(x' + firstFactor + ')';

    const array = shuffle([
      {
        name: answer,
        callback: () => {
          step = 'DONE';
          answerCorrect = true;
          attack.run();
        }
      },
      {
        name: '(x' + -secondFactor + ')(x' + firstFactor + ')',
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: '(x' + secondFactor + ')(x' + -firstFactor + ')',
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      },
      {
        name: '(x' + -secondFactor + ')(x' + -firstFactor + ')',
        callback: () => {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    ]);

    return new Menu(array, () => currentMenu = solveMenu);
  }

  const solveMenu = new Menu([
    {
      name: 'Find factors',
      callback: () => {
        if (step === 'FIND_FACTORS') {
          currentMenu = findFactorMenu;
        } else {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    },
    {
      name: 'Factor',
      callback: () => {
        if (step === 'FACTOR') {
          currentMenu = factorChooseMenu;
        } else {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    },
    {
      name: 'Final groups',
      callback: () => {
        if (step === 'FINAL') {
          currentMenu = finalGroupsMenu();
        } else {
          state = 'ATTACK';
          answerCorrect = false;
          attack.run();
        }
      }
    }
  ]);

  ButtonManager.makeButton(183, textures.button.help, textures.button.helpSel, () => {
    switch (step) {
      case 'FIND_FACTORS':
        box.setText('Find the factors of ' + equation.c + ' which add\nup to equal ' + equation.b);
        break;

      case 'FACTOR':
        box.setText('Factor out the items in the left and\nright parenthesis.');
        break;

      case 'FINAL':
        box.setText('Put the outer terms in one group,\nand multiply them by one of the\ncurrent groups.')
        break;

      case 'DONE':
        box.setText('You are finished, select [DONE].')
        break;
    }
  });

  const items = [
    {
      name: 'Green item',
      health: 20,
      info: 'ALWAYS CHOOSE GREEN! You\'re health\nwas maxed out.'
    },
    {
      name: 'Red item',
      health: 1,
      info: 'Imagine choosing red... +1 health\nfor you.'
    },
    {
      name: 'Party popper',
      health: 4,
      info: 'Assuming you got the answer wrong,\ngreat job! Confetti for you.\n(+4 Health)'
    },
    {
      name: 'Plug-Chug',
      health: 4,
      info: 'Thanks for your contribution to the\npluggity-chuggity machine. (+4 Health)'
    },
    {
      name: 'Record Button',
      health: 4,
      info: 'You must never forget to record.\nThis shall remind you. (+4 Health)'
    },
    {
      name: '81\u2122 Cookies',
      health: 4,
      info: 'richard81cookiepacman@wood.com/M\nthanks you. (+4 Health)'
    }
  ];

  ButtonManager.makeButton(346, textures.button.item, textures.button.itemSel, () => {
    const array = [];

    items.forEach((item, i) => {
      array.push({
        name: item.name,
        callback: () => {
          items.splice(i, 1);
          player.addHealth(item.health);
          state = 'INFO';

          nextState = () => {
            state = 'BATTLE';

            box.shrink(() => {
              arena.sendAttack();
            });
          };
          box.setText(item.info);
        }
      });
    });

    currentMenu = new Menu(array);
    state = 'MENU';
  });

  ButtonManager.makeButton(510, textures.button.done, textures.button.doneSel, () => {
    if (step === 'DONE') {
      equation.free = true;
      state = 'INFO';
      sounds.music.pause();
      sounds.spare.play();
      box.setText('YOU WON!\n* You earned 0 XP and ' + random(10) + ' gold.');
    } else {
      currentMenu = new Menu([]);
      state = 'ATTACK';
      answerCorrect = false;
      attack.run();
    }
  });

  const factors = findFactors(equation.c);

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
        answerCorrect = true;
        attack.run();
        step = 'FACTOR';
      };
      equation.correctFactors = [firstFactor, secondFactor];
    } else {
      attackCallback = () => {
        answerCorrect = false;
        attack.run();
      };
    }

    factorMenuItems.push({
      name: factor + ' & ' + secondFactor,
      callback: () => {
        state = 'ATTACK';
        attackCallback();
      }
    });
  });

  const findFactorMenu = new Menu(factorMenuItems, () => currentMenu = solveMenu);

  let currentMenu;

  sounds.music.play();
  setInterval(() => {
    if (!equation.free) {
      sounds.music.pause();
      sounds.music.currentTime = 0;
      sounds.music.play();
    }
  }, 55000);

  currentFrame = {
    action: (action) => {
      switch (action) {
        case Action.CONFIRM:
          switch (state) {
            case 'CHOOSE':
              sounds.confirm.play();
              ButtonManager.confirm();
              break;

            case 'MENU':
              sounds.confirm.play();
              currentMenu.confirm();
              break;

            case 'INFO':
              nextState();
              break;
          }
          break;

        case Action.CANCEL:
          if (state === 'MENU') {
            if (currentMenu.cancel() === false) {
              state = 'CHOOSE';
            }
          }
          break;

        case Action.LEFT:
          switch (state) {
            case 'CHOOSE':
              sounds.cycle.play();
              if (ButtonManager.selected === 0) {
                ButtonManager.selected = 3;
              } else {
                ButtonManager.selected--;
              }
              break;

            case 'MENU':
              currentMenu.left();
              break;
          }
          break;

        case Action.RIGHT:
          switch (state) {
            case 'CHOOSE':
              sounds.cycle.play();
              if (ButtonManager.selected === 3) {
                ButtonManager.selected = 0;
              } else {
                ButtonManager.selected++;
              }
              break;

            case 'MENU':
              currentMenu.right();
              break;
          }
          break;

        case Action.UP:
          switch (state) {
            case 'MENU':
              currentMenu.up();
              break;
          }
          break;

        case Action.DOWN:
          switch (state) {
            case 'MENU':
              currentMenu.down();
              break;
          }
          break;
      }
    },
    tick: () => {
      switch (state) {
        case 'BATTLE':
          arena.update();
          player.update();
          break;
      }

      box.update();
      attack.update();
      equation.update();
    },
    render: () => {
      const background = textures.background;
      ctx.drawImage(background, (WIDTH / 2) - (background.width / 2), 15);

      ButtonManager.render(state === 'CHOOSE');

      player.render();

      ctx.fillStyle = 'white';
      ctx.textBaseline = 'top';

      box.render();
      equation.render();
      attack.render();

      switch (state) {
        case 'MENU':
        case 'ATTACK':
          currentMenu.render();
          break;

        case 'BATTLE':
          arena.render();
          break;
      }
    },
  };
};
