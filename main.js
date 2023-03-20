const FPS = 30;
const FRICTION = 0.7; //friction coefficient of space (0 = no friction, 1 = lots of friction)
const TURN_SPEED = 360; //turn speed per second
const SHIP_THRUST = 5; //acceleration of the ship in px  per sec per sec
const SHIP_SIZE = 30; //ship height in px
const SHIP_BLINK_DUR = 0.1; //duration of the ships blinck during ivisibility in sec
const SHIP_INV_DUR = 3; //duration of the ships invisibility in sec

// set up game paramenters
let level, roids, ship, text, textAlpha, lives, score, scoreHigh;

//   @type {HTMLCanvasElement}
const canv = document.getElementById("gameCanvas");
var ctx = canv.getContext("2d");

//   set up the ship
ship = newShip();

function newShip() {
  return {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 2, //?radius of the ship
    a: (90 / 180) * Math.PI, //  angle (where look the ship) converting in rad bcs math dont work with degrees (to rad)
    blinkNum: Math.ceil(SHIP_INV_DUR / SHIP_BLINK_DUR),
    blinkTime: Math.ceil(SHIP_BLINK_DUR * FPS),
    canShoot: true,
    dead: false,
    lasers: [],
    rot: 0, //rotation
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
    explodeTime: 0,
  };
}

//   set up eventHandlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

// set up the game loop
setInterval(update, 1000 / FPS);

function keyDown(/** @type {keyboardEvent} **/ ev) {
  if (ship.dead) {
    return;
  }
  switch (ev.keyCode) {
    case 32: //push space bar
      shootLaser();
      break;
    case 37: //left arrow (rotate ship left)
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS;
      break;
    case 38: //up arrow (thrust the ship forward)
      ship.thrusting = true;
      break;
    case 39: //right arrow
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS;
      break;
  }
}

function keyUp(/** @type {keyboardEvent} **/ ev) {
  if (ship.dead) {
    return;
  }
  switch (ev.keyCode) {
    case 32: //push space bar (allow shooting again)
      ship.canShoot = true;
      break;
    case 37: //left arrow (stop rotate ship left)
      ship.rot = 0;
      break;
    case 38: //up arrow (stop thrust the ship forward)
      ship.thrusting = false;
      break;
    case 39: //right arrow stop rotating right
      ship.rot = 0;
      break;
  }
}

function update() {
  let blinkOn = ship.blinkNum % 2 == 0;
  // draw space
  const exploding = ship.explodeTime > 0; //if greater than 0 thsts mean the ship is exploding
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canv.width, canv.height);

  // thrust the ship
  if (ship.thrusting && !ship.dead) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS;
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS;
    //   draw the truster
    if (!exploding && blinkOn) {
      ctx.fillStyle = "red";
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = SHIP_SIZE / 10;
      ctx.beginPath();
      ctx.moveTo(
        //rear left
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
      );
      ctx.lineTo(
        //rear center behind the ship
        ship.x - ship.r * ((8 / 3) * Math.cos(ship.a)),
        ship.y + ship.r * ((8 / 3) * Math.sin(ship.a))
      );
      ctx.lineTo(
        //rear right
        ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
        ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS;
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS;
  }

  // drawing ship + exploding drawing
  if (!exploding) {
    if (blinkOn && !ship.dead) {
      drawShip(ship.x, ship.y, ship.a);
    }
    // handle blinking
    if (ship.blinkNum > 0) {
      // reduce the blick time
      ship.blinkTime--;

      // reduce the blicnk num
      if (ship.blinkTime == 0) {
        ship.blinkTime = Math.ceil(SHIP_BLINK_DUR * FPS);
        ship.blinkNum--;
      }
    }
  } else {
    // draw explosion
    ctx.fillStyle = "darkred";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.4, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "orange";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.9, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(ship.x, ship.y, ship.r * 0.6, 0, Math.PI * 2, false);
    ctx.fill();
  }

  // draw lasers
  drawLAsers();
  moveLasers();

  // centre dot
  ctx.fillStyle = "red";
  // ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);

  if (!exploding) {
    // rotate the ship
    ship.a = ship.a + ship.rot;

    // move the ship
    ship.x = ship.x + ship.thrust.x;
    ship.y = ship.y + ship.thrust.y;
  }

  // handle edge of screen
  //  on x axes
  if (ship.x < 0 - ship.r) {
    ship.x = canv.width + ship.r;
  } else if (ship.x > canv.width + ship.r) {
    ship.x = 0 - ship.r;
  }
  // on y axes
  if (ship.y < 0 - ship.r) {
    ship.y = canv.height + ship.r;
  } else if (ship.y > canv.height + ship.r) {
    ship.y = 0 - ship.r;
  }
  drawAsteroidsBelt();
  drawBounding(exploding);

  // draw the game text
  drawText();
  // draw the lives
  drawLives(exploding);

  drawScore();
}

// draw the ship
function drawShip(x, y, a, colour = "white") {
  // draw a triangular ship
  ctx.strokeStyle = colour;
  ctx.lineWidth = SHIP_SIZE / 20;
  ctx.beginPath();
  ctx.moveTo(
    //nose of the ship
    x + (4 / 3) * ship.r * Math.cos(a), // cos represents a horizontal
    y - (4 / 3) * ship.r * Math.sin(a) // vertical ships angle
  );
  ctx.lineTo(
    //rear left of the ship
    x - ship.r * ((2 / 3) * Math.cos(a) + Math.sin(a)), // cos represents a horizontal
    y + ship.r * ((2 / 3) * Math.sin(a) - Math.cos(a)) // vertical ships angle
  );
  ctx.lineTo(
    //rear right of the ship (bottom line)
    x - ship.r * ((2 / 3) * Math.cos(a) - Math.sin(a)), // cos represents a horizontal
    y + ship.r * ((2 / 3) * Math.sin(a) + Math.cos(a)) // vertical ships angle
  );
  ctx.closePath();
  ctx.stroke();
}
