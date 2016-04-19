//gravity
Sup.ArcadePhysics2D.setGravity(0, -0.02);

class CharacterBehavior extends Sup.Behavior {
  //variables set to defaults
  speed: number = 0.3;
  jumpSpeed: number = 0.45;
  die: boolean = false;
  fight: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  jump = false;
  health: number = 100;

  awake() {
    
  }

  update() {
    // Collide
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    if(!this.die) {
      //gets speed
      let velocity = this.actor.arcadeBody2D.getVelocity();
      
      //movement
      if (this.moveLeft) {
        velocity.x = -this.speed;
        //flips sprite
        this.actor.spriteRenderer.setHorizontalFlip(true);
      } else if (this.moveRight) {
        velocity.x = this.speed;
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
      // plays die animation
      this.actor.arcadeBody2D.setVelocity(0, 0);
      this.actor.spriteRenderer.setAnimation("Die");
      
      // Only loop once
      var deathLoop = Sup.setInterval(100, function() {
        
        // Check if on final frame
        if(this.actor.spriteRenderer.getAnimationFrameIndex() == this.actor.spriteRenderer.getAnimationFrameCount()) {
          this.actor.spriteRenderer.stopAnimation();
          deathLoop = null;
        }
      });
    }
  }
}
Sup.registerBehavior(CharacterBehavior);
