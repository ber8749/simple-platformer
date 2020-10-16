import Levels from './scenes/levels.js';

// load game
const config = {
  height: 600,
  key: 'game',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 }
    }
  },
  scene: [Levels],
  type: Phaser.AUTO,
  width: 960
};

const game = new Phaser.Game(config);

// start game
game.scene.start('Levels', { level: 0 });

console.log('game:', game);
