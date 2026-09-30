import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private currentLane: number = 1; // 0 = Left, 1 = Center, 2 = Right
  private lanes: number[] = [100, 200, 300];
  
  public isJumping: boolean = false;
  public isDucking: boolean = false;
  private targetX: number = 200;
  
  private shadow!: Phaser.GameObjects.Ellipse;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'lomasha-run1');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setDepth(10);
    this.setScale(0.3); // High-res scale down
    
    // Draw shadow
    this.shadow = scene.add.ellipse(x, y + (this.height * 0.15), 100, 30, 0x000000, 0.4);
    this.shadow.setDepth(9);
    
    // Setup physics body
    this.body = this.body as Phaser.Physics.Arcade.Body;
    this.body.setSize(this.width * 0.5, this.height * 0.8);
    this.body.setOffset(this.width * 0.25, this.height * 0.2);
    
    this.play('lomasha-run');
  }

  update(time: number, delta: number) {
    // Smooth lane switching
    this.x = Phaser.Math.Linear(this.x, this.targetX, 0.2);
    
    // Update shadow position
    this.shadow.x = this.x;
    
    // Ensure animation logic based on state
    if (this.isJumping) {
      this.setTexture('lomasha-jump');
      this.stop(); // Stop run anim
      this.shadow.setScale(0.5); // Shrink shadow when jumping
    } else if (this.isDucking) {
      this.setTexture('lomasha-duck');
      this.stop();
      this.shadow.setScale(1.2);
      // Adjust hitbox
      (this.body as Phaser.Physics.Arcade.Body).setSize(this.width * 0.5, this.height * 0.4);
      (this.body as Phaser.Physics.Arcade.Body).setOffset(this.width * 0.25, this.height * 0.6);
    } else {
      this.shadow.setScale(1.0);
      if (!this.anims.isPlaying) {
        this.play('lomasha-run');
        (this.body as Phaser.Physics.Arcade.Body).setSize(this.width * 0.5, this.height * 0.8);
        (this.body as Phaser.Physics.Arcade.Body).setOffset(this.width * 0.25, this.height * 0.2);
      }
    }
  }

  moveLeft() {
    if (this.currentLane > 0) {
      this.currentLane--;
      this.targetX = this.lanes[this.currentLane];
    }
  }

  moveRight() {
    if (this.currentLane < 2) {
      this.currentLane++;
      this.targetX = this.lanes[this.currentLane];
    }
  }

  jump() {
    if (this.isJumping || this.isDucking) return;
    this.isJumping = true;
    
    this.scene.sound.play('sfx-jump', { volume: 0.5 });
    
    // Jump visually logic
    this.scene.tweens.add({
      targets: this,
      y: this.y - 150, // Jump height
      duration: 300,
      yoyo: true,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isJumping = false;
      }
    });
  }

  duck() {
    if (this.isJumping || this.isDucking) return;
    this.isDucking = true;
    
    // Duck duration
    this.scene.time.delayedCall(800, () => {
      this.isDucking = false;
    });
  }

  hit() {
    this.setTexture('lomasha-fall');
    this.stop();
  }
}
