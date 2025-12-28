const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const hitSound = document.getElementById('hitSound');
const pointSound = document.getElementById('pointSound');

let playerX = 180;
let speed = 2;
let obstacles = [];
let score = 0;
let level = 1;
let gameInterval;

document.addEventListener('keydown', (e) => {
  if(e.key === "ArrowLeft" && playerX > 0) playerX -= 20;
  if(e.key === "ArrowRight" && playerX < 360) playerX += 20;
  player.style.left = playerX + "px";
});

function createObstacle() {
  const obs = document.createElement('div');
  obs.classList.add('obstacle');
  obs.style.top = '0px';
  obs.style.left = Math.floor(Math.random()*9)*40 + "px";
  gameArea.appendChild(obs);
  obstacles.push(obs);
}

function updateObstacles() {
  for(let i = obstacles.length-1; i>=0; i--){
    let obs = obstacles[i];
    let top = parseInt(obs.style.top);
    top += speed;
    obs.style.top = top + 'px';
    obs.style.background = `hsl(${Math.random()*360},70%,50%)`; // красочные препятствия

    let playerRect = player.getBoundingClientRect();
    let obsRect = obs.getBoundingClientRect();

    if(!(playerRect.right < obsRect.left || 
         playerRect.left > obsRect.right || 
         playerRect.bottom < obsRect.top || 
         playerRect.top > obsRect.bottom)){
      hitSound.play();
      gameOver();
    }

    if(top > 600){
      gameArea.removeChild(obs);
      obstacles.splice(i,1);
      score++;
      scoreEl.textContent = score;
      pointSound.play();
      if(score % 5 === 0){
        speed += 0.5; 
        level++;
        levelEl.textContent = level;
      }
    }
  }
}

function gameLoop() {
  if(Math.random() < 0.02) createObstacle();
  updateObstacles();
}

function gameOver() {
  clearInterval(gameInterval);
  let highscore = localStorage.getItem('highscore') || 0;
  if(score > highscore) localStorage.setItem('highscore', score);
  document.getElementById('message').textContent = `💥 Игра окончена! Очки: ${score}`;
  setTimeout(()=> window.location.href="index.html", 3000);
}

function start() {
  gameInterval = setInterval(gameLoop, 20);
}

start();
