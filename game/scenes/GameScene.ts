import Phaser from 'phaser';
import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Collectible from '../entities/Collectible';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private lanes: number[] = [100, 200, 300];
  
  // Game state
  public gpa: number = 2.50;
  public gameSpeed: number = 300;
  public score: number = 0;
  private isGameOver: boolean = false;
  private hasWon: boolean = false;
  
  // Groups
  private obstacles!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  
  // UI
  private gpaText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  
  private spawnTimer: number = 0;
  private sparkles!: Phaser.GameObjects.Particles.ParticleEmitter;
  
  private bg!: Phaser.GameObjects.TileSprite;
  private bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');
  }

  create() {
    this.gpa = 2.50;
    this.gameSpeed = 250; // Medium start
    this.isGameOver = false;
    this.hasWon = false;
    
    // Play BGM
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.3 });
    this.bgm.play();
    
    // Add scrolling background (seamless)
    this.bg = this.add.tileSprite(200, 400, 400, 800, 'bg-seamless');
    // Lighten it slightly so characters pop in a relaxing way
    this.bg.setTint(0xdddddd);
    
    // Setup Particles
    this.sparkles = this.add.particles(0, 0, 'icon-brain', {
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: 100,
      lifespan: 800,
      blendMode: 'ADD',
      emitting: false
    });
    this.sparkles.setDepth(20);

    this.player = new Player(this, 200, 650);

    this.obstacles = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle as any, undefined, this);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem as any, undefined, this);

    // GPA UI Panel
    const gpaBg = this.add.graphics();
    gpaBg.fillStyle(0x000000, 0.7);
    gpaBg.fillRoundedRect(10, 10, 200, 50, 15);
    gpaBg.setDepth(99);

    this.gpaText = this.add.text(25, 20, `GPA: ${this.gpa.toFixed(2)}`, {
      fontSize: '28px',
      color: '#ffffff',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.gpaText.setDepth(100);

    this.messageText = this.add.text(200, 300, '', {
      fontSize: '28px',
      color: '#ffcc00',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 6,
      align: 'center'
    }).setOrigin(0.5).setDepth(100);

    this.setupControls();
  }

  setupControls() {
    if (this.input.keyboard) {
      this.input.keyboard.on('keydown-LEFT', () => this.player.moveLeft());
      this.input.keyboard.on('keydown-A', () => this.player.moveLeft());
      this.input.keyboard.on('keydown-RIGHT', () => this.player.moveRight());
      this.input.keyboard.on('keydown-D', () => this.player.moveRight());
      this.input.keyboard.on('keydown-UP', () => this.player.jump());
      this.input.keyboard.on('keydown-W', () => this.player.jump());
      this.input.keyboard.on('keydown-SPACE', () => this.player.jump());
      this.input.keyboard.on('keydown-DOWN', () => this.player.duck());
      this.input.keyboard.on('keydown-S', () => this.player.duck());
    }

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const swipeTime = pointer.upTime - pointer.downTime;
      const swipe = new Phaser.Math.Vector2(pointer.upX - pointer.downX, pointer.upY - pointer.downY);
      
      if (swipeTime < 1000 && swipe.length() > 30) {
        swipe.normalize();
        if (Math.abs(swipe.x) > Math.abs(swipe.y)) {
          if (swipe.x > 0) this.player.moveRight();
          else this.player.moveLeft();
        } else {
          if (swipe.y < 0) this.player.jump();
          else this.player.duck();
        }
      }
    });
  }

  spawnEntity() {
    const lane = Phaser.Math.Between(0, 2);
    const x = this.lanes[lane];
    
    // Medium mode: 60% Collectibles, 40% Obstacles
    const isObstacle = Phaser.Math.Between(0, 100) < 40; 
    
    if (isObstacle) {
      const type = Phaser.Math.Between(1, 3);
      const obs = new Obstacle(this, x, -50, type);
      this.obstacles.add(obs);
    } else {
      const types = ['Note', 'Note', 'Book', 'Brain', 'Coffee'];
      const type = Phaser.Utils.Array.GetRandom(types);
      const col = new Collectible(this, x, -50, type);
      this.collectibles.add(col);
    }
  }

  hitObstacle(player: Player, obstacle: Obstacle) {
    if (this.isGameOver) return;
    
    // Simple jump dodging logic - if player is jumping, they pass over
    if (player.isJumping) return;
    
    this.sound.play('sfx-hit');
    
    this.gpa -= obstacle.gpaPenalty;
    this.updateGPA();
    this.showMessage(obstacle.message, '#ff4444');
    
    this.cameras.main.shake(200, 0.01);
    obstacle.destroy();
    
    if (this.gpa < 2.0) {
      this.gameOver("GPA dropped too low!");
    }
  }

  collectItem(player: Player, item: Collectible) {
    if (this.isGameOver) return;
    
    this.sound.play('sfx-collect', { volume: 0.6 });
    this.sparkles.emitParticleAt(item.x, item.y, 8);
    
    if (item.collectibleType === 'Coffee') {
      this.showMessage("CAFFEINE MODE!", '#00ffff');
      this.gameSpeed += 50;
      this.time.delayedCall(5000, () => {
        this.gameSpeed -= 50;
      });
    } else {
      this.gpa += item.gpaBonus;
      this.updateGPA();
      this.showMessage(`+${item.gpaBonus.toFixed(2)} GPA`, '#44ff44');
    }
    
    item.destroy();
    
    if (this.gpa >= 4.0) {
      this.gpa = 4.0;
      this.updateGPA();
      if (!this.hasWon) {
        this.hasWon = true;
        this.triggerVictory();
      }
    }
  }

  triggerVictory() {
    this.sound.play('sfx-victory');
    this.sparkles.emitParticleAt(200, 400, 50); // Burst of particles
    
    // Show giant banner
    const banner = this.add.text(200, 300, '4.0 GPA!\nGRADUATED!', {
      fontSize: '48px',
      color: '#44ff44',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5).setDepth(200);
    
    // Animate banner
    this.tweens.add({
      targets: banner,
      scale: { from: 0.5, to: 1.1 },
      duration: 800,
      yoyo: true,
      hold: 1500,
      onComplete: () => {
        this.tweens.add({
          targets: banner,
          alpha: 0,
          y: 200,
          duration: 1000,
          onComplete: () => banner.destroy()
        });
      }
    });
  }

  updateGPA() {
    this.gpaText.setText(`GPA: ${this.gpa.toFixed(2)}`);
    if (this.gpa < 2.5) this.gpaText.setColor('#ff4444');
    else if (this.gpa > 3.5) this.gpaText.setColor('#44ff44');
    else this.gpaText.setColor('#ffffff');
  }

  showMessage(text: string, color: string) {
    this.messageText.setText(text);
    this.messageText.setColor(color);
    this.messageText.setAlpha(1);
    
    this.tweens.add({
      targets: this.messageText,
      alpha: 0,
      y: this.messageText.y - 50,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        this.messageText.y = 400; // reset
      }
    });
  }

  gameOver(reason: string) {
    this.isGameOver = true;
    if (this.bgm) this.bgm.stop();
    
    this.player.hit();
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { gpa: this.gpa, reason: reason });
    });
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;
    
    this.bg.tilePositionY -= this.gameSpeed * (delta / 1000);

    this.player.update(time, delta);
    
    this.score += delta * 0.01;
    this.gameSpeed += delta * 0.002; // Medium scaling
    
    this.spawnTimer += delta;
    if (this.spawnTimer > 180000 / this.gameSpeed) { // Spawn slightly slower
      this.spawnEntity();
      this.spawnTimer = 0;
    }
    
    this.obstacles.getChildren().forEach(child => child.update(time, delta));
    this.collectibles.getChildren().forEach(child => child.update(time, delta));
  }
}
