let canvas;
let ctx;
let score = 0;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 410;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady;
let bgImage, heroImage, monsterImage;

let startTime = Date.now();
const SECONDS_PER_ROUND = 10;
let elapsedTime = 0;

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/new-bgimage.jpg";
  //HERO IMAGE
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/new-superman.png";
//MONSTER IMAGE
  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/monster.png";
}

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
}

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
}

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
}

function ifCatchMonster () {
  const heroHasCaughtMonster = heroX <= (monsterX + 22)
  && monsterX <= (heroX + 22)
  && heroY <= (monsterY + 22)
  && monsterY <= (heroY + 22)
  if (heroHasCaughtMonster) {
    score += 1
    document.getElementById("score").innerHTML = score;
    monsterX = Math.floor(Math.random() * canvas.width - 10)
    monsterY = Math.floor(Math.random() * canvas.height - 10)
    console.log('score', score)
  }
};

document.getElementById("startGame").click = function beginTime(){
  setTimeout(function update() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  if (elapsedTime >= SECONDS_PER_ROUND) {
    return;
  }
  keySet()
  heroMoveOffScreen()
  ifCatchMonster()
  }, 3000);
};



// let update = function () {

  
// };  

// document.getElementById("startGame").onclick = setTimeout(update, 5000);
  
// let recoredScore = JSON.parse(localStorage.getItem('Score'))
// document.getElementById("userScore").innerHTML = recoredScore["Cuong"];
// let myVar;
// function setBegin () {
//   myVar = setTimeout(render(), 3000);
// }
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
  let timeRunning = elapsedTime <= 10;
  // let timeDisplay = (SECONDS_PER_ROUND - elapsedTime)`, 20, 100);
  if (timeRunning) {
    ctx.fillText(`Time remaining: ${SECONDS_PER_ROUND - elapsedTime}`, 20, 100); 
  }
  else {
    ctx.fillText("GAME OVER!!", 20, 100);
  }
};

var main = function () {
  render();
  requestAnimationFrame(main); 
  beginTime()
};

// Cross-browser support for requestAnimationFrame.
// Safely ignore this line. It's mostly here for people with old web browsers.
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
loadImages()
setupKeyboardListeners()
main()

