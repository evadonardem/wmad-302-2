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
        const icon = Die.#sidesToIcon[this.value] || 'dice-one';
        return `<i class="fa fa-2xl fa-${icon}"></i>`;
    }
}

class Player {
    constructor(name, color) {
        this.name = name;
        this.color = color;
        this.position = 0;
    }
}

// Snakes and ladders logic
function checkSnakesAndLadders(position) {
    // Ladders
    if (position === 4) position = 25;
    else if (position === 13) position = 46;
    else if (position === 42) position = 63;
    else if (position === 50) position = 69;
    else if (position === 62) position = 81;
    else if (position === 74) position = 92;
    // Snakes
    else if (position === 27) position = 5;
    else if (position === 40) position = 3;
    else if (position === 43) position = 18;
    else if (position === 54) position = 31;
    else if (position === 66) position = 45;
    else if (position === 89) position = 53;
    else if (position === 95) position = 77;
    else if (position === 99) position = 41;

    return position;
}

const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const boardCanvas = document.querySelector('#boardPlaceholder canvas');
const ctx = boardCanvas.getContext('2d');

const dice = new Die(6);
const player1 = new Player("Player 1", "red");
const player2 = new Player("Player 2", "blue");
let currentPlayer = player1;

function getCoordinates(position) {
    if (position === 0) return { x: 10, y: 730 };
    const row = Math.floor((position - 1) / 10);
    const colInRow = (position - 1) % 10;
    const size = 74;
    let col = row % 2 === 0 ? colInRow : 9 - colInRow;
    return { 
        x: col * size + size / 2, 
        y: 740 - (row * size + size / 2) 
    };
}

function drawBoard() {
    ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
    [player1, player2].forEach(p => {
        const { x, y } = getCoordinates(p.position);
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
    });
}

function animateMove(player, target, callback) {
    const start = getCoordinates(player.position);
    const end = getCoordinates(target);
    let step = 0, totalSteps = 20;

    function animate() {
        step++;
        const t = step / totalSteps;
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;

        drawBoard();
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.stroke();

        if (step < totalSteps) {
            requestAnimationFrame(animate);
        } else {
            player.position = target;
            drawBoard();
            if (callback) callback();
        }
    }
    animate();
}

// 🎲 Roll Dice and Change Color Based on Player Turn
rollDiceButton.addEventListener('click', () => {
    const steps = dice.roll();

    // Change dice color based on current player's color
    const playerColor = currentPlayer.color;
    diceElement.innerHTML = `<span style="color: ${playerColor};">${dice.getIcon()}</span>`;

    let target = Math.min(100, currentPlayer.position + steps);
    animateMove(currentPlayer, target, () => {
        let newPosition = checkSnakesAndLadders(currentPlayer.position);
        if (newPosition !== currentPlayer.position) {
            animateMove(currentPlayer, newPosition, () => {
                checkWin();
                switchTurn();
            });
        } else {
            checkWin();
            switchTurn();
        }
    });
});

function checkWin() {
    if (currentPlayer.position === 100) {
        setTimeout(() => alert(`${currentPlayer.name} wins! 🎉`), 300);
        rollDiceButton.disabled = true;
    }
}

function switchTurn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
}

drawBoard();
