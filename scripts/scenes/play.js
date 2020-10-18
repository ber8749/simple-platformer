import Hero from '../sprites/hero.js';
import Spider from '../sprites/spider.js';

class Play extends Phaser.Scene {
  static LEVEL_COUNT = 2;

  constructor() {
    super('Play');

    console.log('Play', this);
  }

  create() {
    // add background
    this.add.image(0, 0, 'background').setOrigin(0, 0);

    // load level
    this._loadLevel(this.cache.json.get(`level:${ this.level }`));

    // add HUD
    this._createHud();

    // fade in
    this.cameras.main.fadeIn(500);
  }

  init(data) {
    this.coinCount = 0;
    this.hasKey = false;
    this.level = (data.level || 0) % this.constructor.LEVEL_COUNT;

    // configure input
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP
    });
  }

  update() {
    this._handleCollisions();
    this._handleInput();

    // update coin count
    this.coinScore.text = `X${ this.coinCount }`;

    // update key status
    this.keyIcon.setFrame(this.hasKey ? 1 : 0);
  }

  // private methods

  _collisionHandlers = {
    enemyPlatform: enemies => {
      this.physics.collide(enemies, this.platforms);
    },
    enemyWalls: enemies => {
      this.physics.collide(enemies, this.enemyWalls);
    },
    heroCoin: (_hero, coin) => {
      this.sound.play('sfx:coin');

      coin.destroy();

      this.coinCount++;
    },
    heroDoor: (hero, door) => {
      // "open" door frame
      door.setFrame(1);

      this.sound.play('sfx:door');

      hero.freeze();

      // play 'enter door' animation and change to the next level when it ends
      this.tweens.add({
        alpha: 0,
        duration: 500,
        onComplete: () => this._changeLevel(this.level + 1),
        targets: hero,
        x: door.x
      });
    },
    heroEnemy: (hero, enemy) => {
      this.sound.play('sfx:stomp');

      if (hero.body.velocity.y > 0) {
        // kill enemies when hero is falling
        hero.bounce();
        enemy.die();
      } else {
        hero.die();
        // game over -> restart the game
        hero.on(Phaser.Core.Events.DESTROY, () => this._changeLevel(this.level));
      }
    },
    heroKey: (_hero, key) => {
      this.sound.play('sfx:key');

      key.destroy();

      this.hasKey = true;
    },
    heroPlatform: () => {
      this.physics.collide(this.hero, this.platforms);
    }
  };

  _changeLevel = level => {
    // fade out and restart
    this.cameras.main.fadeOut(500);
    this.cameras.main.on('camerafadeoutcomplete', () => this.scene.restart({ level }));
  };

  _createHud = () => {
    this.keyIcon = this.make.image({
      key: 'icon:key',
      x: 0,
      y: 19
    });
    this.keyIcon.setOrigin(0, 0.5);

    const coinIcon = this.make.image({
      key: 'icon:coin',
      x: this.keyIcon.width + 7,
      y: 0
    });
    coinIcon.setOrigin(0);

    this.coinScore = this.make.bitmapText({
      font: 'font:numbers',
      text: 'X0',
      x: coinIcon.x + coinIcon.width,
      y: coinIcon.height / 2
    });
    this.coinScore.setOrigin(0, 0.5);

    this.hud = this.add.container();
    this.hud.add(coinIcon);
    this.hud.add(this.coinScore);
    this.hud.add(this.keyIcon);
    this.hud.setPosition(10, 10);
  };

  _handleCollisions = () => {
    // when hero stands on platforms
    this._collisionHandlers.heroPlatform();

    // hero collects with coins
    this.physics.overlap(
      this.hero,
      this.coins,
      this._collisionHandlers.heroCoin,
      null,
      this
    );

    // hero collides with spider
    this.physics.overlap(
      this.hero,
      this.spiders,
      this._collisionHandlers.heroEnemy,
      null,
      this
    );

    // hero collides with key
    this.physics.overlap(
      this.hero,
      this.key,
      this._collisionHandlers.heroKey,
      null,
      this
    );

    this.physics.overlap(
      this.hero,
      this.door,
      this._collisionHandlers.heroDoor,
      // ignore if there is no key or the player is on air
      (hero, _door) => this.hasKey && hero.body.touching.down,
      this
    );

    // spiders collide with platforms and invisible walls
    this._collisionHandlers.enemyPlatform(this.spiders);
    this._collisionHandlers.enemyWalls(this.spiders);
  };

  _handleInput = () => {
    if (this.keys.left.isDown) {
      // move hero left
      this.hero.move(-1);
    } else if (this.keys.right.isDown) {
      // move hero right
      this.hero.move(1);
    } else {
      // stop
      this.hero.move(0);
    }

    if (this.keys.up.isDown && this.keys.up.getDuration() < 200) {
      const didJump = this.hero.jump();

      if (didJump) {
        this.sound.play('sfx:jump');
      }
    } else {
      this.hero.stopJump();
    }
  };

  _loadLevel = ({ coins, decoration, door, hero, key, platforms, spiders }) => {
    // create all the groups/layers that we need
    this.decorations = this.add.group();
    this.coins = this.add.group();
    this.enemyWalls = this.add.group();
    this.platforms = this.add.group();
    this.spiders = this.add.group();

    // spawn decorations
    decoration.forEach(this._spawnDecoration);

    // spawn all platforms
    platforms.forEach(this._spawnPlatform);
    this.enemyWalls.setVisible(false);

    // spawn important objects
    coins.forEach(this._spawnCoin);

    // spawn decorations
    this._spawnDoor(door.x, door.y);
    this._spawnKey(key.x, key.y);

    // spawn hero and enemies
    this._spawnCharacters({ hero, spiders });
  };

  _spawnCharacters({ hero, spiders }) {
    // spawn hero
    this.hero = new Hero(this, hero.x, hero.y, 'hero');

    // spawn spiders
    spiders.forEach(({ x, y }) => {
      const spider = new Spider(this, x, y, 'spider');

      this.spiders.add(spider);
    });
  }

  _spawnCoin = ({ x, y }) => {
    const coin = this.add.sprite(x, y, 'coin');

    // position
    coin.setOrigin(0.5);

    // animate
    coin.anims.play('coin:rotate');

    // add and configure physics
    this.physics.add.existing(coin);
    coin.body.allowGravity = false;

    this.coins.add(coin);
  };

  _spawnDecoration = ({ frame, x, y }) => {
    const decoration = this.add.image(x, y, 'decoration', frame);

    decoration.setOrigin(0);

    this.decorations.add(decoration);
  };

  _spawnDoor = (x, y) => {
    this.door = this.decorations.create(x, y, 'door');
    this.door.setOrigin(0.5, 1);
    this.physics.world.enable(this.door);
    this.door.body.allowGravity = false;
  };

  _spawnEnemyWall = (x, y, side) => {
    const enemyWall = this.add.sprite(x, y, 'invisible-wall');

    // position
    enemyWall.setOrigin(side === 'left' ? 1 : 0, 1);

    // physic properties
    this.physics.add.existing(enemyWall);
    enemyWall.body.immovable = true;
    enemyWall.body.allowGravity = false;

    this.enemyWalls.add(enemyWall);
  };

  _spawnKey = (x, y) => {
    this.key = this.decorations.create(x, y, 'key');
    this.key.setOrigin(0.5);

    this.tweens.add({
      targets: this.key,
      ease: 'Sine.easeInOut',
      duration: 800,
      repeat: -1,
      y: this.key.y + 6,
      yoyo: true
    });

    this.physics.world.enable(this.key);
    this.key.body.allowGravity = false;
  };

  _spawnPlatform = ({ x, y, image }) => {
    // create platform
    const platform = this.add.sprite(x, y, image)

    // position
    platform.setOrigin(0);

    // add and configure physics
    this.physics.add.existing(platform);
    platform.body.allowGravity = false;
    platform.body.immovable = true;

    // add invisible walls to contain enemies
    this._spawnEnemyWall(x, y, 'left');
    this._spawnEnemyWall(x + platform.width, y, 'right');

    // add to group
    this.platforms.add(platform);
  };
}

export default Play;
