// Set gravity
Sup.ArcadePhysics2D.setGravity(0, -0.02);

class PlayerBehavior extends Sup.Behavior {
  
  // Setup variables
  shapes: number = 1;
  timeLeft: Array<number> = [];
  speed: number = 0.3;
  jumpSpeed: number = 0.45;
  die: boolean = false;
  fight: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  jump: boolean = false;
  health: number = 100;

  //initial settings
  awake() {
    
    // Set form
    this.actor.spriteRenderer.setSprite("Sprites/Game/Form1");
    
    // Fill timeLeft arrays
    for(var i = 0; i < 6; i++) {
      
      // Add item to timeLeft
      this.timeLeft.push(100);
    }
    
    // Set first shape to be active
    this.shapes = 1;
  }

  // Set to a specific form
  setForm(form: number) {
    
    // Set a cooldown on shapeshifting
    PlayerManager.setCanShift(false);
    
    // Wait 1000 seconds
    Sup.setTimeout(1000, function() {
      
      // Allow player to shift again
      PlayerManager.setCanShift(true);
    });
    
    // Set current shape
    this.shapes = form;
    
    // Show cloud
    Sup.getActor("cloudShift").setVisible(true);
    Sup.getActor("cloudShift").spriteRenderer.stopAnimation();
    Sup.getActor("cloudShift").spriteRenderer.setAnimation("Shift");
    Sup.getActor("cloudShift").spriteRenderer.playAnimation(false);
    
    // Wait for third frame
    var animationTimeout = Sup.setInterval(50, function() {
      
      if(Sup.getActor("cloudShift").spriteRenderer.getAnimationFrameIndex() == 2) {
        
        // Change form
        Sup.getActor("Player").spriteRenderer.setSprite("Sprites/Game/Form" + String(form));
        
        // Stop running this loop
        Sup.clearInterval(animationTimeout);
      }
    });
    
    // Hide cloud after 500ms
    Sup.setTimeout(600, function() {
      
      Sup.getActor("cloudShift").setVisible(false);
      Sup.getActor("cloudShift").spriteRenderer.stopAnimation();
    });
    
    // Form specific attributes
    switch(form) {
      case 1:
        // Balanced form
        this.speed = 0.3;
        PlayerManager.setDamage(10);
        break;
      case 2:
        // Attack form
        this.speed = 0.15;
        PlayerManager.setDamage(20);
        break;
      case 3:
        // Agility form
        this.speed = 0.5;
        PlayerManager.setDamage(7);
        break;
    }
  }

