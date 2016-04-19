namespace EnemyDeathManager {
  
  export function animateDeath(id: number) {
    
    // Switch to death animation
    Sup.getActor("Enemy " + id).spriteRenderer.stopAnimation();
    Sup.getActor("Enemy " + id).spriteRenderer.setAnimation("Die");
    Sup.getActor("Enemy " + id).spriteRenderer.playAnimation(false);
    
    // Wait x ms
    Sup.setTimeout(1000, function() {
      
      // Lay on ground dead
      Sup.getActor("Enemy " + id).spriteRenderer.setAnimation("Dead");
      Sup.getActor("Enemy " + id).arcadeBody2D.setEnabled(false);
    });
  }
}