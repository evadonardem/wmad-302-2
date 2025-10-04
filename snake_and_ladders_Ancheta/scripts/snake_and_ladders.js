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
        this.value = 1;
    }

    roll() {
        this.value = Math.floor(Math.random() * this.sides) + 1;
        return this.value;
    }

    getIcon() {
        return `<i class="fa fa-2xl fa-${Die.#sidesToIcon[this.value]}"></i>`;
    }
}

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 1;
        this.lastRoll = 0;
    }

    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }
}

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext("2d");

const dice = new Die(6);

const playerImages = {
    red: null,
    blue: null,
    green: null,
    yellow: null
};

// Board size for positioning
const size = canvas.width / 10;

// Ladders and Snakes
const ladders = {
    4: 25,
    13: 46,
    42: 63,
    50: 69,
    62: 81,
    74: 92
};

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

function getCoordinates(position) {
    let row = Math.floor((position - 1) / 10);
    let col = (row % 2 === 0)
        ? (position - 1) % 10
        : 9 - ((position - 1) % 10);

    let x = col * size;
    let y = (9 - row) * size;
    return { x, y };
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw players (colored circles)
    players.forEach((p, idx) => {
        let pos = getCoordinates(p.position);
        ctx.beginPath();
        ctx.arc(
            pos.x + size / 2 + (idx * 15) - 15,
            pos.y + size / 2,
            16,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.closePath();

        //show last roll number
        if (p.lastRoll > 0) {
            ctx.fillStyle = "white";
            ctx.font = "bold 14px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                p.lastRoll,
                pos.x + size / 2 + (idx * 15) - 15,
                pos.y + size / 2 + 5
            );
        }
    });
}

const colors = ['red', 'blue', 'green', 'yellow'];
let numPlayers = parseInt(prompt("How many players? (1-4): "), 10);
if (isNaN(numPlayers) || numPlayers < 1 || numPlayers > 4) numPlayers = 2;

let players = [];
for (let i = 0; i < numPlayers; i++) {
    let name = prompt(`Enter name for Player ${i + 1}:`, `Player ${i + 1}`);
    players.push(new Player(name, colors[i]));
}

let currentPlayerIndex = 0;

// Display current player
diceElement.innerHTML = `<b>${players[currentPlayerIndex].name}'s turn!</b>`;

rollDiceButton.addEventListener('click', () => {
    const player = players[currentPlayerIndex];
    const roll = dice.roll();
    player.lastRoll = roll;

    // Update dice icon
    diceElement.innerHTML = `${player.name} rolled ${dice.getIcon()}`;

    // Move player
    player.move(roll);

    // Ladder check
    if (ladders[player.position]) {
        player.position = ladders[player.position];
        alert(`${player.name} climbed a ladder to ${player.position}! 🪜`);
    }

    // Snake check
    if (snakes[player.position]) {
        player.position = snakes[player.position];
        alert(`${player.name} got bitten by a snake to ${player.position}! 🐍`);
    }

    // Win condition
    if (player.position === 100) {
        alert(`${player.name} wins the game! 🎉`);
        diceElement.innerHTML = `<b>${player.name} wins the game! 🎉</b>`;
        rollDiceButton.disabled = true;
    } else {
        // Next player turn
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        diceElement.innerHTML += `<br>Next turn: <b>${players[currentPlayerIndex].name}</b>`;
    }

    drawBoard();
});

drawBoard();
