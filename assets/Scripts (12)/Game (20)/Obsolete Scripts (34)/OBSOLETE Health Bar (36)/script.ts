class OBSOLETEHealthBarBehavior extends Sup.Behavior {
  update() {
    if(Sup.Input.isKeyDown("W") && PlayerManager.getHealth() < 100) {
      PlayerManager.setHealth(PlayerManager.getHealth() + 1);
    } else if(Sup.Input.isKeyDown("S") && PlayerManager.getHealth() > 0) {
      PlayerManager.setHealth(PlayerManager.getHealth() - 1);
    }
    
    if(Sup.Input.wasKeyJustPressed("F")) {
      PlayerManager.setHealth(100);
    } else if(Sup.Input.wasKeyJustPressed("E")) {
      PlayerManager.setHealth(0);
    } else if(Sup.Input.wasKeyJustPressed("H")) {
      PlayerManager.setHealth(50);
    }
    
    this.actor.spriteRenderer.setAnimation(String(PlayerManager.getHealth()));
  }
}
// Sup.registerBehavior(OBSOLETEHealthBarBehavior);
