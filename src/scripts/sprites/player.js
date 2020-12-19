// dependencies
import { debounce } from 'lodash';
import Phaser from 'phaser';

class Player extends Phaser.GameObjects.Sprite {
  constructor({ frame, id, isPeer, scene, socket, texture = 'player', x, y }) {
    super(scene, x, y, texture, frame);

    // define player properties
    this.id = id;
    this.isAlive = true;
    this.isMoving = false;
    this.isPeer = !!isPeer;
    this.setOrigin(0.5);
    this.socket = socket;

    // add to scene
    this.scene.add.existing(this);

    // add physics
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;

    // circumvent update bug:
    // https://github.com/photonstorm/phaser/issues/3378
    this.scene.events.on('postupdate', this.update);
  }

  eventEmitters = {
    jump: debounce(
      () => {
        this.log('jump event emitted');
        this.socket.emit('player-updated', {
          id: this.id,
          jump: true
        })
      }
    ),
    move: debounce(
      direction => {
        this.log('move event emitted', direction);
        this.socket.emit('player-updated', {
          id: this.id,
          move: direction
        })
      }
    )
  }

  bounce = () => {
    this.body.velocity.y = -200;
  };

  die = () => {
    this.isAlive = false;
    this.body.enable = false;

    this.scene.sound.play('sfx:stomp');

    this.anims.play('player:die');

    this.on('animationcomplete-player:die', () => this.destroy());
  }

  freeze = () => {
    this.body.enable = false;
    this.isFrozen = true;
  }

  jump = () => {
    if (!this.body) return;

    const canJump = this.body.touching.down && this.isAlive && !this.isFrozen;;

    if (canJump || this.isJumping) {
      this.body.velocity.y = -400;
      this.isJumping = true;
    }

    if (!this.isPeer) {
      this.eventEmitters.jump();
    }

    return canJump;
  };

  log(...args) {
    console.log(
      this.isPeer ? 'Peer' : 'Player',
      this.id,
      ...args
    );
  }

  move = direction => {
    if (!this.body || this.isFrozen) return;

    this.body.velocity.x = direction * 200;

    if (this.body.velocity.x < 0) {
      this.setFlipX(true);
    } else if (this.body.velocity.x > 0) {
      this.setFlipX(false);
    }

    if (!this.isPeer && this.isMoving) {
      this.eventEmitters.move(direction);
    }

    this.isMoving = direction !== 0;
  };

  revive = () => {
    this.body.enable = true;
    this.isAlive = true;
  }

  stopJump = () => {
    this.isJumping = false;
  };

  thaw = () => {
    this.body.enable = true;
    this.isFrozen = false;
  }

  update = () => {
    if (!this.body) return;

    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();

    if (this.anims.currentAnim?.key !== animationName) {
      this.anims.play(animationName);
    }
  }

  // private methods

  _getAnimationName = () => {
    // default animation
    let name = 'stop';

    if (!this.isAlive) {
      name = 'die';
    } else if (this.isFrozen) {
      name = 'stop';
    } else if (this.body.velocity.y < 0) {
      name = 'jump';
    } else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
      name = 'fall';
    } else if (this.body.velocity.x !== 0 && this.body.touching.down) {
      name = 'run';
    }

    return `player:${ name }`;
  };
}

export default Player;