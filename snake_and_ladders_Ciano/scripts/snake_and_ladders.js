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
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }

    getIcon(value) {
        const iconName = Die.#sidesToIcon[value] || `dice-${value}`;
        return `<i class="fa fa-2xl fa-${iconName}"></i>`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        const colors = ['red', 'blue', 'green', 'yellow'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.position = 1;
    }

    move(steps) {
        this.position += steps;
    }
}

// --- Game Setup ---
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

const players = [new Player("Alice"), new Player("Bob")];
let currentPlayerIndex = 0;

const canvas = document.querySelector("#boardPlaceholder canvas");
const ctx = canvas.getContext("2d");
const tileSize = 74;

function getCoordinates(position) {
    if (position < 1) position = 1;
    if (position > 100) position = 100;

    let row = Math.floor((position - 1) / 10);
    let col = (position - 1) % 10;

    if (row % 2 === 1) {
        col = 9 - col;
    }

    let x = col * tileSize + tileSize / 2;
    let y = 740 - (row * tileSize + tileSize / 2);
    return { x, y };
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    players.forEach((player) => {
        const { x, y } = getCoordinates(player.position);

        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(player.name[0], x, y);
    });
}

rollDiceButton.addEventListener("click", () => {
    const result = dice.roll();
    diceElement.innerHTML = dice.getIcon(result);

    const player = players[currentPlayerIndex];
    player.move(result);

    if (player.position >= 100) {
        alert(`${player.name} wins!`);
        player.position = 100;
    }

    drawPlayers();

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
});

drawPlayers();
