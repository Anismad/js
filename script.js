// Светофор: красный -> красный+жёлтый -> зелёный -> мигающий зелёный -> жёлтый -> ...

const lamps = {
  red: document.querySelector('.lamp.red'),
  yellow: document.querySelector('.lamp.yellow'),
  green: document.querySelector('.lamp.green'),
};
const timerEl = document.getElementById('timer');

// Фазы цикла: какие лампы горят, сколько секунд, мигает ли
const phases = [
  { on: ['red'], duration: 5 },
  { on: ['red', 'yellow'], duration: 2 },
  { on: ['green'], duration: 5 },
  { on: ['green'], duration: 3, blink: true },
  { on: ['yellow'], duration: 2 },
];

let phaseIndex = 0;
let secondsLeft = 0;
let tickTimer = null;
let blinkTimer = null;

function setLamps(colors) {
  for (const [color, el] of Object.entries(lamps)) {
    el.classList.toggle('on', colors.includes(color));
  }
}

function stopBlink() {
  clearInterval(blinkTimer);
  blinkTimer = null;
}

function startBlink(colors) {
  stopBlink();
  let visible = true;
  setLamps(colors);
  blinkTimer = setInterval(() => {
    visible = !visible;
    setLamps(visible ? colors : []);
  }, 500);
}

function showPhase() {
  const phase = phases[phaseIndex];
  secondsLeft = phase.duration;
  timerEl.textContent = secondsLeft;

  if (phase.blink) {
    startBlink(phase.on);
  } else {
    stopBlink();
    setLamps(phase.on);
  }
}

function tick() {
  secondsLeft--;
  if (secondsLeft <= 0) {
    phaseIndex = (phaseIndex + 1) % phases.length;
    showPhase();
  } else {
    timerEl.textContent = secondsLeft;
  }
}

function stop() {
  clearInterval(tickTimer);
  tickTimer = null;
  stopBlink();
}

function start() {
  stop();
  phaseIndex = 0;
  showPhase();
  tickTimer = setInterval(tick, 1000);
}

function nightMode() {
  stop();
  timerEl.textContent = '—';
  startBlink(['yellow']);
}

function manual(color) {
  stop();
  timerEl.textContent = '—';
  setLamps([color]);
}

document.getElementById('startBtn').addEventListener('click', start);
document.getElementById('stopBtn').addEventListener('click', () => {
  stop();
  setLamps([]);
  timerEl.textContent = '—';
});
document.getElementById('nightBtn').addEventListener('click', nightMode);

for (const [color, el] of Object.entries(lamps)) {
  el.addEventListener('click', () => manual(color));
}

start();
