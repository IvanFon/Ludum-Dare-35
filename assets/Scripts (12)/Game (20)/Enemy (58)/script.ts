// Set gravity
Sup.ArcadePhysics2D.setGravity(0, -0.02);

// Kill Counter
var kills: number = 0;

class EnemyBehavior extends Sup.Behavior {
  
  // Variables
  speed: number = 0.2;
  jumpSpeed: number = 0.45;
  fight: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  jump: boolean = false;
  health: number = 100;
  id: number;
  dead: boolean = false;
  
  awake() {
    
    // Assign this actor a random ID
    this.id = Sup.Math.Random.integer(1, 100000);
    this.actor.setName("Enemy " + this.id);
    
    EnemyManager.addEnemy(this.id);
    Sup.log("===NEW ENEMY=== " + JSON.stringify(EnemyManager.getEnemy(this.id)));
  }

  update() {
    
    Sup.log("===ENEMY===" + JSON.stringify(EnemyManager.getEnemy(this.id)));
    
    // Sup.log("==ENEMY=== id: " + this.id + " : dead: " + this.dead + " : move left, right: " + this.moveLeft + this.moveRight);
    
    // Check if health is out and update kill counter
    // #NotAtAllHacky -Nova
    if(this.health <= 0 && this.health != 0.42424242) {
      
      this.dead = true;
      
      // Update Kill Counter
      Sup.getActor("Kill Counter").textRenderer.setText("Kills: " + ++kills);
      
      // Stop this statement from being true
      this.health = 0.42424242;
    }
    
    // Collide 
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    // Display health bar if less than 100 and greater than 0
    if(this.health < 100 && this.health > 0) {
      // Get health bar child actor to make sure it's
      // this enemies health bar.
      this.actor.getChild("Enemy Health Bar").setVisible(true);
    } else {
      
      //hide bar when not needed
      this.actor.getChild("Enemy Health Bar").setVisible(false);
    }
    
    // Check if health is between 0 and 100
    if(this.health >= 0 && this.health <= 100) {
      
      // Set my health bar value
      this.actor.getChild("Enemy Health Bar").spriteRenderer.setAnimation(String(Math.round(this.health)));
    }
    
    // AI
    // Check if we can turn
    if(EnemyManager.getTurning(this.id)) {
      
      // Check whether to move left or right
      if(this.actor.getX() < Sup.getActor("Player").getX()) {
        
        // Move right
        this.moveRight = true;
        this.moveLeft = false;
      } else {
        
        // Move elft
        this.moveRight = false;
        this.moveLeft = true;
      }
      
      // Don't allow turning
      EnemyManager.setTurning(this.id, false);
      
      // Set a turning timeout for half a second
      Sup.setTimeout(500, function() {
        
        // Allow turning
        EnemyManager.setTurning(this.id, true);
      });
    }
    
    // Check whether to jump
    if(this.actor.arcadeBody2D.getTouches().right || this.actor.arcadeBody2D.getTouches().left) {
      
      // Jump
      this.jump = true;
    } else {
      
      // Don't jump
      this.jump = false;
    }
    
    // Check if I'm being attacked
    // This means player is touching me and attack key is down
    if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) && Sup.Input.isKeyDown("SPACE") && !this.dead) {
      
      // Check if player is facing me
      if(this.actor.getX() < Sup.getActor("Player").getX() && PlayerManager.getDirection() == "left") {
        
        // Take damage
        this.health -= 10;
      } else if(this.actor.getX() > Sup.getActor("Player").getX() && PlayerManager.getDirection() == "right") {
        
        // Take damage
        this.health -= 10;
      }
    }
    
    // Attack player if cooldown is over and touching player
    if(Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.getActor("Player").arcadeBody2D) && EnemyManager.getCanAttack(this.id)) {
      
      // Start attack animation
      this.actor.spriteRenderer.stopAnimation();
      this.actor.spriteRenderer.setAnimation("Attack");
      this.actor.spriteRenderer.playAnimation(false);
      
      // Don't allow attacking until cooldown
      EnemyManager.setCanAttack(this.id, false);
      
      // Set attack cooldown for 1 second
      Sup.setTimeout(1000, function() {
        
        // Allow attacking
        EnemyManager.setCanAttack(this.id, true);
      });
    }
    
    // Movement
    // Check if alive
    if(!this.dead) {
      
      // Get current speed
      let velocity = this.actor.arcadeBody2D.getVelocity();
      
      // Check if I should move left
      if(this.moveLeft) {
        
        // Set velocity to move left
        velocity.x = -this.speed;
        
        // Flip sprite
        this.actor.spriteRenderer.setHorizontalFlip(true);
        
        // Check if I should move right
      } else if(this.moveRight) {
        
        // Set velocity to move left
        velocity.x = this.speed;
        
        // Flip sprite
        this.actor.spriteRenderer.setHorizontalFlip(false);
        
        // Stop moving
      } else {
        
        // Set velocity to stop moving left and right
        velocity.x = 0;
        
        // We aren't moving left and right anymore
        this.moveLeft = false;
        this.moveRight = false;
      }
      
      // Check if we're touching the ground
      if(this.actor.arcadeBody2D.getTouches().bottom) {
        
        // Check if we should be jumping
        if(this.jump) {
          
          // Add velocity upwards
          velocity.y = this.jumpSpeed;
          
          // Switch to jump animation
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          
          // Play a different animation (fight, idle or run)
          if(this.fight) {
            
            // Switch to fighting animation
            this.actor.spriteRenderer.setAnimation("Attack");
            
            // We are now fighting
            this.fight = true;
          } else if (velocity.x === 0) {
            
            // Switch to idle animation
            this.actor.spriteRenderer.setAnimation("Idle");
            
            // We are now fighting
            this.fight = false;
          } else {
            
            // Switch to running animation
            this.actor.spriteRenderer.setAnimation("Run");
            
            // We are now fighting
            this.fight = false;
          }
        }
      } else {
        
        // Play jump or fall animation
        if(velocity.y >= 0) {
          
          // Switch to jump animation
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          
          // Switch to falling animation
          this.actor.spriteRenderer.setAnimation("Fall");
        }
      }
      
      // Set velocity
      this.actor.arcadeBody2D.setVelocity(velocity);
    } else {
      
      // Stop all movement
      this.actor.arcadeBody2D.setVelocity(0, 0);
      
      this.actor.spriteRenderer.stopAnimation();
      this.actor.spriteRenderer.setAnimation("Dead");
      this.actor.spriteRenderer.playAnimation(false);
      
      // Disable collisions
      this.actor.arcadeBody2D.setEnabled(false);
      
      // Set dead
      this.dead = true;
    }
  }
}
Sup.registerBehavior(EnemyBehavior);
