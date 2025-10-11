class Die {
  static #icons = {
    1: 'dice-one',
    2: 'dice-two',
    3: 'dice-three',
    4: 'dice-four',
    5: 'dice-five',
    6: 'dice-six'
  };

  constructor() {
    this.currentRoll = 1;
  }

  roll() {
    this.currentRoll = Math.floor(Math.random() * 6) + 1;
    return this.currentRoll;
  }

  getIcon() {
    return `<i class="fa fa-2xl fa-${Die.#icons[this.currentRoll]}"></i>`;
  }
}

class Player {
  constructor(name, color, icon) {
    this.name = name;
    this.color = color;
    this.icon = icon;
    this.position = 0;
  }

  move(steps) {
    this.position += steps;
  }
}

// 🐍 Ladders & Snakes
const BOARD_TRANSFERS = {
  4: 25,
  13: 46,
  50: 69,
  62: 81,
  74: 92,
  22: 5,
  40: 3,
  43: 18,
  54: 31,
  66: 45,
  89: 53,
  95: 77,
  99: 41
};

const dice = new Die();
const diceElement = document.getElementById('dicePlaceholder');
const rollButton = document.getElementById('rollDiceButton');
const addButton = document.getElementById('addPlayerButton');
const resetButton = document.getElementById('resetButton');
const playerList = document.getElementById('playerList');
const nameInput = document.getElementById('playerNameInput');
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 74;
const colors = ['red', 'blue', 'green', 'yellow'];
const icons = ['🐍', '🐸', '🐱', '🐧'];
const players = [];
let activeIndex = 0;
let gameOver = false;

// 🧩 Get tile coordinates
function getTileCenter(pos) {
  if (pos < 1) pos = 1;
  if (pos > 100) pos = 100;
  const row = Math.floor((pos - 1) / 10);
  const col = (pos - 1) % 10;
  const y = (9 - row) * TILE_SIZE + TILE_SIZE / 2;
  const x = (row % 2 === 0)
    ? col * TILE_SIZE + TILE_SIZE / 2
    : (9 - col) * TILE_SIZE + TILE_SIZE / 2;
  return { x, y };
}

// 🎨 Draw players
function drawPlayers() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  players.forEach((p, i) => {
    const { x, y } = getTileCenter(p.position);
    const offset = i * 8 - (players.length - 1) * 4;
    ctx.beginPath();
    ctx.arc(x + offset, y + offset, 12, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.font = '18px Arial';
    ctx.fillText(p.icon, x - 8, y + 6);
  });
}

// 📋 Update player list (✅ updated to include Remove button)
function updatePlayerList() {
  playerList.innerHTML = players.map(
    (p, i) => `
    <li class="list-group-item d-flex justify-content-between align-items-center ${i === activeIndex ? 'active' : ''}">
      <span>${p.icon} <strong style="color:${p.color}">${p.name}</strong></span>
      <div>
        <span class="me-2">Pos: ${p.position}</span>
        <button class="btn btn-danger btn-sm remove-player" data-index="${i}">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    </li>`
  ).join('');

  // 🧹 Attach remove button events
  document.querySelectorAll('.remove-player').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      removePlayer(index);
    });
  });

  drawPlayers();
}

// 🗑️ Remove player function
function removePlayer(index) {
  const playerName = players[index].name;
  if (confirm(`Remove ${playerName} from the game?`)) {
    players.splice(index, 1);
    if (activeIndex >= players.length) activeIndex = 0;
    updatePlayerList();
    drawPlayers();
  }
}

// ✨ Smooth move animation
function moveStepByStep(player, steps, callback) {
  let currentStep = 0;
  const interval = setInterval(() => {
    if (currentStep < steps) {
      player.move(1);
      drawPlayers();
      updatePlayerList();
      currentStep++;
    } else {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 300);
}

// 🎲 Roll Dice
rollButton.addEventListener('click', () => {
  if (gameOver) return;
  if (players.length === 0) return alert('Add at least one player!');

  const player = players[activeIndex];
  const roll = dice.roll();
  diceElement.innerHTML = dice.getIcon();

  moveStepByStep(player, roll, () => {
    if (player.position > 100) player.position = 100;

    if (BOARD_TRANSFERS[player.position]) {
      const dest = BOARD_TRANSFERS[player.position];
      if (dest > player.position)
        alert(`🎉 ${player.name} climbs a ladder to ${dest}!`);
      else
        alert(`🐍 ${player.name} slides down to ${dest}!`);
      player.position = dest;
    }

    if (player.position === 100) {
      alert(`🏆 ${player.name} wins the game!`);
      gameOver = true;
      rollButton.disabled = true;
      diceElement.innerHTML = `<i class="fa fa-trophy fa-2xl text-warning"></i>`;
      return;
    }

    activeIndex = (activeIndex + 1) % players.length;
    updatePlayerList();
  });
});

// ➕ Add Player
addButton.addEventListener('click', () => {
  const name = nameInput.value.trim() || `Player ${players.length + 1}`;
  const color = colors[players.length % colors.length];
  const icon = icons[players.length % icons.length];
  if (players.length >= 4) return alert('Max 4 players!');
  players.push(new Player(name, color, icon));
  nameInput.value = '';
  updatePlayerList();
});

// 🔄 Reset Game
resetButton.addEventListener('click', resetGame);

function resetGame() {
  players.forEach(p => p.position = 0);
  activeIndex = 0;
  gameOver = false;
  rollButton.disabled = false;
  diceElement.innerHTML = `<i class="fa fa-2xl fa-dice"></i>`;
  drawPlayers();
  updatePlayerList();
}

// ✅ Preload 3 default players automatically
window.addEventListener("DOMContentLoaded", () => {
  const defaultPlayers = [
    new Player("Alice", "red", "🐍"),
    new Player("Bryan", "blue", "🐸"),
    new Player("Warren", "green", "🐱")
  ];
  players.push(...defaultPlayers);
  updatePlayerList();
});
