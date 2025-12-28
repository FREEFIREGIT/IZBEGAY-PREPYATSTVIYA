const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');

let playerX = 180;
let speed = 2;
let obstacles = [];
let bonuses = [];
let score = 0;
let level = 1;
let gameInterval;

// -------- Web Audio для звуков --------
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq, type="sine", duration=0.1, volume=0.2){
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playPointSound(){ playSound(800,"sine",0.1,0.2); }
function playHitSound(){ playSound(200,"square",0.3,0.3); }
function playBonusSound(){ playSound(1200,"triangle",0.15,0.25); }

// -------- управление игроком --------
document.addEventListener('keydown', (e) => {
  if(e.key === "ArrowLeft" && playerX > 0) playerX -= 20;
  if(e.key === "ArrowRight" && playerX < 360) playerX += 20;
  player.style.left = playerX + "px";
});

// -------- создание препятствий и бонусов --------
function createObstacle() {
  const obs = document.createElement('div');
  obs.classList.add('obstacle');
  obs.style.top = '0px';
  obs.style.left = Math.floor(Math.random()*9)*40 + "px";
  gameArea.appendChild(obs);
  obstacles.push(obs);
}

function createBonus() {
  const bonus = document.createElement('div');
  bonus.classList.add('bonus');
  bonus.style.top = '0px';
  bonus.style.left = Math.floor(Math.random()*9)*40 + "px";
  gameArea.appendChild(bonus);
  bonuses.push(bonus);
}

// -------- обновление объектов --------
function updateObstacles() {
  // Препятствия
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

  // Бонусы
  for(let i = bonuses.length-1; i>=0; i--){
    let bonus = bonuses[i];
    let top = parseInt(bonus.style.top);
    top += speed;
    bonus.style.top = top + 'px';

    let playerRect = player.getBoundingClientRect();
    let bonusRect = bonus.getBoundingClientRect();

    if(!(playerRect.right < bonusRect.left || 
         playerRect.left > bonusRect.right || 
         playerRect.bottom < bonusRect.top || 
         playerRect.top > bonusRect.bottom)){
      playBonusSound();
      score += 3; // бонус +3 очка
      scoreEl.textContent = score;
      gameArea.removeChild(bonus);
      bonuses.splice(i,1);
    }

    if(top > 600){
      gameArea.removeChild(bonus);
      bonuses.splice(i,1);
    }
  }
}

// -------- игровой цикл --------
function gameLoop() {
  if(Math.random() < 0.02) createObstacle();
  if(Math.random() < 0.005) createBonus(); // бонусы реже
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
