class Die {

    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six', 
    };

    /**
     * Complete the Die class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, sides, which represents the number of sides on the die (by default 6).
     * 2. The class should have a method named roll that returns a random integer between 1 and the number of sides (inclusive).
     * 3. The class should hava a method getting icon that returns a string representing a die icon using font-awesome.
     *    - For example, if the die has 6 sides, the method should return '<i class="fa fa-dice-six"></i>'.
     *    - If the die has 4 sides, it should return '<i class="fa fa-dice-four"></i>', and so on.
     * 
     * Example usage:
     * const die = new Die(6);
     */
}

class Player {
    /**
     * Complete the Player class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, name, which represents the player's name.
     * 2. The class should have a property named color that is initialized to a random color from the following array: ['red', 'blue', 'green', 'yellow'].
     * 2. The class should have a property named position that is initialized to 0.
     * 3. The class should havclass Die {
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
        const iconName = Die.#sidesToIcon[this.value] || 'dice-one';
        return `<i class="fa fa-2xl fa-${iconName}"></i>`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        const colors = ['red', 'blue', 'green', 'yellow'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }
}

// --- Snakes and Ladders ---
const ladders = {
    4: 25,
    13: 46,
    42: 63,
    50: 69,
    62: 81,
    74: 92,
};

const snakes = {
    27: 5,
    40: 3,
    43: 18,
    54: 31,
    66: 45,
    89: 53,
    95: 77,
    99: 41,
};

// --- Canvas Setup ---
const boardCanvas = document.querySelector('#boardPlaceholder canvas');
const ctx = boardCanvas.getContext('2d');

// --- Dice & UI Elements ---
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

// 🎯 Create and show current turn indicator
const turnIndicator = document.createElement('h5');
turnIndicator.classList.add('mt-3', 'text-center');
rollDiceButton.parentElement.insertBefore(turnIndicator, diceElement);

// --- Players ---
const players = [new Player("Player 1"), new Player("Player 2")];
let currentPlayerIndex = 0;

// --- Helper Functions ---
function getCoordinates(position) {
    if (position < 1) return { x: 0, y: 740 - 74 };
    const row = Math.floor((position - 1) / 10);
    const col = (position - 1) % 10;
    const x = (row % 2 === 0 ? col : 9 - col) * 74;
    const y = 740 - (row + 1) * 74;
    return { x: x + 37, y: y + 37 };
}

function drawPlayers() {
    ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
    players.forEach(p => {
        const { x, y } = getCoordinates(p.position);
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.stroke();
    });
}

function updateTurnDisplay() {
    const currentPlayer = players[currentPlayerIndex];
    turnIndicator.innerHTML = `🎯 <strong style="color:${currentPlayer.color}">${currentPlayer.name}</strong>'s Turn`;
}

// --- Dice Roll Logic ---
rollDiceButton.addEventListener('click', () => {
    const currentPlayer = players[currentPlayerIndex];
    const rollValue = dice.roll();
    diceElement.innerHTML = dice.getIcon();

    alert(`${currentPlayer.name} rolled a ${rollValue}!`);
    currentPlayer.move(rollValue);

    // Check ladders
    if (ladders[currentPlayer.position]) {
        alert(`${currentPlayer.name} climbed a ladder! 🪜`);
        currentPlayer.position = ladders[currentPlayer.position];
    }

    // Check snakes
    if (snakes[currentPlayer.position]) {
        alert(`${currentPlayer.name} got bitten by a snake! 🐍`);
        currentPlayer.position = snakes[currentPlayer.position];
    }

    drawPlayers();

    // Check win
    if (currentPlayer.position === 100) {
        alert(`🎉 ${currentPlayer.name} wins the game!`);
        rollDiceButton.disabled = true;
        turnIndicator.textContent = "🏁 Game Over!";
        return;
    }

    // Switch player
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updateTurnDisplay();
});

// --- Initialize ---
updateTurnDisplay();
drawPlayers();
e a method named move that accepts a single parameter, steps, and updates the player's position by adding the steps to the current position.
     * 
     * Example usage:
     * const player = new Player('Alice');
     */
}


const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

rollDiceButton.addEventListener('click', () => {
    /**
     * Complete the event listener to meet the following requirements:
     * render the icon of the die in the diceElement when the button is clicked.
     * Use the getIcon method of the Die class to get the appropriate icon based on the number of sides.
     * For example, if the die has 6 sides, it should render '<i class="fa fa-dice-six"></i>'.
     */
    const icon = 'dice-five';
    diceElement.innerHTML = `<i class="fa fa-2xl fa-${icon}"></i>`;
});

