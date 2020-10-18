class Load extends Phaser.Scene {
  constructor() {
    super('Load');
  }

  create() {
    /* create shared resources */

    // coin animations
    this.anims.create({
      frames: this.anims.generateFrameNumbers('coin'),
      frameRate: 6,
      key: 'coin:rotate',
      repeat: -1
    });

    // spider animations
    this.anims.create({
      frames: this.anims.generateFrameNumbers('spider', { frames: [0, 1, 2] }),
      frameRate: 8,
      key: 'spider:crawl',
      repeat: -1
    });
    this.anims.create({
      key: 'spider:die',
      frames: this.anims.generateFrameNumbers('spider', { frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3] }),
      frameRate: 12
    });

    // hero animations
    this.anims.create({
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('hero', { frames: [5, 6, 5, 6, 5, 6, 5, 6] }),
      key: 'hero:die'
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('hero', { frames: [4] }),
      key: 'hero:fall'
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('hero', { frames: [3] }),
      key: 'hero:jump'
    });
    this.anims.create({
      frameRate: 8,
      frames: this.anims.generateFrameNumbers('hero', { frames: [1, 2] }),
      key: 'hero:run',
      repeat: -1
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('hero', { frames: [0] }),
      key: 'hero:stop'
    });

    // fonts
    this.cache.bitmapFont.add('font:numbers', Phaser.GameObjects.RetroFont.Parse(this, {
      chars: '0123456789X ',
      charsPerRow: 6,
      height: 26,
      image: 'font:numbers',
      width: 20
    }));

    // sounds
    this.sound.add('sfx:coin');
    this.sound.add('sfx:door');
    this.sound.add('sfx:key');
    this.sound.add('sfx:jump');
    this.sound.add('sfx:stomp');
    this.sound.add('song:bgm');

    // play music
    this.sound.play('song:bgm', { loop: true })

    // start game
    this.scene.start('Levels', { level: 0 });
  }

  preload() {
    /* load shared assets */

    // data
    this.load.json('level:0', 'data/level00.json');
    this.load.json('level:1', 'data/level01.json');

    // images
    this.load.image('background', 'images/background.png');
    this.load.image('font:numbers', 'images/numbers.png');
    this.load.image('grass:8x1', 'images/grass_8x1.png');
    this.load.image('grass:6x1', 'images/grass_6x1.png');
    this.load.image('grass:4x1', 'images/grass_4x1.png');
    this.load.image('grass:2x1', 'images/grass_2x1.png');
    this.load.image('grass:1x1', 'images/grass_1x1.png');
    this.load.image('ground', 'images/ground.png');
    this.load.image('icon:coin', 'images/coin_icon.png');
    this.load.image('invisible-wall', 'images/invisible_wall.png');
    this.load.image('key', 'images/key.png');

    // audio
    this.load.audio('sfx:coin', 'audio/coin.wav');
    this.load.audio('sfx:door', 'audio/door.wav');
    this.load.audio('sfx:key', 'audio/key.wav');
    this.load.audio('sfx:jump', 'audio/jump.wav');
    this.load.audio('sfx:stomp', 'audio/stomp.wav');
    this.load.audio('song:bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);

    // spritesheets
    this.load.spritesheet('coin', 'images/coin_animated.png', {
      frameHeight: 22,
      frameWidth: 22
    });
    this.load.spritesheet('decoration', 'images/decor.png', {
      frameHeight: 42,
      frameWidth: 42
    });
    this.load.spritesheet('door', 'images/door.png', {
      frameHeight: 66,
      frameWidth: 42
    });
    this.load.spritesheet('hero', 'images/hero.png', {
      frameHeight: 42,
      frameWidth: 36
    });
    this.load.spritesheet('icon:key', 'images/key_icon.png', {
      frameHeight: 30,
      frameWidth: 34
    });
    this.load.spritesheet('spider', 'images/spider.png', {
      frameHeight: 32,
      frameWidth: 42
    });
  }
}

export default Load;
