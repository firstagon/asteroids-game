const TEXT_FADE_TIME = 2.5; //text fade time in sec
const TEXT_SIZE = 40; // text font height in px
const GAME_LIVES = 3; //starting num of lives
const SAVE_KEY_SCORE = "highscore"; //save key for local storage of high score

newGame();

function newGame() {
  level = 0;
  ship = newShip();
  score = 0;
  //get the high score from local storage
  const scoreStr = localStorage.getItem(SAVE_KEY_SCORE);
  if (scoreStr == null) {
    scoreHigh = 0;
  } else {
    scoreHigh = parseInt(scoreStr);
  }
  newLevel();
}

function newLevel() {
  text = "Level" + " " + (level + 1);
  textAlpha = 1.0;
  lives = GAME_LIVES;

  createAsteroidsBelt();
}

function gameOver() {
  // Todo game over
  ship.dead = true;
  text = " Game over";
  textAlpha = 1.0;
}

// draw the game text
function drawText() {
  if (textAlpha >= 0) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255,255,255, " + textAlpha + ")";
    ctx.font = "small-caps " + TEXT_SIZE + "px Mukta, sans-serif";
    ctx.fillText(text, canv.width / 2, canv.height * 0.75);
    textAlpha -= 1.0 / TEXT_FADE_TIME / FPS;
  } else if (ship.dead) {
    newGame();
  }
}

// draw the lives
function drawLives(exploding) {
  let lifeColour;
  for (i = 0; i < lives; i++) {
    lifeColour = exploding && i == lives - 1 ? "red" : "white";
    drawShip(SHIP_SIZE + i * SHIP_SIZE * 1.2, SHIP_SIZE, 0.5 * Math.PI, lifeColour);
  }
}

// draw the score

function drawScore() {
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = TEXT_SIZE + "px Mukta, sans-serif";
  ctx.fillText(score, canv.width - SHIP_SIZE / 2, SHIP_SIZE);

  // check high score
  if (score > scoreHigh) {
    scoreHigh = score;
    localStorage.setItem(SAVE_KEY_SCORE, scoreHigh);
  }

  // draw the high score
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "white";
  ctx.font = TEXT_SIZE + "px Mukta, sans-serif";
  ctx.fillText(scoreHigh, canv.width / 2, SHIP_SIZE);
}
