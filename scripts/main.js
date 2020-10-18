import Load from './scenes/load.js';
import Levels from './scenes/levels.js';

// load game
const config = {
  height: 600,
  key: 'game',
  render: {
    roundPixels: true
  },
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 }
    }
  },
  scene: [Load, Levels],
  type: Phaser.AUTO,
  width: 960
};

const game = new Phaser.Game(config);

console.log('game:', game);
