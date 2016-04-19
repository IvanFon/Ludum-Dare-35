namespace EnemyManager {
  
  var enemyId = [];
  var enemyTurning = [];
  var enemycanAttack = [];
  
  // Add new enemy
  export function addEnemy(id: number) {
    
    enemyId.push(id);
    enemyTurning.push(true);
    enemycanAttack.push(true);
  }
  
  // Get data for an enemy
  export function getEnemy(id: number) {
    
    var result;
    
    // Search for enemy index
    return enemyId.forEach(function(val, index, array) {
      
      // Check if is enemy
      if(val == id) {
        Sup.log("====VAL====" + val);
        
        result = [enemyId[index], enemyTurning[index], enemycanAttack[index]];
      }
    });
    
    return result;
  }
  
  // Get turning
  export function getTurning(id: number) {
    
    var result;
    
    enemyId.forEach(function(val, index, array) {
      
      if(val == id) {
        
        result = enemyTurning[index];
      }
    });
    
    return result;
  }
  
  // Set turning
  export function setTurning(id: number, newValue: boolean) {
    
    enemyId.forEach(function(val, index, array) {
      
      if(val == id) {
        
        enemyTurning[index] == newValue;
      }
    });
  }
  
  // Get canAttack
  export function getCanAttack(id: number) {
    
    var result;
    
    return enemyId.forEach(function(val, index, array) {
      
      if(val == id) {
        
        result =  enemycanAttack[index];
      }
    });
    
    return result;
  }
  
  // Set canAttack
  export function setCanAttack(id: number, newValue: boolean) {
    
    enemyId.forEach(function(val, index, array) {
      
      if(val == id) {
        
        enemycanAttack[index] == newValue;
      }
    });
  }
}