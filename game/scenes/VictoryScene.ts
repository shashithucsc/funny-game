import Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }

  create() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0);
    
    // Sparkles
    const sparkles = this.add.particles(0, 0, 'icon-brain', {
      x: { min: 0, max: width },
      y: { min: 0, max: height },
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: 50,
      lifespan: 2000,
      blendMode: 'ADD',
      frequency: 100
    });
    
    // Graduated Image
    const player = this.add.image(width / 2, height / 2 - 50, 'devindi-celebrate');
    player.setScale(2.0);
    
    // Bounce animation
    this.tweens.add({
      targets: player,
      y: player.y - 30,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    // Victory Text
    this.add.text(width / 2, height / 2 - 200, '4.0 GPA!', {
      fontSize: '64px',
      color: '#44ff44',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 8
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height / 2 + 100, 'YOU GRADUATED!', {
      fontSize: '36px',
      color: '#ffffff',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    
    // Play Again Button
    const btn = this.add.graphics();
    btn.fillStyle(0x44ff44, 1);
    btn.fillRoundedRect(width / 2 - 120, height / 2 + 180, 240, 60, 30);
    
    const btnText = this.add.text(width / 2, height / 2 + 210, 'PLAY AGAIN', {
      fontSize: '24px',
      color: '#000000',
      fontStyle: '900'
    }).setOrigin(0.5);
    
    btn.setInteractive(new Phaser.Geom.Rectangle(width / 2 - 120, height / 2 + 180, 240, 60), Phaser.Geom.Rectangle.Contains);
    
    btn.on('pointerover', () => {
      btn.clear();
      btn.fillStyle(0x66ff66, 1);
      btn.fillRoundedRect(width / 2 - 120, height / 2 + 180, 240, 60, 30);
    });
    
    btn.on('pointerout', () => {
      btn.clear();
      btn.fillStyle(0x44ff44, 1);
      btn.fillRoundedRect(width / 2 - 120, height / 2 + 180, 240, 60, 30);
    });
    
    btn.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}
