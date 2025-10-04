const snakes = {
  27: 5,
  40: 3,
  43: 18,
  54: 31,
  66: 45,
  89: 53,
  95: 77,
  99: 41
};

const ladders = {
  4: 25,
  13: 46,
  42: 63,
  50: 69,
  62: 81,
  74: 92
};

class Die {
  constructor(sides = 6) {
    this.sides = sides;
    this.lastRoll = null;
  }

  roll() {
    this.lastRoll = Math.floor(Math.random() * this.sides) + 1;
    return this.lastRoll;
  }

  getDisplay() {
    return `You rolled: ${this.lastRoll}`;
  }
}

class Player {
  constructor(name, color) {
    this.name = name;
    this.color = color;
    this.position = 0; // Start at 0
  }

  move(steps) {
    if (this.position === 100) return; // Stop if already won

    let newPosition = this.position + steps;
    if (newPosition > 100) newPosition = 100;

    // Check for ladder
    if (ladders[newPosition]) {
      console.log(`Landed on ladder at ${newPosition}, climbing to ${ladders[newPosition]}`);
      newPosition = ladders[newPosition];
    }
    // Check for snake
    else if (snakes[newPosition]) {
      console.log(`Landed on snake at ${newPosition}, sliding to ${snakes[newPosition]}`);
      newPosition = snakes[newPosition];
    }

    this.position = newPosition;

    // 🎉 Win condition
    if (this.position === 100) {
      setTimeout(() => {
        alert(`🎉✨ Congratulations Dexter! ✨🎉\nYou finally succeeded and reached 100!\nYou've conquered the snakes, climbed every ladder, and claimed victory like a true champion! 🏆💙`);
      }, 300);
    }
  }

  draw(ctx) {
    const size = 74;
    const row = Math.floor((this.position - 1) / 10);
    const col = (row % 2 === 0)
      ? (this.position - 1) % 10
      : 9 - ((this.position - 1) % 10);
    const x = col * size + size / 2;
    const y = 740 - (row * size + size / 2);

    if (this.position > 0) {
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dotCanvas = document.getElementById('dotCanvas');
const dotCtx = dotCanvas.getContext('2d');
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');

const dice = new Die();
const player = new Player("Dexter", "blue");

rollDiceButton.addEventListener('click', () => {
  const roll = dice.roll();
  diceElement.textContent = dice.getDisplay();
  player.move(roll);
  drawPlayer();
  startDotAnimation();
});

function drawPlayer() {
  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
  player.draw(gameCtx);
}

let angle = 0;
let animationId = null;

function drawDots() {
  dotCtx.clearRect(0, 0, dotCanvas.width, dotCanvas.height);
  const radius = 360;
  const centerX = dotCanvas.width / 2;
  const centerY = dotCanvas.height / 2;
  const dotCount = 40;

  for (let i = 0; i < dotCount; i++) {
    const theta = (2 * Math.PI / dotCount) * i + angle;
    const x = centerX + radius * Math.cos(theta);
    const y = centerY + radius * Math.sin(theta);

    dotCtx.beginPath();
    dotCtx.arc(x, y, 5, 0, 2 * Math.PI);
    dotCtx.fillStyle = 'orange';
    dotCtx.fill();
  }

  angle += 0.05;
  animationId = requestAnimationFrame(drawDots);
}

function startDotAnimation() {
  drawDots();
  setTimeout(() => cancelAnimationFrame(animationId), 2000);
}
