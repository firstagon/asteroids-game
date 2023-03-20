const SHOW_BOUNDING = false; // show or hide collision bounding
const SHIP_EXPLODE_DUR = 0.3; //duration of the ships explosion in sec

// const exploding = ship.explodeTime > 0; //if greater than 0 thsts mean the ship is exploding

const drawBounding = (exploding) => {
  if (SHOW_BOUNDING) {
    ctx.strokeStyle = "lime";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false);
    ctx.stroke();
  }

  //   check for asteroids collisions
  if (!exploding) {
    // only check when not blinking
    if (ship.blinkNum == 0 && !ship.dead) {
      for (i = 0; i < roids.length; i++) {
        if (distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) < ship.r + roids[i].r) {
          explodeShip();
          destoyAsteroid(i);
          break;
        }
      }
    }
  } else {
    // reduce the explode time
    ship.explodeTime--;
    // reset the ship after explode
    if (ship.explodeTime == 0) {
      lives--;
      if (lives == 0) {
        gameOver();
      } else {
        ship = newShip();
      }
    }
  }

  function explodeShip() {
    ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS);
  }
};
