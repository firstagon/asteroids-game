const LASER_MAX = 10; //max number lasers on screen at once
const LASER_SPD = 500; //speed of lasers in px per sec
const LASER_DIST = 0.3; //max distance laser can travel as fraction of screen width
const LASER_EXPLODE_DUR = 0.1; //duration

function shootLaser() {
  // create the last laser obj
  if (ship.canShoot && ship.lasers.length < LASER_MAX) {
    ship.lasers.push({
      //from nose of the ship
      x: ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
      y: ship.y - (4 / 3) * ship.r * Math.sin(ship.a),
      xv: (LASER_SPD * Math.cos(ship.a)) / FPS,
      yv: (-LASER_SPD * Math.sin(ship.a)) / FPS,
      dist: 0,
      explodeTime: 0,
    });
  }
  // prevent future shooting
  ship.canShoot = false;
}

function drawLAsers() {
  for (i = 0; i < ship.lasers.length; i++) {
    if (ship.lasers[i].explodeTime == 0) {
      ctx.fillStyle = "salmon";
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, SHIP_SIZE / 15, 0, Math.PI * 2, false);
      ctx.fill();
    } else {
      // draw the explosion
      ctx.fillStyle = "orangered";
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.lasers[i].r * 0.75, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.fillStyle = "salmon";
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.lasers[i].r * 0.5, 0, Math.PI * 2, false);
      ctx.fill();

      ctx.fillStyle = "pink";
      ctx.beginPath();
      ctx.arc(ship.lasers[i].x, ship.lasers[i].y, ship.lasers[i].r * 0.25, 0, Math.PI * 2, false);
      ctx.fill();
    }
  }

  // detect laser hit on asteroids
  let ax, ay, ar, lx, ly;
  for (i = roids.length - 1; i >= 0; i--) {
    // grab asteroids properties
    ax = roids[i].x;
    ay = roids[i].y;
    ar = roids[i].r;

    // loop over the lasers
    for (j = ship.lasers.length - 1; j >= 0; j--) {
      lx = ship.lasers[j].x;
      ly = ship.lasers[j].y;

      // detect hits
      if (ship.lasers[j].explodeTime == 0 && distBetweenPoints(ax, ay, lx, ly) < ar) {
        // remove the laser
        // ship.lasers.splice(j, 1);

        // remove the asteroid vand activate the laser explosion
        // roids.splice(i, 1);
        destoyAsteroid(i);

        ship.lasers[j].explodeTime = Math.ceil(LASER_EXPLODE_DUR * FPS);

        break;
      }
    }
  }
}

function destoyAsteroid(index) {
  const x = roids[index].x;
  const y = roids[index].y;
  const r = roids[index].r;

  // split the asteroid in two if necessary
  if (r == Math.ceil(ROIDS_SIZE / 2)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 4)));
    score += ROIDS_PTS_LGE;
  } else if (r == Math.ceil(ROIDS_SIZE / 4)) {
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 8)));
    score += ROIDS_PTS_MED;
  } else {
    score += ROIDS_PTS_SML;
  }

  // destroy the asteroid
  roids.splice(index, 1);

  // new level when all asteroids are destroyed
  if (roids.length == 0) {
    level++;
    newLevel();
  }
}

function moveLasers() {
  for (i = ship.lasers.length - 1; i >= 0; i--) {
    // because of deleting array's lasers
    // check distance travelled
    if (ship.lasers[i].dist > LASER_DIST * canv.width) {
      ship.lasers.splice(i, 1);
      continue;
    }

    // handle the explosion
    if (ship.lasers[i].explodeTime > 0) {
      ship.lasers[i].explodeTime--;

      // destroy the laser after the duration is up
      if (ship.lasers[i].explodeTime == 0) {
        ship.lasers.splice(i, 1);
        continue;
      }
    } else {
      // move the laser
      ship.lasers[i].x += ship.lasers[i].xv;
      ship.lasers[i].y += ship.lasers[i].yv;

      // calculate the distanse travalled
      ship.lasers[i].dist += Math.sqrt(Math.pow(ship.lasers[i].xv, 2) + Math.pow(ship.lasers[i].yv, 2));
    }

    // handle edge of screens
    if (ship.lasers[i].x < 0) {
      ship.lasers[i].x = canv.width;
    } else if (ship.lasers[i].x > canv.width) {
      ship.lasers[i].x = 0;
    }

    if (ship.lasers[i].y < 0) {
      ship.lasers[i].y = canv.height;
    } else if (ship.lasers[i].y > canv.height) {
      ship.lasers[i].y = 0;
    }
  }
}