  //Main repeat loop
  update() {
    
    // Collide with stuff
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    
    //check if dead
    if(PlayerManager.getHealth() <= 0) {
      this.die = true;
    }
    
    // Display health
    Sup.getActor("Health Bar").spriteRenderer.setAnimation(String(Math.round(PlayerManager.getHealth())));
    
    // Don't do anything if dead
    if(!this.die) {
      
      // Check if we can shapeshift
      if(PlayerManager.getCanShift()) {
        
        // Check if form should change
        if(Sup.Input.wasKeyJustPressed("1") && this.shapes != 1) {
          
          // Change form
          this.setForm(1);
          
        } else if(Sup.Input.wasKeyJustPressed("2") && this.shapes != 2) {
         
          // Change form
          this.setForm(2);
        } else if(Sup.Input.wasKeyJustPressed("3") && this.shapes != 3) {
          
          // Change form
          this.setForm(3);
        }/* else if(Sup.Input.wasKeyJustPressed("4") && this.shapes != 4) {
          
          // Change form
          this.setForm(4);
        } else if(Sup.Input.wasKeyJustPressed("5") && this.shapes != 5) {
          
          // Change form
          this.setForm(5);
        } else if(Sup.Input.wasKeyJustPressed("6") && this.shapes != 6) {
          
          // Change form
          this.setForm(6);
        }*/
      }
      
      // Loop through bars and add/remove time
      for(let i = 0; i < 6; i++) {
        
        // Check if current bar
        if(i + 1 == this.shapes) {
          
          // Check if time is over
          if(this.timeLeft[i] <= 0) {
            
            // Do damage to encourage shape shifting
            PlayerManager.takeDamage(0.25);
          } else {
            
            // Remove time
            this.timeLeft[i] -= 0.3;
          }
        } else {
          
          // Not current bar, add time if not full
          if(this.timeLeft[i] < 100) {
            
            // Add time
            this.timeLeft[i] += 0.2;
          }
          
        }
      }
      
      // SECTION: BARS
      // Print timers to screen as bars and make them all small
      for(let i = 1; i <= 6; i++) {
        
        let currentActor = Sup.getActor("Bar" + i);
        
        // Make bar small
        currentActor.setLocalScale(1, 1, 1);
        
        // Put them at their original position
        currentActor.setLocalX(-1);
        
        // Set bar amount
        currentActor.spriteRenderer.setAnimation(String(Math.round(this.timeLeft[i-1]))); //you can do this in a loop 0.o, im dumb -Nova
                                                                                                   // good programming -Ivan
      }                                                                                            //I tried, shut up scrub -Nova
                                                                                                   // Put a space after the double slahes, bigger scrub -Ivan
      // Stores the largest bar's actor
      var largeBar = Sup.getActor("Bar" + String(this.shapes));
      
      // Make the current bar larger
      largeBar.setLocalScaleX(2);
      largeBar.setLocalScaleY(2);
      
      // Move it to the correct position
      largeBar.setLocalX(0);
      
      // Movement
      // Left and right
      if(Sup.Input.isKeyDown("LEFT")) {
        
        this.moveLeft = true;
        this.moveRight = false;
        
        //oh the things i didnt know you could do -Nova     //and now apparently you can't do them so this is out of place -Nova
        // oh, the spaces that you really should put after the double slashes -Ivan
        //Never -Nova
      } else if(Sup.Input.isKeyDown("RIGHT")) {      
        
        this.moveRight = true; 
        this.moveLeft = false;
      } else {
        
        this.moveRight = false;
        this.moveLeft = false;
      }
      
      // Jumping
      if(Sup.Input.wasKeyJustPressed("UP")) {
        
        this.jump = true;
      } else {
        
        this.jump = false;
      }
      
      // Attack
      if(Sup.Input.isKeyDown("SPACE")) {
        
        this.fight = true;
      } else {
        
        this.fight = false;
      }
      
      // DEBUG
      // Suicide button
      if(Sup.Input.wasKeyJustPressed("K")) {
        
        this.die = true;
      }
      
      // Spawn enemy
      if(Sup.Input.wasKeyJustPressed("C")) {
        
        Sup.appendScene("Prefabs/Enemy");
      }
      
      // Godmode
      if(Sup.Input.wasKeyJustPressed("G")) {
      
        // Toggle godmode
        if(PlayerManager.getGod()) {
        
          Sup.log("Godmode off");
          PlayerManager.setGod(false);
          PlayerManager.setDead(false);
        } else {
        
          Sup.log("Godmode on");
          PlayerManager.setGod(true);
          PlayerManager.setDead(false);
      }
      
    }
    if(PlayerManager.getGod()) {
      
      PlayerManager.setHealth(100);
    }
      
      // Get speed
      let velocity = this.actor.arcadeBody2D.getVelocity();
      
      // Move left and right
      if(this.moveLeft) {
        
        // Set velocity to move
        velocity.x = -this.speed;
        
        // Flip in direction of movement
        this.actor.spriteRenderer.setHorizontalFlip(true);
        PlayerManager.setDirection("left");
      } else if(this.moveRight) {
        
        // Set velocity to move
        velocity.x = this.speed;
        
        // Flip in direction of movement
        this.actor.spriteRenderer.setHorizontalFlip(false);
        PlayerManager.setDirection("right");
      } else {
        
        // Not moving, clear velocity
        velocity.x = 0;
      }
      
      // Jump if touching ground and player presses up
      let touchingGround = this.actor.arcadeBody2D.getTouches().bottom;
      
      // Check if touching ground
      if(touchingGround) {
        
        // Check if player wants to jump
        if(this.jump) {
          
          // Set velocity to move
          velocity.y = this.jumpSpeed;
          
          // Play jumping sound
          Sup.Audio.playSound("Sounds/Jump", 1, {loop: false });
          
          // Switch to jumping animation
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          
          // Not jumping, perform other animations
          if(this.fight) {
            
            // Switch to attack animation
            this.actor.spriteRenderer.setAnimation("Attack");
            this.fight = true;
          } else if(velocity.x === 0) {
            
            // Not moving, switch to idle aniamtion
            this.actor.spriteRenderer.setAnimation("Idle");
            this.fight = false;
          } else {
            
            // Moving, switch to running animation
            this.actor.spriteRenderer.setAnimation("Run");
            this.fight = false;
          }
        }
      } else {
        
        // Not touching bottom, either jumping or falling
        if(velocity.y >= 0) {
          
          // Jumping, switch animaton
          this.actor.spriteRenderer.setAnimation("Jump");
        } else {
          
          // Falling, switch animation
          this.actor.spriteRenderer.setAnimation("Fall");
        }
      }
      
      // Set velocity
      this.actor.arcadeBody2D.setVelocity(velocity);
      
    // Player is dead
    } else {
      
      // Player is dead
      PlayerManager.setHealth(0);
      
      // Stop velocity
      this.actor.arcadeBody2D.setVelocity(0, 0);
      
      // Switch to death animation
      this.actor.spriteRenderer.stopAnimation();
      this.actor.spriteRenderer.setAnimation("Die");
      this.actor.spriteRenderer.playAnimation(false);
      
      // Fade out
      /*var fade = Sup.setInterval(100, function() {
        
        // Lower opacity
        Sup.getActor("Player").spriteRenderer.setOpacity(Sup.getActor("Player").spriteRenderer.getOpacity() - 0.05);
        
        // Check if we're done fading
        if(Sup.getActor("Player").spriteRenderer.getOpacity() <= 0) {
          
          // Stop fading
          Sup.clearInterval(fade);
        }
      });*/
      
      // Tell Player Manager that we're dead
      PlayerManager.setDead(true);
    }
    
    // Update attacking in player manager
    if(this.fight) {
      
      PlayerManager.setAttacking(true);
    } else {
      
      PlayerManager.setAttacking(false);
    }
  }
}
Sup.registerBehavior(PlayerBehavior);
