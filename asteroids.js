// set up asteroids
const ROIDS_NUM = 3; //starting num of asteroids
const ROIDS_PTS_LGE = 20; //points scored for a large asteroids
const ROIDS_PTS_MED = 50; //points scored for a medium asteroids
const ROIDS_PTS_SML = 100; //points scored for a small asteroids
const ROIDS_JAG = 0.4; //jaggedness of the asteroids (0 = none, 1 = lots)
const ROIDS_SIZE = 100; //starting size of asteroids in px
const ROIDS_SPEED = 50; //max starting speed of asteroids in px per sec
const ROIDS_VERT = 10; //average number of vertices on each asteroids
// const FPS = 30;

function createAsteroidsBelt() {
  roids = [];
  let x, y;
  for (let i = 0; i < ROIDS_NUM + level; i++) {
    do {
      x = Math.floor(Math.random() * canv.width);
      y = Math.floor(Math.random() * canv.height);
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
    roids.push(newAsteroid(x, y, Math.ceil(ROIDS_SIZE / 2)));
  }
}

// createAsteroidsBelt();

function distBetweenPoints(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function newAsteroid(x, y, r) {
  const lvlMult = 1 + 0.1 * level;
  const roid = {
    x: x,
    y: y,
    xv: ((Math.random() * ROIDS_SPEED * lvlMult) / FPS) * (Math.random() < 0.5 ? 1 : -1), //velocity
    yv: ((Math.random() * ROIDS_SPEED * lvlMult) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    r: r,
    a: Math.random() * Math.PI * 2, //in radians
    vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
    offs: [], //offset
  };
  //   create the vertex offset array
  for (i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
  }
  return roid;
}

// draw the asteroids
function drawAsteroidsBelt() {
  let x, y, r, a, vert, offs;
  for (let i = 0; i < roids.length; i++) {
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = SHIP_SIZE / 20;
    // get the asteroids properties
    x = roids[i].x;
    y = roids[i].y;
    r = roids[i].r;
    a = roids[i].a;
    vert = roids[i].vert;
    offs = roids[i].offs;

    // draw a path
    ctx.beginPath();
    ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a));
    // draw the polygon
    for (j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      );
    }
    ctx.closePath();
    ctx.stroke();
    // move the asteroid
    roids[i].x += roids[i].xv;
    roids[i].y += roids[i].yv;
    // handle edge of screen
    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = canv.width + roids[i].r;
    } else if (roids[i].x > canv.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r;
    }

    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = canv.height + roids[i].r;
    } else if (roids[i].y > canv.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r;
    }

    // showing bounding
    if (SHOW_BOUNDING) {
      ctx.strokeStyle = "lime";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.stroke();
    }
  }
}
