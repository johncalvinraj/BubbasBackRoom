function player_init() {


// start at beginning of tunnel
player = {
health: 7,
pitch: -0.13823007675794918,
sideMovement: 0,
straightMovement: 0,
x: -230,
y: 26,
yaw: -1.640840704496659,
z: -2
};

// center
// player = {
// health: 7,
// pitch: -0.13823007675794918,
// sideMovement: 0,
// straightMovement: 0,
// x: 0,
// y: 0,
// yaw: -1.640840704496659,
// z: 0
// };

  flashTimeRemaining = 0;
  isAirborne = false;
}

// use ray tracing to find collisions
function player_move(xChange, yChange, zChange) {
  
  let newX = player.x;
  let newY = player.y;
  let newZ = player.z;

  

  // y movement
  let yChangeAbs = MATH_ABS(yChange);
  let ySign = MATH_SIGN(yChange);
  for (let y=0; y<yChangeAbs+RAY_TRACE_INCREMENT; y+=RAY_TRACE_INCREMENT) {
    if (y > yChangeAbs) {
      y = yChangeAbs;
    }
    let block = world_getBlock(player.x, player.y + y*ySign, player.z);
    if (block) {
      upVelocity = 0;
      isAirborne = false;
      break;
    }
    else {
      newY = player.y + y*ySign;
    }
  }

  // x movement
  let xChangeAbs = MATH_ABS(xChange);
  let xSign = MATH_SIGN(xChange);
  for (let x=0; x<xChangeAbs+RAY_TRACE_INCREMENT; x+=RAY_TRACE_INCREMENT) {
    if (x > xChangeAbs) {
      x = xChangeAbs;
    }
    let block = world_getBlock(player.x + x*xSign, newY, player.z);
    if (block) {
      break;
    }
    else {
      newX = player.x + x*xSign;
    }
  }

  // z movement
  let zChangeAbs = MATH_ABS(zChange);
  let zSign = MATH_SIGN(zChange);
  for (let z=0; z<zChangeAbs+RAY_TRACE_INCREMENT; z+=RAY_TRACE_INCREMENT) {
    if (z > zChangeAbs) {
      z = zChangeAbs;
    }
    let block = world_getBlock(newX, newY, player.z + z*zSign);
    if (block) {
      break;
    }
    else {
      newZ = player.z + z*zSign;
    }
  }

  player.x = newX;
  player.y = newY;
  player.z = newZ;



  // let newX = player.x + xChange;
  // let newY = player.y + yChange;
  // let newZ = player.z + zChange;

  // let newPlayerBlockPos, newPlayerBlock;

  // // handle y movement
  // newPlayerBlockPos = world_getBlockPos(player.x, newY, player.z);
  // newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  // if (newPlayerBlock) {
  //   newY = player.y;
  //   upVelocity = 0;
  //   isAirborne = false;
  // }

  // // else {
  // //   newPlayerBlockPos = world_getBlockPos(player.x, newY+PLAYER_HEIGHT, player.z);
  // //   newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  // //   if (newPlayerBlock) {
  // //     newY = player.y;
  // //     upVelocity = 0;
  // //   }
  // // }

  // // handle x movement
  // newPlayerBlockPos = world_getBlockPos(newX, newY, player.z);
  // newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  // if (newPlayerBlock) {
  //   newX = player.x;
  // }

  // // handle z movement
  // newPlayerBlockPos = world_getBlockPos(newX, newY, newZ);
  // newPlayerBlock = world_getBlock(newPlayerBlockPos.x, newPlayerBlockPos.y, newPlayerBlockPos.z);
  // if (newPlayerBlock) {
  //   newZ = player.z;
  // }
 
  // player.x = newX;
  // player.y = newY;
  // player.z = newZ;
  
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
  // let blockBelow = world_getBlockBelow(player);

  // if (isAirborne || !blockBelow) {
  upVelocity += GRAVITY * elapsedTime / 1000;
  let distEachFrame = upVelocity * elapsedTime / 1000;
  player_move(0, distEachFrame, 0);  
  //}


  
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
      reloadTimeRemaining = RELOAD_SPEED;

      if (numBullets < 6) {
        numBullets++;
        soundEffects.play('reload');
      }

      

      if (numBullets === 6) {
        isReloading = false;
        
      }

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
  if (numBullets > 0) {
    isReloading = false;
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
  if (!isReloading && numBullets < 6) {
    isReloading = true;
    reloadTimeRemaining = RELOAD_SPEED;
  }
}
