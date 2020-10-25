// dependencies
import Phaser from 'phaser';
// data
import level00 from '../../data/level00.json';
import level01 from '../../data/level01.json';
// images
import backgroundImage from '../../images/background.png';
import coinImage from '../../images/coin_icon.png';
import grass1Image from '../../images/grass_1x1.png';
import grass2Image from '../../images/grass_2x1.png';
import grass4Image from '../../images/grass_4x1.png';
import grass6Image from '../../images/grass_6x1.png';
import grass8Image from '../../images/grass_8x1.png';
import groundImage from '../../images/ground.png';
import invisibleWallImage from '../../images/invisible_wall.png';
import keyImage from '../../images/key.png';
import numbersImage from '../../images/numbers.png';
// audio
import coinAudio from '../../audio/coin.wav';
import doorAudio from '../../audio/door.wav';
import keyAudio from '../../audio/key.wav';
import jumpAudio from '../../audio/jump.wav';
import stompAudio from '../../audio/stomp.wav';
import songAudioPrimary from '../../audio/bgm.mp3';
import songAudioSecondary from '../../audio/bgm.ogg';
// spritesheets
import coinSpritesheet from '../../images/coin_animated.png';
import decorSpritesheet from '../../images/decor.png';
import doorSpritesheet from '../../images/door.png';
import heroSpritesheet from '../../images/hero.png';
import keySpritesheet from '../../images/key_icon.png';
import spiderSpritesheet from '../../images/spider.png';

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
    this.scene.start('Play', { level: 0 });
  }

  preload() {
    /* load shared assets */

    // data
    this.load.json('level:0', level00);
    this.load.json('level:1', level01);

    // images
    this.load.image('background', backgroundImage);
    this.load.image('font:numbers', numbersImage);
    this.load.image('grass:8x1', grass8Image);
    this.load.image('grass:6x1', grass6Image);
    this.load.image('grass:4x1', grass4Image);
    this.load.image('grass:2x1', grass2Image);
    this.load.image('grass:1x1', grass1Image);
    this.load.image('ground', groundImage);
    this.load.image('icon:coin', coinImage);
    this.load.image('invisible-wall', invisibleWallImage);
    this.load.image('key', keyImage);

    // audio
    this.load.audio('sfx:coin', coinAudio);
    this.load.audio('sfx:door', doorAudio);
    this.load.audio('sfx:key', keyAudio);
    this.load.audio('sfx:jump', jumpAudio);
    this.load.audio('sfx:stomp', stompAudio);
    this.load.audio('song:bgm', [songAudioPrimary, songAudioSecondary]);

    // spritesheets
    this.load.spritesheet('coin', coinSpritesheet, {
      frameHeight: 22,
      frameWidth: 22
    });
    this.load.spritesheet('decoration', decorSpritesheet, {
      frameHeight: 42,
      frameWidth: 42
    });
    this.load.spritesheet('door', doorSpritesheet, {
      frameHeight: 66,
      frameWidth: 42
    });
    this.load.spritesheet('hero', heroSpritesheet, {
      frameHeight: 42,
      frameWidth: 36
    });
    this.load.spritesheet('icon:key', keySpritesheet, {
      frameHeight: 30,
      frameWidth: 34
    });
    this.load.spritesheet('spider', spiderSpritesheet, {
      frameHeight: 32,
      frameWidth: 42
    });
  }
}

export default Load;
