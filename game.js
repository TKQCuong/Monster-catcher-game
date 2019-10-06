let myAudio = document.createElement("audio");
myAudio.src = "/sound/bG-music.mp3";

let touchingMonster = document.createElement("audio");
touchingMonster.src = "/sound/touching-mon.mp3";

let canvas;
let ctx;
let score = 0;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 450;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;
let startTime = Date.now();
const SECONDS_PER_ROUND = 15;
let elapsedTime = 0;

function getAppState() {
  return JSON.parse(localStorage.getItem("scoreSaving")) || {
    currentHighScore: 0,
  };
}
function save(scoreSaving) {
  return localStorage.setItem('scoreSaving', JSON.stringify(scoreSaving));
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    bgReady = true;
  };
  bgImage.src = "images/new-bgimage.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    heroReady = true;
  };
  heroImage.src = "images/new-superman.png";
  monsterImage = new Image();
  monsterImage.onload = function () {
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
};
let heroX = canvas.width / 2;
let heroY = canvas.height / 2;

let monsterX = 100;
let monsterY = 100;

let keysDown = {};
function setupKeyboardListeners() {
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
};

function keySet() {
  if (38 in keysDown) { // Player is holding up key
    heroY -= 9;
  }
  if (40 in keysDown) { // Player is holding down key
    heroY += 9;
  }
  if (37 in keysDown) { // Player is holding left key
    heroX -= 9;
  }
  if (39 in keysDown) { // Player is holding right key
    heroX += 9;
  }
};

function heroMoveOffScreen () {
  if (heroX <= 0) {
    heroX = canvas.width - 10
  }
  // Hero going right off screen
  if (heroX >= canvas.width) {
    heroX = 0
  }
  // Hero going up off screen
  if (heroY <= 0) {
    heroY = canvas.height - 10
  }
  // Hero going down off screen
  if (heroY >= canvas.height) {
    heroY = 0
  }
};

function ifCatchMonster () {
  const heroHasCaughtMonster = heroX <= (monsterX + 22)
  && monsterX <= (heroX + 22)
  && heroY <= (monsterY + 22)
  && monsterY <= (heroY + 22)
  if (heroHasCaughtMonster) {
    touchingMonster.play();
    score += 1
    document.getElementById("score").innerHTML = score;
    monsterX = Math.floor(Math.random() * canvas.width - 10)
    monsterY = Math.floor(Math.random() * canvas.height - 10)

    const scoreSaving = getAppState();
    if (scoreSaving.currentHighScore < score) {
      scoreSaving.currentHighScore = score;
      save(scoreSaving)
    }
    if (scoreSaving.currentUser != document.getElementById("inputName").value) {
      scoreSaving.currentUser = document.getElementById("inputName").value;
      save(scoreSaving)
    }
    if(document.getElementById("inputName").value == 0) {
      scoreSaving.currentUser = 'Anomynous';
      save(scoreSaving)
    }
    document.getElementById('highScore').innerHTML = scoreSaving.currentHighScore;
    document.getElementById("currentName").innerHTML = scoreSaving.currentUser;
  }
};

let update = function () {
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedTime >= SECONDS_PER_ROUND) {
    return;
  }
  keySet()
  heroMoveOffScreen()
  ifCatchMonster()
};

var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  ctx.font = '20px Roboto'
  ctx.fillStyle = "#ff0000"
  let timeRunning = elapsedTime <= 15;
  if (timeRunning) {
    myAudio.play();
    ctx.fillText(`Time remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100);
    document.getElementById("timerSet").innerHTML = SECONDS_PER_ROUND - elapsedTime;
  }
  else {
    myAudio.pause();
    ctx.fillText("GAME OVER!!", 20, 100);
  }
};

var main = function () {
  render()
  requestAnimationFrame(main)
  update()
};

var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages()
setupKeyboardListeners()
main()