const WIDTH = 640;
const HEIGHT = 480;

let textures = {};
let sounds = {};

let ctx;

let currentFrame = {
  tick: () => {},
  action: () => {},
  render: () => {
    // Show simple loading text until assets are ready.
    ctx.fillStyle = 'white';
    ctx.font = '30px Determination Mono';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', WIDTH / 2, HEIGHT / 2);
  }
};

(() => {
  const aspect = WIDTH / HEIGHT;

  let canvas;

  /**
   * Called when the window is resized.
   */
  const onResize = () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowAspect = windowWidth / windowHeight;

    let scale;

    // Ensure canvas is properly sized and centered.
    if (windowAspect > aspect) {
      canvas.width = windowHeight * aspect;
      canvas.height = windowHeight;
      scale = windowHeight / HEIGHT;
    } else {
      canvas.width = windowWidth;
      canvas.height = windowWidth / aspect;
      scale = windowWidth / WIDTH;
    }

    // Maintain the same scale for ease of rendering.
    ctx.scale(scale, scale);
  };

  let textureQueue = 16;

  /**
   * Loads a texture.
   *
   * @param name The file name of the texture, without 'img/' prepended.
   */
  const loadTexture = (name) => {
    const image = new Image();
    image.src = 'img/' + name;
    image.onload = () => {
      textureQueue--;
      if (textureQueue === 0) {
        ready();
        window.requestAnimationFrame(loop);
      }
    };

    return image;
  };

  /**
   * Loads a sound file.
   *
   * @param name The file name of the sound, without 'sfx/' prepended.
   * @param volume Volume of the sound.
   */
  const loadAudio = (name, volume) => {
    const audio = new Audio('sfx/' + name);

    if (typeof volume !== 'undefined') {
      audio.volume = volume;
    }

    return audio;
  }

 window.onload = () => {
    // Initialize canvas & context + check for compatibility
    canvas = document.getElementById('frame');

    if (!canvas.getContext || !canvas.getContext('2d')) {
      // Warn of no canvas compatibility
      document.getElementById('no-canvas').style['display'] = 'block';
      return;
    }

    ctx = canvas.getContext('2d');

    // Handle resize events
    onResize();
    window.onresize = onResize;
    initEvents();

    // Load assets
    textures = {
      title: loadTexture('title.png'),
      button: {
        solve: loadTexture('solve.png'),
        solveSel: loadTexture('solve-s.png'),
        help: loadTexture('help.png'),
        helpSel: loadTexture('help-s.png'),
        item: loadTexture('item.png'),
        itemSel: loadTexture('item-s.png'),
        done: loadTexture('done.png'),
        doneSel: loadTexture('done-s.png')
      },
      heart: loadTexture('heart.png'),
      attack: []
    };

    // Load all attack animation frames
    for (let i = 0; i <= 5; i++) {
      textures.attack[i] = loadTexture('attack-' + i + '.png');
    }

    sounds = {
      type: {
        menu: loadAudio('type-menu.wav', 0.5)
      }
    };
  };

  let time = Date.now();
  let elapsed = 0;
  const loop = () => {
    let delta = Date.now() - time;
    time = Date.now();

    elapsed += delta;

    let ticksDue = Math.floor(elapsed / 30);

    if (ticksDue > 0) {
      for (let i = 0; i < ticksDue; i++) {
        currentFrame.tick();
      }
    }

    elapsed -= ticksDue * 30;

    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    currentFrame.render();

    window.requestAnimationFrame(loop);
  };
})();
