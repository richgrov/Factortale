const end = () => {
  let alpha = 0;

  currentFrame = {
    action: (action) => {
      if (action === Action.CONFIRM) {
        ready();
      }
    },
    tick: () => {
      alpha += 0.07;
    },
    render: () => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = '30px Determination Mono';

      ctx.fillText('Well done!', WIDTH / 2, 100);
      ctx.fillText('Press enter to restart...', WIDTH / 2, 300);
    }
  };
};
