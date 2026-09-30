import Phaser from 'phaser';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  public gpaBonus: number = 0.05;
  public collectibleType: string = 'Note';
  
  constructor(scene: Phaser.Scene, x: number, y: number, collectibleType: string) {
    let texture = 'icon-book';
    switch (collectibleType) {
      case 'Note': texture = 'icon-book'; break; // Note uses book for now
      case 'Book': texture = 'icon-book'; break;
      case 'Brain': texture = 'icon-brain'; break;
      case 'Coffee': texture = 'icon-coffee'; break;
    }

    super(scene, x, y, texture);
    this.collectibleType = collectibleType;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setDepth(4);
    this.setScale(0.7); // Scale down the 120x120 icon slightly
    
    switch (collectibleType) {
      case 'Note': this.gpaBonus = 0.05; break;
      case 'Book': this.gpaBonus = 0.10; break;
      case 'Brain': this.gpaBonus = 0.25; break;
      case 'Coffee': this.gpaBonus = 0.0; break;
    }
    
    // Setup physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(this.width * 0.4);
    body.setOffset(this.width * 0.1, this.height * 0.1);
    
    // Add floating animation
    scene.tweens.add({
      targets: this,
      y: y + 15,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  update(time: number, delta: number) {
    this.y += (this.scene as any).gameSpeed * (delta / 1000);
    if (this.y > 900) {
      this.destroy();
    }
  }
}
