// dependencies
import Phaser from 'phaser';

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

    // player animations
    this.anims.create({
      frameRate: 12,
      frames: this.anims.generateFrameNumbers('player', { frames: [5, 6, 5, 6, 5, 6, 5, 6] }),
      key: 'player:die'
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('player', { frames: [4] }),
      key: 'player:fall'
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('player', { frames: [3] }),
      key: 'player:jump'
    });
    this.anims.create({
      frameRate: 8,
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 2] }),
      key: 'player:run',
      repeat: -1
    });
    this.anims.create({
      frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
      key: 'player:stop'
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
    const sfxConfig = { volume: .5 };

    this.sound.add('sfx:coin', sfxConfig);
    this.sound.add('sfx:door', sfxConfig);
    this.sound.add('sfx:key', sfxConfig);
    this.sound.add('sfx:jump', sfxConfig);
    this.sound.add('sfx:stomp', sfxConfig);
    this.sound.add('song:bgm');

    // play music
    this.sound.play('song:bgm', { loop: true })

    // start game
    this.scene.start('Play', { level: 0 });
  }

  preload() {
    /* load shared assets */

    // data
    this.load.json('level:0', require('../../data/level00.json'));
    this.load.json('level:1', require('../../data/level01.json'));

    // images
    this.load.image('background', require('../../images/background.png'));
    this.load.image('font:numbers', require('../../images/numbers.png'));
    this.load.image('grass:1x1', require('../../images/grass_1x1.png'));
    this.load.image('grass:2x1', require('../../images/grass_2x1.png'));
    this.load.image('grass:4x1', require('../../images/grass_4x1.png'));
    this.load.image('grass:6x1', require('../../images/grass_6x1.png'));
    this.load.image('grass:8x1', require('../../images/grass_8x1.png'));
    this.load.image('ground', require('../../images/ground.png'));
    this.load.image('icon:coin', require('../../images/coin_icon.png'));
    this.load.image('invisible-wall', require('../../images/invisible_wall.png'));
    this.load.image('key', require('../../images/key.png'));

    // audio
    this.load.audio('sfx:coin', require('../../audio/coin.wav').default);
    this.load.audio('sfx:door', require('../../audio/door.wav').default);
    this.load.audio('sfx:key', require('../../audio/key.wav').default);
    this.load.audio('sfx:jump', require('../../audio/jump.wav').default);
    this.load.audio('sfx:stomp', require('../../audio/stomp.wav').default);
    this.load.audio('song:bgm', [
      require('../../audio/bgm.mp3').default,
      require('../../audio/bgm.ogg').default
    ]);

    // spritesheets
    this.load.spritesheet('coin', require('../../images/coin_animated.png'), {
      frameHeight: 22,
      frameWidth: 22
    });
    this.load.spritesheet('decoration', require('../../images/decor.png'), {
      frameHeight: 42,
      frameWidth: 42
    });
    this.load.spritesheet('door', require('../../images/door.png'), {
      frameHeight: 66,
      frameWidth: 42
    });
    this.load.spritesheet('player', require('../../images/hero.png'), {
      frameHeight: 42,
      frameWidth: 36
    });
    this.load.spritesheet('icon:key', require('../../images/key_icon.png'), {
      frameHeight: 30,
      frameWidth: 34
    });
    this.load.spritesheet('spider', require('../../images/spider.png'), {
      frameHeight: 32,
      frameWidth: 42
    });
  }
}

export default Load;
