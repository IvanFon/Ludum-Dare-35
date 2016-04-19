var chars: number = 1;

var animationTimeout;

var shift;

class MenuBehavior extends Sup.Behavior {
  
  awake() {
    
    //wtf wtf wtf wtf wtf wtf wtf wtf
    chars++;
    chars++;
    Sup.getActor("Character").spriteRenderer.setSprite("Sprites/Game/Form3");
    Sup.getActor("Character").spriteRenderer.setAnimation("Idle");
    Sup.getActor("Character").spriteRenderer.setHorizontalFlip(true);
    chars++
    
    // Periodically shift characters
    shift = Sup.setInterval(5000, function() {
      
      //shifts characters
      chars++;
      //loops around
      if(chars > 3) {
        
        chars = 1;
      }
      
      // Show shift cloud
      Sup.getActor("Cloud").setVisible(true);
      Sup.getActor("Cloud").spriteRenderer.playAnimation(false);
      
      // Wait for third frame
    animationTimeout = Sup.setInterval(50, function() {
      
      if(Sup.getActor("Cloud").spriteRenderer.getAnimationFrameIndex() == 2) {
        
        switch(chars) {
          case 1:
            Sup.getActor("Character").spriteRenderer.setSprite("Sprites/Game/Form1");
            Sup.getActor("Character").spriteRenderer.setAnimation("Jump");
            Sup.getActor("Character").spriteRenderer.setHorizontalFlip(false);
            break;
          case 2:
            Sup.getActor("Character").spriteRenderer.setSprite("Sprites/Game/Form2");
            Sup.getActor("Character").spriteRenderer.setAnimation("Run");
            Sup.getActor("Character").spriteRenderer.setHorizontalFlip(false);
            break;
          case 3:
            Sup.getActor("Character").spriteRenderer.setSprite("Sprites/Game/Form2");
            Sup.getActor("Character").spriteRenderer.setAnimation("Run");
            Sup.getActor("Character").spriteRenderer.setHorizontalFlip(false);
            break;
          default:
            Sup.log("Uh oh.");
            break;
        }
        
        Sup.getActor("Cloud").spriteRenderer.playAnimation(false);
        
        // Hide cloud
        Sup.getActor("Cloud").setVisible(false);
        
        // Stop running this loop
        Sup.clearInterval(animationTimeout);
      }
    });
    
    // Hide cloud after 500ms
    Sup.setTimeout(600, function() {
      
      Sup.getActor("Cloud").setVisible(false);
      Sup.getActor("Cloud").spriteRenderer.stopAnimation();
    });
    });
  }
  
  update() {
    
    // Check if mouse button was pressed
    if(Sup.Input.wasMouseButtonJustPressed(0)) {
      
      
      // Tell Game Manager to start game
      GameManager.startGame();
      
      // Clear the character switch timeout
      Sup.clearTimeout(animationTimeout);
      Sup.clearTimeout(shift);
    }
  }
}
Sup.registerBehavior(MenuBehavior);
