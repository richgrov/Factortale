const start = () => {
  let musicStarted = false;
  let interval;

  currentFrame = {
    action: (action) => {
      if (action === Action.CONFIRM) {
        clearInterval(interval);
        sounds.music.start.pause();
        ready();
      }
    },
    tick: () => {
      if (!musicStarted) {
        sounds.music.start.play();

        interval = setInterval(() => {
          sounds.music.start.pause();
          sounds.music.start.currentTime = 0;
          sounds.music.start.play();
        }, 32000);

        musicStarted = true;
      }
    },
    render: () => {
      ctx.font = '30px Determination Mono';

      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Press confirm to begin game', WIDTH / 2, 300);

      ctx.fillStyle = 'gray';
      ctx.textAlign = 'left';
      ctx.fillText('--- Instruction --', 150, 100);
      ctx.fillText('[Z or ENTER] - Confirm', 150, 130);
      ctx.fillText('[X or SHIFT] - Cancel', 150, 160);
      ctx.fillText('[ARROW KEYS] - Move', 150, 190);
      ctx.fillText('When HP is 0, you lose.', 150, 220);
    }
  };
};
