class Die {
    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six',
    };

    constructor(sides = 6) {
        this.sides = sides;
        this.currentValue = 1;
    }

    roll() {
        return new Promise(resolve => {
            let count = 0;
            const interval = setInterval(() => {
                this.currentValue = Math.floor(Math.random() * this.sides) + 1;
                diceElement.innerHTML = this.getIcon();
                diceElement.firstChild.classList.add("animate-roll");
                count++;
                if (count >= 10) {
                    clearInterval(interval);
                    diceElement.firstChild.classList.remove("animate-roll");
                    resolve(this.currentValue);
                }
            }, 100);
        });
    }

    getIcon() {
        const iconName = Die.#sidesToIcon[this.currentValue] || 'dice-one';
        return `<i class="fa fa-${iconName}"></i>`;
    }
}

class Player {
    constructor(name, icon) {
        this.name = name;
        const colors = ['red', 'blue', 'green', 'yellow'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.position = 0;
        this.icon = icon;
    }

    move(steps) {
        // Only move if it does not exceed 100
        if (this.position + steps <= 100) {
            this.position += steps;
            return true; // move happened
        }
        return false; // move blocked (overshoot)
    }
}

// Snakes and Ladders mapping
const snakesAndLadders = {
    // Ladders
    4: 25,
    13: 46,
    50: 69,
    42: 63,
    62: 81,
    74: 92,

    // Snakes
    40: 3,
    72: 5,
    43: 18,
    54: 31,
    66: 45,
    89: 53,
    95: 77,
    99: 41
};


// Canvas setup
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');
const boardSize = 10;
const squareSize = canvas.width / boardSize;

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'black';
    for (let i = 0; i <= boardSize; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * squareSize);
        ctx.lineTo(canvas.width, i * squareSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i * squareSize, 0);
        ctx.lineTo(i * squareSize, canvas.height);
        ctx.stroke();
    }
}

function drawPlayer(player) {
    if (player.position === 0) return;

    const row = Math.floor((player.position - 1) / boardSize);
    let col = (player.position - 1) % boardSize;

    // Reverse column on odd rows
    if (row % 2 === 1) {
        col = boardSize - 1 - col;
    }

    const x = col * squareSize + squareSize / 2;
    const y = canvas.height - (row * squareSize + squareSize / 2);

    // Draw circle background
    ctx.beginPath();
    ctx.arc(x, y, squareSize / 3, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw FontAwesome icon
    ctx.fillStyle = '#fff';
    ctx.font = `${squareSize / 1.8}px FontAwesome`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(player.icon, x, y);
}

function renderPlayers() {
    drawBoard();
    players.forEach(p => drawPlayer(p));
}

// Prompt for number of players (max 4)
let numPlayers = parseInt(prompt("Enter number of players (2-4):", "2"));
if (isNaN(numPlayers) || numPlayers < 2) numPlayers = 2;
if (numPlayers > 4) numPlayers = 4;

// Assign icons
const icons = ['\uf007', '\uf005', '\uf0f4', '\uf1b9'];
const players = [];
for (let i = 0; i < numPlayers; i++) {
    const name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
    players.push(new Player(name, icons[i]));
}

let currentPlayerIndex = 0;
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const currentPlayerName = document.getElementById('currentPlayerName');
const gameMessage = document.getElementById('gameMessage');
const dice = new Die(6);

renderPlayers();
currentPlayerName.textContent = `${players[currentPlayerIndex].name}'s Turn`;

rollDiceButton.addEventListener('click', async () => {
    if (rollDiceButton.disabled) return;

    rollDiceButton.disabled = true; // 🔒 lock button during roll

    const currentPlayer = players[currentPlayerIndex];

    if (currentPlayer.position === 100) return;

    gameMessage.textContent = `Rolling... 🎲`;

    const roll = await dice.roll();

    // Try moving player
    const moved = currentPlayer.move(roll);
    renderPlayers();

    if (!moved) {
        // Overshoot bounce
        diceElement.style.transform = 'translateY(-20px)';
        setTimeout(() => { diceElement.style.transform = 'translateY(0)'; }, 300);
        gameMessage.textContent = `${currentPlayer.name} cannot move ${roll} steps (needs exact 100)!`;
    } else {
        // Check for snake or ladder
        if (snakesAndLadders[currentPlayer.position]) {
            const oldPos = currentPlayer.position;
            currentPlayer.position = snakesAndLadders[oldPos];
            renderPlayers();

            if (currentPlayer.position > oldPos) {
                gameMessage.textContent = `${currentPlayer.name} climbed a ladder! 🪜`;
            } else {
                gameMessage.textContent = `${currentPlayer.name} got bitten by a snake! 🐍`;
            }
        } else {
            gameMessage.textContent = `${currentPlayer.name} moved ${roll} steps!`;
        }
    }

    // Winner check
    if (currentPlayer.position === 100) {
        currentPlayerName.textContent = `${currentPlayer.name} Wins! 🏆`;
        gameMessage.textContent = "";
        rollDiceButton.disabled = true; // stay locked
        return;
    }

    // Next player
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    currentPlayerName.textContent = `${players[currentPlayerIndex].name}'s Turn`;

    rollDiceButton.disabled = false; // 🔓 unlock after move finishes
});