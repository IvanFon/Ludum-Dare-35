class OBSOLETEFramerateCounterBehavior extends Sup.Behavior {
  
  update() {
    
    // Update framerate
    this.actor.textRenderer.setText(Sup.Game.getFPS() + " FPS");
  }
}
// Sup.registerBehavior(OBSOLETEFramerateCounterBehavior);
