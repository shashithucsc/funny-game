import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Background
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'STUDYING...', {
      fontFamily: 'sans-serif',
      fontSize: '28px',
      fontStyle: '900',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    // Progress box
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x000000, 0.8);
    progressBox.fillRoundedRect(width / 2 - 110, height / 2, 220, 30, 15);
    progressBox.lineStyle(2, 0x44ff44, 1);
    progressBox.strokeRoundedRect(width / 2 - 110, height / 2, 220, 30, 15);
    
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x44ff44, 1);
      progressBar.fillRoundedRect(width / 2 - 105, height / 2 + 5, 210 * value, 20, 10);
      loadingText.setText(`STUDYING... ${Math.floor(value * 100)}%`);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load assets here
    // Character sprites
    const sprites = [
      'run1', 'run2', 'run3', 'run4',
      'jump', 'duck', 'fall', 'getup',
      'celebrate', 'sad', 'angry', 'sleep'
    ];
    
    sprites.forEach(sprite => {
      this.load.image(`devindi-${sprite}`, `assets/character/devindi-${sprite}.png`);
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
    this.load.audio('bgm', 'assets/sfx/bgm.wav');
    this.load.audio('sfx-victory', 'assets/sfx/victory.wav');
  }

  create() {
    // Create animations if using sprite sheets, but we have individual images
    // So we can create an animation from the individual frames
    this.anims.create({
      key: 'devindi-run',
      frames: [
        { key: 'devindi-run1' },
        { key: 'devindi-run2' },
        { key: 'devindi-run3' },
        { key: 'devindi-run4' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.scene.start('GameScene');
  }
}
