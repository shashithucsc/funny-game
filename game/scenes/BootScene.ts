import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load assets here
    // Character sprites
    const sprites = [
      'run1', 'run2', 'run3', 'run4',
      'jump', 'duck', 'fall', 'getup',
      'celebrate', 'sad', 'angry', 'sleep'
    ];
    
    sprites.forEach(sprite => {
      this.load.image(`lomasha-${sprite}`, `assets/character/lomasha-${sprite}.png`);
    });

    this.load.image('bg-seamless', 'assets/seamless_road.jpg');
    
    this.load.image('icon-book', 'assets/icons/icon-book.png');
    this.load.image('icon-coffee', 'assets/icons/icon-coffee.png');
    this.load.image('icon-brain', 'assets/icons/icon-brain.png');
    this.load.image('icon-clock', 'assets/icons/icon-clock.png');
    this.load.image('icon-f', 'assets/icons/icon-f.png');
    
    // SFX
    this.load.audio('sfx-jump', 'assets/sfx/jump.wav');
    this.load.audio('sfx-collect', 'assets/sfx/collect.wav');
    this.load.audio('sfx-hit', 'assets/sfx/hit.wav');
  }

  create() {
    // Create animations if using sprite sheets, but we have individual images
    // So we can create an animation from the individual frames
    this.anims.create({
      key: 'lomasha-run',
      frames: [
        { key: 'lomasha-run1' },
        { key: 'lomasha-run2' },
        { key: 'lomasha-run3' },
        { key: 'lomasha-run4' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('GameScene');
  }
}
