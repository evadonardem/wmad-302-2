class Die {
  static #sidesToIcon = {
    1: 'dice-one', 2: 'dice-two', 3: 'dice-three',
    4: 'dice-four', 5: 'dice-five', 6: 'dice-six'
  };
  constructor(sides = 6) { this.sides = sides; this.value = 1; }
  roll() { this.value = Math.floor(Math.random() * this.sides) + 1; return this.value; }
  getIcon() { return `<i class="fa fa-2xl fa-${Die.#sidesToIcon[this.value]}"></i>`; }
}
class Player {
  constructor(name, emoji, color) {
    this.name = name;
    this.emoji = emoji;
    this.color = color;
    this.position = 1;
    this.lastRoll = 0;
  }
  move(steps) {
    this.position += steps;
    if (this.position > 100) this.position = 100;
  }
  setPosition(p) { this.position = p; }
}
// Canvas & DOM references
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const colors = ['red','blue','green','orange']; // swatches
const die = new Die(6);
// snakes and ladders
const ladders = {4:25,13:46,42:63,50:69,62:81,74:92};
const snakes = {40:3,27:5,43:18,54:31,66:45,89:53,95:77,99:44};
const jumpMap = Object.assign({}, ladders, snakes);
// players state
let players = [];
let currentPlayerIndex = 0;
let gameStarted = false;
// board metrics
const CANVAS_SIZE = canvas.width;
const CELL_COUNT = 10;
const CELL_SIZE = CANVAS_SIZE / CELL_COUNT;
// compute canvas coordinates for a tile (1..100)
function getCoordinates(position) {
  if (position < 1) position = 1;
  if (position > 100) position = 100;
  const idx = position - 1;
  const row = Math.floor(idx / CELL_COUNT);
  const colInRow = idx % CELL_COUNT;
  const col = (row % 2 === 0) ? colInRow : (CELL_COUNT - 1 - colInRow);
  const x = col * CELL_SIZE + CELL_SIZE / 2;
  const y = CANVAS_SIZE - (row * CELL_SIZE + CELL_SIZE / 2);
  return { x, y };
}
// draw token with lastRoll shown
function drawTokenAt(x, y, color, lastRoll) {
  const radius = 14;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();
  ctx.closePath();
  if (lastRoll > 0) {
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(lastRoll), x, y + 1);
  }
}
// draw all tokens
function drawBoard() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  players.forEach((p, idx) => {
    const pos = getCoordinates(p.position);
    const offsetX = (idx - (players.length - 1) / 2) * 18;
    drawTokenAt(pos.x + offsetX, pos.y, p.color, p.lastRoll);
  });
}
// wiggle animation when player can't move
function animateNoMove(playerIndex) {
  return new Promise((resolve) => {
    const p = players[playerIndex];
    const pos = getCoordinates(p.position);
    const offsetX = (playerIndex - (players.length - 1) / 2) * 18;
    const startX = pos.x + offsetX;
    const startY = pos.y;
    const amplitude = 6;
    const duration = 240;
    const start = performance.now();
    function frame(now) {
      const elapsed = now - start;
      const t = elapsed / duration;
      if (t >= 1) { drawBoard(); resolve(); return; }
      const wiggleX = startX + Math.sin(t * Math.PI * 4) * amplitude * (1 - t);
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      players.forEach((pl, idx) => {
        if (idx === playerIndex) {
          drawTokenAt(wiggleX, startY, pl.color, pl.lastRoll);
        } else {
          const ppos = getCoordinates(pl.position);
          const offX = (idx - (players.length - 1) / 2) * 18;
          drawTokenAt(ppos.x + offX, ppos.y, pl.color, pl.lastRoll);
        }
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
// animate movement step-by-step (and handle jump landing)
function animateMove(playerIndex, steps) {
  return new Promise((resolve) => {
    const player = players[playerIndex];
    const startPos = player.position;
    const stepPositions = [];
    for (let i = 1; i <= steps; i++) stepPositions.push(startPos + i);
    if (stepPositions.length === 0) { resolve(); return; }
    let stepIndex = 0;
    const stepDuration = 160;

    function animateSingleStep() {
      const toPos = stepPositions[stepIndex];
      const fromPos = toPos - 1;
      const fromCoord = getCoordinates(fromPos);
      const toCoord = getCoordinates(toPos);
      const startTime = performance.now();

      function frame(now) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / stepDuration);
        const ix = fromCoord.x + (toCoord.x - fromCoord.x) * t;
        const iy = fromCoord.y + (toCoord.y - fromCoord.y) * t;
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        players.forEach((p, idx) => {
          if (idx === playerIndex) {
            drawTokenAt(ix, iy, p.color, p.lastRoll);
          } else {
            const pos = getCoordinates(p.position);
            const offsetX = (idx - (players.length - 1) / 2) * 18;
            drawTokenAt(pos.x + offsetX, pos.y, p.color, p.lastRoll);
          }
        });
        if (t < 1) {
          requestAnimationFrame(frame);
        } else {
          player.position = toPos;
          stepIndex++;
          if (stepIndex < stepPositions.length) {
            setTimeout(animateSingleStep, 60);
          } else {
            // landed: check for snake or ladder
            const landing = player.position;
            if (jumpMap[landing]) {
              // show the jump instantly (no extra animation for simplicity)
              player.position = jumpMap[landing];
            }
            drawBoard();
            resolve();
          }
        }
      }
      requestAnimationFrame(frame);
    }
    animateSingleStep();
  });
}
// ---------------- Game Initialization ----------------
let numPlayers = parseInt(prompt("How many players? (1-4): "), 10);
if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 4) numPlayers = 2;
players = [];
for (let i = 0; i < numPlayers; i++) {
  let name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
  if (!name) name = `Player ${i + 1}`;
  let emojiChoice = prompt(`Choose emoji for ${name} (type 1-4):\n1: 😀\n2: 😎\n3: 👽\n4: 🤖`, "1");
  let emoji = "😀";
  if (emojiChoice === "2") emoji = "😎";
  else if (emojiChoice === "3") emoji = "👽";
  else if (emojiChoice === "4") emoji = "🤖";
  players.push(new Player(name, emoji, colors[i % colors.length]));
}
currentPlayerIndex = 0;
gameStarted = true;
drawBoard();
updateTurnUI();
updatePlayerStats();
rollDiceButton.disabled = false;
// ---------------- UI Helpers ----------------
function updateTurnUI() {
  const el = document.getElementById('currentTurn');
  if (el) el.innerHTML = `Turn: <strong>${players[currentPlayerIndex].name}</strong> ${players[currentPlayerIndex].emoji}`;
}
// produce ranking (highest position = 1st) and render stats + medals + color swatch + 🎯 for current
function updatePlayerStats() {
  const statsDiv = document.getElementById('playerStats');
  if (!statsDiv) return;
  // create a shallow array with index so we can track original player objects
  const ranked = players
    .map((p, idx) => ({ idx, name: p.name, emoji: p.emoji, color: p.color, pos: p.position }))
    .sort((a, b) => b.pos - a.pos); // descending: highest position first
  // medal assignment
  const medals = ['🥇', '🥈', '🥉'];
  const lines = ranked.map((r, rankIndex) => {
    const medal = medals[rankIndex] || '🎖';
    const isCurrent = (r.idx === currentPlayerIndex);
    const currentMarker = isCurrent ? '🎯' : '';
    // color swatch markup
    const swatch = `<span class="color-swatch" style="background:${r.color};"></span>`;
    // Position wording (user wanted "Position")
    return `<div class="stat-line">${currentMarker}${medal} ${swatch}<strong>${r.name}</strong> ${r.emoji} - Position ${r.pos}</div>`;
  });
  statsDiv.innerHTML = lines.join('');
}
// ---------------- Dice Button Behavior ----------------
rollDiceButton.addEventListener('click', async () => {
  if (!gameStarted) return;
  const pIndex = currentPlayerIndex;
  const player = players[pIndex];
  const rollValue = die.roll();
  player.lastRoll = rollValue;
  // show dice immediately
  diceElement.innerHTML = die.getIcon();
  // if cannot move (would exceed 100)
  if (player.position + rollValue > 100) {
    await animateNoMove(pIndex);
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurnUI();
    drawBoard();
    updatePlayerStats();
    return;
  }
  // animate movement (this updates player.position at the end)
  await animateMove(pIndex, rollValue);
  // update dice icon (already set but ensure it matches final)
  diceElement.innerHTML = die.getIcon();
  // check win
  if (players[pIndex].position === 100) {
    const el = document.getElementById('currentTurn');
    if (el) el.innerHTML = `<strong>${players[pIndex].name}</strong> wins! 🏆`;
    rollDiceButton.disabled = true;
    gameStarted = false;
    drawBoard();
    updatePlayerStats();
    return;
  }
  // next player's turn
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateTurnUI();
  drawBoard();
  updatePlayerStats();
});
// initial render for safety
diceElement.innerHTML = die.getIcon();
updatePlayerStats();