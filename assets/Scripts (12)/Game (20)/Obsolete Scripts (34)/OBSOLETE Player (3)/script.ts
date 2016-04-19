/////////////////////////
//gravity
Sup.ArcadePhysics2D.setGravity(0, -0.02);
/////////////////////////

class OBSOLETEPlayerBehavior extends Sup.Behavior {
  //variables set to defaults
  shape = [false, false, false, false, false, false];
  timeLeft = [100,100,100,100,100,100];


  /////////////////////////
  //variables set to defaults
  speed: number = 0.3;
  jumpSpeed: number = 0.45;
  die: boolean = false;
  fight: boolean = false;
  moveLeft: boolean = false;
  moveRight: boolean = false;
  jump = false;
  health: number = 100;
  /////////////////////////
  

  //sets to first form
  awake() {
    this.actor.spriteRenderer.setColor(255,255,255);
    for(var i = 0; i < 6; i++) this.shape[i] = false;
    this.shape[0] = true;
  }

  update() {
    
    //stops when dead
    if(!this.die) {
      //checks if form change
      if(Sup.Input.wasKeyJustPressed("1")) {
        this.actor.spriteRenderer.setColor(255,255,255);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[0] = true;
      } else if(Sup.Input.wasKeyJustPressed("2")) {
        this.actor.spriteRenderer.setColor(0,200,100);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[1] = true;
      } else if(Sup.Input.wasKeyJustPressed("3")) {
        this.actor.spriteRenderer.setColor(255,0,0);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[2] = true;
      } else if(Sup.Input.wasKeyJustPressed("4")) {
        this.actor.spriteRenderer.setColor(0,255,0);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[3] = true;
      } else if(Sup.Input.wasKeyJustPressed("5")) {
        this.actor.spriteRenderer.setColor(0,0,255);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[4] = true;
      } else if(Sup.Input.wasKeyJustPressed("6")) {
        this.actor.spriteRenderer.setColor(150,0,100);
        for(var i = 0; i < 6; i++) this.shape[i] = false;
        this.shape[5] = true;
      }
      
      //counts timers up and down for different forms
      for(var i = 0; i < 6; i++) {
        if(this.shape[i]){
          this.timeLeft[i] -= .1;
          if(this.timeLeft[i] <= 0){
            this.timeLeft[i] = 0;
            this.die = true;
          }
        } else {
          if(this.timeLeft[i] < 100) {
            this.timeLeft[i] += .1;
          }
        }
      }
      
      //prints timers to screen TODO: replace this with bars
      Sup.getActor("1").textRenderer.setText(Math.round(this.timeLeft[0]));
      Sup.getActor("2").textRenderer.setText(Math.round(this.timeLeft[1]));
      Sup.getActor("3").textRenderer.setText(Math.round(this.timeLeft[2]));
      Sup.getActor("4").textRenderer.setText(Math.round(this.timeLeft[3]));
      Sup.getActor("5").textRenderer.setText(Math.round(this.timeLeft[4]));
      Sup.getActor("6").textRenderer.setText(Math.round(this.timeLeft[5]));
      
      //temp, death key
      if(Sup.Input.wasKeyJustPressed("K")) this.die = true;
      
      if(Sup.Input.isKeyDown("LEFT")) {
        this.moveLeft = true;
      } else if(Sup.Input.isKeyDown("RIGHT")) {
        this.moveRight = true;
      } else {
        this.moveLeft = false;
        this.moveRight = false;
      }
      if(Sup.Input.isKeyDown("SPACE")) {
        this.fight = true;
      } else {
        this.fight = false;
      }
      if(Sup.Input.wasKeyJustPressed("UP")) {
        this.jump = true;
      } else {
        this.jump = false;
      }
    }
    
    
    /////////////////////////
    // Collide
    Sup.ArcadePhysics2D.collides(this.actor.arcadeBody2D, Sup.ArcadePhysics2D.getAllBodies());
    Sup.log(Sup.ArcadePhysics2D.getAllBodies());
    
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
      
      // Only loop once - lol nope -Nova
      var deathLoop = Sup.setInterval(100, function() {
        
        // Check if on final frame
        if(this.actor.spriteRenderer.getAnimationFrameIndex() == this.actor.spriteRenderer.getAnimationFrameCount()) {
          this.actor.spriteRenderer.stopAnimation();
          Sup.clearInterval(deathLoop);
        }
      });
    }
    //////////////////////////////
    
  }
}
// Sup.registerBehavior(OBSOLETEPlayerBehavior);
