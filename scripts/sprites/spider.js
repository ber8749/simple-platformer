class Spider extends Phaser.GameObjects.Sprite {
  static SPEED = 100;

  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // set initial position
    this.setOrigin(0.5);

    // add to scene
    this.scene.add.existing(this);

    // add physics
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;

    // start animations
    this.anims.play('crawl');

    // workaround for update bug: https://github.com/photonstorm/phaser/issues/3378
    this.scene.events.on('postupdate', this.update);

    console.log('Spider:', this);
  }

  die = () => {
    this.body.enable = false;

    this.anims.play('die');

    this.on('animationcomplete-die', () => this.destroy());
  };

  update = () => {
    if (!this.body) return;

    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
      // turn left
      this.body.velocity.x = -Spider.SPEED;
    } else if (this.body.touching.left || this.body.blocked.left) {
      // turn right
      this.body.velocity.x = Spider.SPEED;
    }
  };
}

export default Spider;
