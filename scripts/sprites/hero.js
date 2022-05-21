class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // add to scene
    this.scene.add.existing(this);

    // set initial position
    this.setOrigin(0.5);

    // add physics
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;

    // workaround for update bug: https://github.com/photonstorm/phaser/issues/3378
    this.scene.events.on('postupdate', this.update);

    this.isAlive = true;

    console.log('Hero:', this);
  }

  bounce = () => {
    this.body.velocity.y = -200;
  };

  die = () => {
    this.isAlive = false;
    this.body.enable = false;

    this.anims.play('hero:die');

    this.on('animationcomplete-hero:die', () => this.destroy());
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

    return canJump;
  };

  move = direction => {
    if (!this.body || this.isFrozen) return;

    this.body.velocity.x = direction * 200;

    if (this.body.velocity.x < 0) {
      this.setFlipX(true);
    } else if (this.body.velocity.x > 0) {
      this.setFlipX(false);
    }
  };

  stopJump = () => {
    this.isJumping = false;
  };

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

    return `hero:${ name }`;
  };
}

export default Hero;
