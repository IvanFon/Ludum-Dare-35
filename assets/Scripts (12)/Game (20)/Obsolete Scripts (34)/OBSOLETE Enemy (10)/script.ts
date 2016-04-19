//gravity
Sup.ArcadePhysics2D.setGravity(0, -0.02);

// Whether to allow turning
var turning: boolean = true;

// Whether to attack
var canAttack: boolean = true;

class OBSOLETEEnemyBehavior extends Sup.Behavior {
  //variables set to defaults
  speed: number = 0.2;
  jumpSpeed: number = 0.45;
  die: boolean = false;
  fight: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  jump = false;
  health: number = 100;
  id: number;
  dead: boolean = false;

  awake() {
    
    // Assign this actor a random ID
    this.id = Sup.Math.Random.integer(1, 10000);
    this.actor.setName("Enemy " + this.id);
  }

  update() {
    
    // Display health if not 100
    if(this.health < 100) {
      
      Sup.getActor("Enemy Health Bar").setVisible(true);
    }
    Sup.getActor("Enemy Health Bar").spriteRenderer.setAnimation(String(Math.round(this.health)));
    
    if(Sup.Input.isKeyDown("O")) {
       this.health -= 1;
    }
    
    // Attack player
    if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) && canAttack) {
      
      // Attack player
      PlayerManager.takeDamage(10);
      
      // Set an attack cooldown
      canAttack = false;
      Sup.setTimeout(1000, function() {
        
        canAttack = true;
      });
    }
    
    // AI
    // Check if we can turn
    if(turning) {
      
      // Check whether to move left or right
      if(this.actor.getX() < Sup.getActor("Player").getX()) {
      
        // Move that way
        this.moveRight = true;
        this.moveLeft = false;
      
      } else {
      
        this.moveRight = false;
        this.moveLeft = true;
      }
      
      // Delay turning
      turning = false;
      
      Sup.setTimeout(250, function() {
        
        turning = true;
      });
    }
    
    // Check whether to jump
    if(this.actor.arcadeBody2D.getTouches().right || this.actor.arcadeBody2D.getTouches().left) {
      
      this.jump = true;
    } else {
      
      this.jump = false;
    }
    
    // Check if I'm being attacked
    if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) && Sup.Input.isKeyDown("SPACE")) {
      
      Sup.log(PlayerManager.getDirection());
      
      // Check if player is facing me
      if(this.actor.getX() < Sup.getActor("Player").getX() && PlayerManager.getDirection() == "left") {
        
        this.die = true;
      } else if(this.actor.getX() > Sup.getActor("Player").getX() && PlayerManager.getDirection() == "right") {
        
        this.die = true;
      }
    }
    
    // Collide
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    if(!this.die) {
      //gets speed
      let velocity = this.actor.arcadeBody2D.getVelocity();
      
      //movement
      if (this.moveLeft) {
        
        // Set velocity to move left
        velocity.x = -this.speed;
        
        // Flip sprite
        this.actor.spriteRenderer.setHorizontalFlip(true);
        
      } else if (this.moveRight) {
        
        // Set velocity to move left
        velocity.x = this.speed;
        
        // Flip sprite
        this.actor.spriteRenderer.setHorizontalFlip(false);

      } else {
        velocity.x = 0; this.moveLeft = false; this.moveRight = false;
      }

      // checks if character is on ground and jumps if player presses up
      let touchBottom = this.actor.arcadeBody2D.getTouches().bottom;
      if (touchBottom) {
        if (this.jump) {
          velocity.y = this.jumpSpeed;
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          // plays fight animation, idle animation or run animation
          if(this.fight) {
            this.actor.spriteRenderer.setAnimation("Attack");
            this.fight = true;
          } else if (velocity.x === 0) {
            this.actor.spriteRenderer.setAnimation("Idle");
            this.fight = false;
          } else {
            this.actor.spriteRenderer.setAnimation("Run");
            this.fight = false;
          }
        }
      } else {
        // plays jump animation or fall animation
        if (velocity.y >= 0) {
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          this.actor.spriteRenderer.setAnimation("Fall");
        }
      }

      // sets velocity
      this.actor.arcadeBody2D.setVelocity(velocity);
    } else {
      
      // Stop all movement
      this.actor.arcadeBody2D.setVelocity(0, 0);
      
      // Disable collisions
      this.actor.arcadeBody2D.setEnabled(false);
      
      // Set dead
      this.dead = true;
      
    }
    
    // Check if player is dead
    if(PlayerManager.getDead() && !this.dead) {
      
      // Switch to idle animation
      this.actor.spriteRenderer.setAnimation("Idle");
    }
  }
}
// Sup.registerBehavior(OBSOLETEEnemyBehavior);
