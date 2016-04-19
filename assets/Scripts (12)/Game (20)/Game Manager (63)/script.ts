namespace GameManager {
  
  // Kills
  var kills = 0;
  // Current wave
  var currentWave = 0;
  var spawned = 0;
  var spawnTimeout;
  
  export function startGame() {
    
    // Load game scebe
    Sup.loadScene("Scenes/Level");
    
    // Start looping music
    Sup.Audio.playSound("Music/Theme", 0.6, { loop: true });
    
    currentWave = 1;
    spawnTimeout = Sup.setTimeout(5000, function() {
      
      Sup.appendScene("Prefabs/Enemy");
    });
    
    // Start wave system
    var waveTimeout = Sup.setTimeout(50, function() {
      
      // Check if all guys spawned
      if(spawned == currentWave * 10) {
        
        // Check if all dead
        if(kills == currentWave * 10) {
          
          currentWave++;
          kills = 0;
          spawned = 0;
          Sup.clearInterval(spawnTimeout);
          spawnTimeout = Sup.setTimeout(5000, function() {
      
            Sup.appendScene("Prefabs/Enemy");
          });
        }
      }
  });
  }
  
  // Enemy kill
  export function addKill() {
    
    kills++;
  }
  }