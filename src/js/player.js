class Player {
  static BAR_X = 270;
  static SIZE = 25;

  constructor() {
    this.health = 20;
    this.maxHealth = 20;
    this.hurtTicks = 0;
  }

  addHealth(amount) {
    this.health = Math.min(this.health + amount, this.maxHealth);
    sounds.heal.play();
  }

  subtractHealth(amount) {
    if (this.hurtTicks === 0) {
      this.health = Math.max(this.health - amount, 0);
      sounds.hurt.play();
      this.hurtTicks = 33;

      if (this.health === 0) {
        musicAllowed = false;
        sounds.music.main.pause();
        sounds.music.main.currentTime = 0;
        clearInterval(musicInterval);

        let ticks = 0;
        const shards = [];
        let alpha = 0

        let typeDelay = 0;
        let currentText = 0;
        let renderText = '';
        const text = [
          'Blah blah, don\'t give up whatever.',
          'You prob just died on purpose...'
        ];

        let interval;
        let musicStarted = false;

        const playMusic = () => {
          musicStarted = true;

          sounds.music.gameOver.play();

          interval = setInterval(() => {
            sounds.music.gameOver.pause();
            sounds.music.gameOver.currentTime = 0;
            sounds.music.gameOver.play();
          }, 50000);
        };

        const TIME_TEXT = 230;

        currentFrame = {
          action: (action) => {
            if (ticks > TIME_TEXT && action === Action.CONFIRM) {
              renderText = '';
              currentText++;
              if (currentText === text.length) {
                clearInterval(interval);
                sounds.music.gameOver.pause();
                sounds.music.gameOver.currentTime = 0;
                ready();
              }
            }
          },
          tick: () => {
            ticks++;

            if (ticks === 60) {
              for (let i = 0; i < 6; i++) {
                shards.push({
                  x: Arena.playerX + 320,
                  y: Arena.playerY + 300,
                  dirX: random(30) - 15,
                  dirY: random(30) - 15
                });
              }
            }

            if (ticks < 130) {
              shards.forEach((shard) => {
                shard.dirY += 0.5;

                shard.x += shard.dirX;
                shard.y += shard.dirY;
              });
            } else {
              alpha += 0.07;

              if (!musicStarted) {
                playMusic();
              }

              if (ticks > TIME_TEXT && renderText.length !== text[currentText].length) {
                if (typeDelay === 0) {
                  renderText += text[currentText][renderText.length];
                  typeDelay = 2;
                  sounds.type.gameOver.cloneNode().play();
                } else {
                  typeDelay--;
                }
              }
            }
          },
          render: () => {
            if (ticks < 20) {
              const heart = textures.heart;
              ctx.drawImage(heart, Arena.playerX - (heart.width / 2) + 320, Arena.playerY - (heart.width / 2) + 300);
            } else if (ticks < 60) {
              const brake = textures.brake;
              ctx.drawImage(brake, Arena.playerX - (brake.width / 2) + 320, Arena.playerY - (brake.width / 2) + 300);
            }

            if (ticks < 130) {
              ctx.strokeStyle = 'red';

              shards.forEach((shard) => {
                ctx.beginPath();
                ctx.arc(shard.x, shard.y, 1, 0, 2 * Math.PI);
                ctx.stroke();
              });
            } else {
              ctx.globalAlpha = alpha;
              const texture = textures.gameOver;
              ctx.drawImage(texture, (WIDTH / 2) - (texture.width / 2), 50);

              if (ticks > TIME_TEXT) {
                ctx.font = '30px Determination Mono';
                ctx.globalAlpha = 1;
                ctx.fillStyle = 'white';
                ctx.fillText(renderText, 100, 300);
              }
            }
          }
        };
      }
    }
  }

  update() {
    if (this.hurtTicks > 0) {
      this.hurtTicks--;
    }
  }

  render() {
    ctx.fillStyle = 'white';
    ctx.font = Player.SIZE + 'px Mars Needs Cunnilingus';
    ctx.fillText('GREEN  LV 1', 20 , 370);

    ctx.fillStyle = 'red';
    ctx.fillRect(Player.BAR_X, 372, 40 , 20);

    ctx.fillStyle = 'yellow';
    ctx.fillRect(Player.BAR_X, 372, 40 * (this.health / this.maxHealth), 20);

    ctx.fillStyle = 'white';
    ctx.fillText(this.health + ' / ' + this.maxHealth, 320, 370);
  }
}
