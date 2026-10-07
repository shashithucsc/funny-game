import Phaser from 'phaser';

export default class Obstacle extends Phaser.Physics.Arcade.Sprite {
  public distancePenalty: number = 30;
  public message: string = "Should've read the case.";
  public obstacleType: number;
  
  constructor(scene: Phaser.Scene, x: number, y: number, type: number) {
    let texture = 'icon-ring';
    switch (type) {
      case 1: texture = 'icon-ring'; break; 
      case 2: texture = 'icon-bouquet'; break; 
    }

    super(scene, x, y, texture);
    this.obstacleType = type;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setDepth(5);
    this.setScale(0.7); // Scale down the 120x120 icon slightly
    
    // Set properties based on type
    switch (type) {
      case 1:
        this.distancePenalty = 40;
        this.message = "Almost Caught!";
        break;
      case 2:
        this.distancePenalty = 20;
        this.message = "Stumbled!";
        break;
    }
    
    // Setup physics body
    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.body.setCircle(this.width * 0.4);
    this.body.setOffset(this.width * 0.1, this.height * 0.1);
  }

  update(time: number, delta: number) {
    this.y += (this.scene as any).gameSpeed * (delta / 1000);
    
    // Add a slight rotation for visual flair
    if (this.obstacleType === 1 || this.obstacleType === 2) {
      this.rotation += 0.05;
    }

    if (this.y > 900) {
      this.destroy();
    }
  }
}
