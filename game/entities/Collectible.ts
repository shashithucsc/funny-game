import Phaser from 'phaser';

export default class Collectible extends Phaser.Physics.Arcade.Sprite {
  public distanceBonus: number = 20;
  public collectibleType: string = 'Note';
  
  constructor(scene: Phaser.Scene, x: number, y: number, collectibleType: string) {
    let texture = 'icon-shoes';
    switch (collectibleType) {
      case 'Shoes': texture = 'icon-shoes'; break;
      case 'Coffee': texture = 'icon-coffee'; break;
    }

    super(scene, x, y, texture);
    this.collectibleType = collectibleType;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setDepth(4);
    this.setScale(0.7); // Scale down the 120x120 icon slightly
    
    switch (collectibleType) {
      case 'Shoes': this.distanceBonus = 20; break;
      case 'Coffee': this.distanceBonus = 0; break;
    }
    
    // Setup physics body
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setCircle(this.width * 0.4);
    body.setOffset(this.width * 0.1, this.height * 0.1);
  }

  update(time: number, delta: number) {
    this.y += (this.scene as any).gameSpeed * (delta / 1000);
    if (this.y > 900) {
      this.destroy();
    }
  }
}
