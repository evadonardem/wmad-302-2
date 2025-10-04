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

    static iconForValue(value) {
        const iconName = Die.#sidesToIcon[value] || 'dice';
        return `<i class="fa fa-2xl fa-${iconName}"></i>`;
    }
}

class Player {
    static colors = ['red', 'blue', 'green', 'yellow'];
    constructor(name) {
        this.name = name;
        this.color = Player.colors[Math.floor(Math.random() * Player.colors.length)];
        this.position = 1; // Start at 1
    }
    move(steps) {
        this.position += steps;
        if (this.position > 100) this.position = 100;
    }
    setPosition(pos) {
        this.position = pos;
    }
}

// Snakes and ladders mapping: start => end
const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};
const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

function getCoords(square) {
    // 10x10 board, bottom-left is 1, top-left is 91, bottom-right is 10, top-right is 100
    const size = 74; // 740px / 10 squares
    let row = Math.floor((square - 1) / 10);
    let col = (square - 1) % 10;
    if (row % 2 === 1) col = 9 - col; // reverse direction every other row
    let x = col * size;
    let y = 740 - size - row * size;
    return { x, y };
}

// DOM elements
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const playerToken = document.getElementById('playerToken');
const statusDiv = document.getElementById('status');

const dice = new Die(6);
const player = new Player('You');

function updatePlayerToken() {
    const coords = getCoords(player.position);
    playerToken.style.left = `${coords.x + 17}px`;
    playerToken.style.top = `${coords.y + 10}px`;
}

function updateStatus(msg) {
    statusDiv.innerHTML = msg;
}

rollDiceButton.addEventListener('click', () => {
    if (player.position === 100) {
        updateStatus("🎉 You already won! Refresh to play again.");
        return;
    }
    const result = dice.roll();
    diceElement.innerHTML = Die.iconForValue(result);

    let oldPos = player.position;
    player.move(result);

    let msg = `You rolled a <b>${result}</b> and moved from <b>${oldPos}</b> to <b>${player.position}</b>.`;

    // Check for snakes or ladders
    if (ladders[player.position]) {
        let to = ladders[player.position];
        player.setPosition(to);
        msg += `<br>🪜 Ladder! Climb up to <b>${to}</b>.`;
    } else if (snakes[player.position]) {
        let to = snakes[player.position];
        player.setPosition(to);
        msg += `<br>🐍 Snake! Slide down to <b>${to}</b>.`;
    }

    updatePlayerToken();

    if (player.position === 100) {
        msg += `<br><b>🎉 Congratulations! You win!</b>`;
        rollDiceButton.disabled = true;
    }

    updateStatus(msg);
});

// Initial position
updatePlayerToken();
updateStatus("Roll the dice to start!");
