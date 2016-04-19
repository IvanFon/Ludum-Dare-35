namespace PlayerManager {
  
  var health: number = 100;
  var god: boolean = false;
  var attacking: boolean = false;
  var direction: string = "";
  var dead: boolean = false;
  var canShift: boolean = true;
  var damage: number = 10;
  
  // Get health
  export function getHealth() {
    
    return health;
  }
  
  // Set health
  export function setHealth(value: number) {
    
    health = value;
  }
  
  // Add health
  export function addHealth(value: number) {
    
    health += value;
  }
  
  // Get attacking
  export function getAttacking() {
    
    return attacking;
  }
  
  // Set godmode
  export function setGod(value: boolean) {
    
    god = value;
  }
  
  // Get godemode
  export function getGod(){
    
    return god;
  }
  
  
  // Set attacking
  export function setAttacking(value: boolean) {
    
    attacking = value;
  }
  
  // Get direction
  export function getDirection() {
    
    return direction;
  }
  
  // Set direction
  export function setDirection(value: string) {
    
    direction = value;
  }
  
  // Get dead
  export function getDead() {
    
    return dead;
  }
  
  // Set dead
  export function setDead(value: boolean) {
    
    dead = value;
  }
  
  // Get canShift
  export function getCanShift() {
    
    return canShift;
  }
  
  // Set canShift
  export function setCanShift(value: boolean) {
    
    canShift = value;
  }
  
  // Get damage
  export function getDamage() {
    
    return damage;
  }
  
  // Set damage
  export function setDamage(value: number) {
    
    damage = value;
  }
  
  // Take damage
  export function takeDamage(value: number) {
    
    health -= value;
  }
}