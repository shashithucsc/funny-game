import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data: { gpa: number, reason: string }) {
    // 1. Beautiful Background
    const bg = this.add.image(200, 400, 'bg-campus');
    bg.setDisplaySize(400, 800); // cover the screen
    bg.setTint(0x444444); // Darken the background significantly

    // Add a dark overlay for extra contrast
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, 400, 800);

    // 2. Glowing shadow behind Devindi
    const glow = this.add.graphics();
    glow.fillStyle(0xffffff, 0.15);
    glow.fillCircle(200, 360, 140);
    glow.fillStyle(0xffffff, 0.3);
    glow.fillCircle(200, 360, 100);

    // 3. Show Sad Devindi
    const sadDevindi = this.add.image(200, 350, 'devindi-sad');
    sadDevindi.setScale(0.85);
    
    // Animate Devindi floating slightly
    this.tweens.add({
      targets: sadDevindi,
      y: 360,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 4. Game Over Title
    this.add.text(200, 80, '💀 GPA DESTROYED', {
      fontSize: '36px',
      color: '#ff3366',
      fontStyle: '900',
      fontFamily: 'sans-serif',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { color: '#000000', fill: true, offsetX: 2, offsetY: 4, blur: 4 }
    }).setOrigin(0.5);
    
    // 5. Final GPA Score
    const gpaColor = data.gpa >= 3.0 ? '#44ff44' : (data.gpa >= 2.5 ? '#ffcc00' : '#ff4444');
    
    this.add.text(200, 140, `FINAL GPA: ${data.gpa.toFixed(2)}`, {
      fontSize: '32px',
      color: gpaColor,
      fontStyle: '900',
      fontFamily: 'sans-serif',
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { color: '#000000', fill: true, offsetX: 0, offsetY: 4, blur: 4 }
    }).setOrigin(0.5);
    
    // 6. Reason Text - styled like a nice quote
    const reasonBox = this.add.graphics();
    reasonBox.fillStyle(0x000000, 0.5);
    reasonBox.fillRoundedRect(40, 560, 320, 80, 16);

    this.add.text(200, 600, data.reason || 'Too many bugs.', {
      fontSize: '22px',
      color: '#e2e8f0',
      fontFamily: 'sans-serif',
      fontStyle: 'bold',
      align: 'center',
      wordWrap: { width: 300 }
    }).setOrigin(0.5);
    
    // 7. Polished "Try Again" Button using a Container
    const btnContainer = this.add.container(200, 710);
    
    const btnShadow = this.add.graphics();
    btnShadow.fillStyle(0x000000, 0.4);
    btnShadow.fillRoundedRect(-116, -31, 232, 62, 31);
    
    const btnGraphics = this.add.graphics();
    btnGraphics.fillStyle(0x2563eb, 1); // Tailwind blue-600
    btnGraphics.fillRoundedRect(-120, -35, 240, 70, 35);
    btnGraphics.lineStyle(4, 0x60a5fa, 1); // Tailwind blue-400 border
    btnGraphics.strokeRoundedRect(-120, -35, 240, 70, 35);
    
    const btnText = this.add.text(0, 0, 'PLAY AGAIN', {
      fontSize: '26px',
      color: '#ffffff',
      fontFamily: 'sans-serif',
      fontStyle: '900',
      stroke: '#1e3a8a',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    btnContainer.add([btnShadow, btnGraphics, btnText]);
    
    // Make button interactive by adding a hit area to the container
    btnContainer.setSize(240, 70);
    btnContainer.setInteractive();
    
    // Button Hover / Active effects
    btnContainer.on('pointerover', () => {
      this.tweens.add({ targets: btnContainer, scaleX: 1.05, scaleY: 1.05, duration: 100 });
    });
    
    btnContainer.on('pointerout', () => {
      this.tweens.add({ targets: btnContainer, scaleX: 1, scaleY: 1, duration: 100 });
    });
    
    btnContainer.on('pointerdown', () => {
      this.tweens.add({ targets: btnContainer, scaleX: 0.95, scaleY: 0.95, duration: 100 });
    });
    
    btnContainer.on('pointerup', () => {
      this.scene.start('GameScene');
    });
  }
}
