const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');

let playerX = 180;
let speed = 2;
let obstacles = [];
let score = 0;
let level = 1;
let gameInterval;

// -------- Web Audio для звуков --------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playPointSound(){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'sine';
  osc.frequency.value = 800;
  gain.gain.value = 0.2;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playHitSound(){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = 'square';
  osc.frequency.value = 200;
  gain.gain.value = 0.3;
  osc.start();
  osc.stop(audioCtx.currentTime + 0.3);
}

// -------- управление игроком --------
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
    obs.style.background = `hsl(${Math.random()*360},70%,50%)`;

    let playerRect = player.getBoundingClientRect();
    let obsRect = obs.getBoundingClientRect();

    // столкновение
    if(!(playerRect.right < obsRect.left || 
         playerRect.left > obsRect.right || 
         playerRect.bottom < obsRect.top || 
         playerRect.top > obsRect.bottom)){
      playHitSound();
      gameOver();
    }

    // прошёл препятствие
    if(top > 600){
      gameArea.removeChild(obs);
      obstacles.splice(i,1);
      score++;
      scoreEl.textContent = score;
      playPointSound();

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
  document.getElementById('message').textContent = `💥 Игра окончена! Очки: ${score}`;
  setTimeout(()=> window.location.href="index.html", 3000);
}

function start() {
  gameInterval = setInterval(gameLoop, 20);
}

start();
