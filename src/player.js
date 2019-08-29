function player_init() {


// start at beginning of tunnel
// player = {
// health: 7,
// pitch: -0.13823007675794918,
// sideMovement: 0,
// straightMovement: 0,
// x: -230,
// y: 26,
// yaw: -1.640840704496659,
// z: -2
// };

// center
player = {
health: 7,
pitch: -0.13823007675794918,
sideMovement: 0,
straightMovement: 0,
x: 0,
y: 0,
yaw: -1.640840704496659,
z: 0
};

  flashTimeRemaining = 0;
  isAirborne = false;
}

function player_move(xChange, yChange, zChange) {
  let newX = player.x + xChange;
  let newY = player.y + yChange;
  let newZ = player.z + zChange;

  let newPlayerBlockPos, newPlayerBlock;

  // handle y movement
  newPlayerBlockPos = world_getBlockPos(player.x, newY, player.z);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newY = player.y;
    upVelocity = 0;
    isAirborne = false;
  }
  else {
    newPlayerBlockPos = world_getBlockPos(player.x, newY+PLAYER_HEIGHT, player.z);
    newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
    if (newPlayerBlock) {
      newY = player.y;
      upVelocity = 0;
    }
  }

  // handle x movement
  newPlayerBlockPos = world_getBlockPos(newX, newY, player.z);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newX = player.x;
  }

  // handle z movement
  newPlayerBlockPos = world_getBlockPos(newX, newY, newZ);
  newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  if (newPlayerBlock) {
    newZ = player.z;
  }
 
  player.x = newX;
  player.y = newY;
  player.z = newZ;
  
}

function player_update() {
  // handle moving forward and backward
  if (player.straightMovement !== 0) {
    let direction = player.straightMovement === 1 ? -1 : 1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    player_move(distEachFrame * Math.sin(player.yaw), 0, distEachFrame * Math.cos(player.yaw));
  }
  
   // handle strafe
  if (player.sideMovement !== 0) {
    let direction = player.sideMovement === 1 ? 1 : -1;
    let distEachFrame = direction * PLAYER_SPEED * elapsedTime / 1000;
    player_move(distEachFrame * Math.sin(player.yaw + Math.PI / 2), 0, distEachFrame * Math.cos(player.yaw + Math.PI / 2));
  }

  if (player.straightMovement || player.sideMovement) {
    bobbleCounter += elapsedTime;
    bobble = BOBBLE_AMPLITUDE * MATH_SIN((bobbleCounter/1000) * BOBBLE_FREQUENCEY);
  }

  
  // handle gravity
  upVelocity += GRAVITY * elapsedTime / 1000;
  let distEachFrame = upVelocity * elapsedTime / 1000;

  player_move(0, distEachFrame, 0);
  
  if (flashTimeRemaining !== 0) {
    flashTimeRemaining -= elapsedTime;

    if (flashTimeRemaining < 0) {
      flashTimeRemaining = 0;
    }
  }

  // reloading
  if (isReloading) {
    reloadTimeRemaining -= elapsedTime;

    if (reloadTimeRemaining < 0) {
      isReloading = false;
      numBullets = 6;
      // second reload sound
      soundEffects.play('reload');

    }
  }


};

function player_jump() {
  if (!isAirborne) {
    upVelocity = JUMP_SPEED;
    isAirborne = true;
  }
}

function player_hurt() {
  if (!isHurting) {
    player.health -= 1;
    //a_soundEffect('player-hurt');
    soundEffects.play('monster-hit');
    setTimeout(function() {
      isHurting = false;
    }, PAIN_FLASH_DURATION);
  }
}

function player_fire() {
  if (numBullets > 0 && !isReloading) {
    gunBobbleX = 0;
    gunBobbleY = 0;
    flashTimeRemaining = FLASH_COOLDOWN;
    numBullets -= 1;

    // let hitMonster = monsters_getHit();
    // if (hitMonster >= 0) {
    //   monsters_hurt(hitMonster);
    // }

    let pixel = hit_getPixel(viewportWidth/2, viewportHeight/2);

    soundEffects.play('shoot');

    // monsters are in the red channel
    if (pixel[0] === 255) {
      // monster id is in the green channel
      let monsterId = pixel[1];

      monsters_hurt(monsterId);

      soundEffects.play('hit-monster');
    }
    else {
      //soundEffects.play('hit-object');
    }

    
    hud_gunRecoil();
  }
  else {
    soundEffects.play('empty-gun');
  }
}

function player_reload() {
  if (numBullets < 6 && !isReloading) {
    isReloading = true;
    reloadTimeRemaining = RELOAD_SPEED;
    soundEffects.play('reload');
  }
}
