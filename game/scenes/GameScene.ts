import Phaser from 'phaser';
import Player from '../entities/Player';
import Obstacle from '../entities/Obstacle';
import Collectible from '../entities/Collectible';

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private chaserSprite!: Phaser.GameObjects.Sprite;
  private lanes: number[] = [100, 200, 300];
  
  // Game state
  public distance: number = 100;
  public gameSpeed: number = 300;
  public score: number = 0;
  private isGameOver: boolean = false;
  
  // Groups
  private obstacles!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  
  // UI
  private distanceText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;
  
  private spawnTimer: number = 0;
  private sparkles!: Phaser.GameObjects.Particles.ParticleEmitter;
  
  private bg!: Phaser.GameObjects.TileSprite;
  private bgm!: Phaser.Sound.BaseSound;

  constructor() {
    super('GameScene');
  }

  create() {
    this.distance = 100;
    this.gameSpeed = 250; 
    this.score = 0;
    this.isGameOver = false;
    
    // Play BGM
    this.bgm = this.sound.add('bgm', { loop: true, volume: 0.3 });
    this.bgm.play();
    
    // Add scrolling background (seamless)
    this.bg = this.add.tileSprite(200, 400, 400, 800, 'bg-seamless');
    this.bg.setTint(0xffe0f0); // slightly pinkish/warm tint
    
    // Setup Particles
    this.sparkles = this.add.particles(0, 0, 'icon-shoes', {
      scale: { start: 0.2, end: 0 },
      alpha: { start: 1, end: 0 },
      speed: 100,
      lifespan: 800,
      blendMode: 'ADD',
      emitting: false
    });
    this.sparkles.setDepth(20);

    this.player = new Player(this, 200, 650);
    this.player.setDepth(20);

    this.chaserSprite = this.add.sprite(200, 900, 'chaser');
    this.chaserSprite.setScale(0.5);
    this.chaserSprite.setDepth(15);

    this.obstacles = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle as any, undefined, this);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem as any, undefined, this);

    // UI Panel
    const uiBg = this.add.graphics();
    uiBg.fillStyle(0x000000, 0.7);
    uiBg.fillRoundedRect(10, 10, 380, 80, 15);
    uiBg.setDepth(99);

    this.distanceText = this.add.text(25, 20, `Distance: ${Math.floor(this.distance)}m`, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.distanceText.setDepth(100);

    this.scoreText = this.add.text(25, 50, `Score: ${Math.floor(this.score)}`, {
      fontSize: '20px',
      color: '#ffcc00',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.scoreText.setDepth(100);

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
    
    // 50% Collectibles, 50% Obstacles
    const isObstacle = Phaser.Math.Between(0, 100) < 50; 
    
    if (isObstacle) {
      const type = Phaser.Math.Between(1, 2);
      const obs = new Obstacle(this, x, -50, type);
      this.obstacles.add(obs);
    } else {
      const types = ['Shoes', 'Shoes', 'Coffee'];
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
    
    this.distance -= obstacle.distancePenalty;
    this.updateUI();
    this.showMessage(obstacle.message, '#ff4444');
    
    this.cameras.main.shake(200, 0.01);
    obstacle.destroy();
    
    if (this.distance <= 0) {
      this.gameOver("You got married!");
    }
  }

  collectItem(player: Player, item: Collectible) {
    if (this.isGameOver) return;
    
    this.sound.play('sfx-collect', { volume: 0.6 });
    this.sparkles.emitParticleAt(item.x, item.y, 8);
    
    if (item.collectibleType === 'Coffee') {
      this.showMessage("SPEED BOOST!", '#00ffff');
      this.gameSpeed += 80;
      this.time.delayedCall(3000, () => {
        this.gameSpeed -= 80;
      });
    } else {
      this.distance += item.distanceBonus;
      if (this.distance > 100) this.distance = 100;
      this.updateUI();
      this.showMessage(`+${item.distanceBonus} Distance`, '#44ff44');
    }
    
    item.destroy();
  }

  updateUI() {
    this.distanceText.setText(`Distance: ${Math.floor(this.distance)}m`);
    this.scoreText.setText(`Score: ${Math.floor(this.score)}`);
    
    if (this.distance < 30) this.distanceText.setColor('#ff4444');
    else if (this.distance > 70) this.distanceText.setColor('#44ff44');
    else this.distanceText.setColor('#ffffff');
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
    this.distance = 0;
    if (this.bgm) this.bgm.stop();
    
    this.player.hit();
    
    // Make chaser reach the player
    this.tweens.add({
      targets: this.chaserSprite,
      y: this.player.y,
      x: this.player.x,
      duration: 500,
      ease: 'Power2'
    });
    
    this.time.delayedCall(1500, () => {
      this.scene.start('GameOverScene', { score: Math.floor(this.score), reason: reason });
    });
  }

  update(time: number, delta: number) {
    if (this.isGameOver) return;
    
    this.bg.tilePositionY -= this.gameSpeed * (delta / 1000);

    this.player.update(time, delta);
    
    this.score += delta * 0.01;
    this.gameSpeed += delta * 0.002;
    
    // Fat man constantly catching up
    this.distance -= delta * 0.005;
    this.updateUI();
    
    if (this.distance <= 0) {
      this.gameOver("He caught you!");
    }
    
    // Animate chaser position based on distance
    // distance 100 -> y = 900
    // distance 0 -> y = 650
    const targetY = 650 + (this.distance / 100) * 250;
    this.chaserSprite.y = Phaser.Math.Linear(this.chaserSprite.y, targetY, 0.1);
    
    // Chaser slowly follows player's lane
    this.chaserSprite.x = Phaser.Math.Linear(this.chaserSprite.x, this.player.x, 0.02);
    
    // Wiggle chaser to look like he's running
    this.chaserSprite.rotation = Math.sin(time / 100) * 0.1;
    
    this.spawnTimer += delta;
    if (this.spawnTimer > 150000 / this.gameSpeed) {
      this.spawnEntity();
      this.spawnTimer = 0;
    }
    
    this.obstacles.getChildren().forEach(child => child.update(time, delta));
    this.collectibles.getChildren().forEach(child => child.update(time, delta));
  }
}
