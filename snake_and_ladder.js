//tsi
class Die {
    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six',
    };

    #sides;
    #currentValue;

    constructor(sides = 6) {
        this.#sides = sides;
        this.#currentValue = 1;
    }

    roll() {
        this.#currentValue = Math.floor(Math.random() * this.#sides) + 1;
        return this.#currentValue;
    }

    getIcon() {
        const iconName = Die.#sidesToIcon[this.#currentValue] || 'dice-six';
        return `<i class="fa fa-${iconName}"></i>`;
    }

    getCurrentValue() {
        return this.#currentValue;
    }
}

class Player {
    static #availableColors = ['red', 'blue', 'green', 'yellow'];
    static #colorMap = {
        'red': '#dc3545',
        'blue': '#0d6efd',
        'green': '#198754',
        'yellow': '#ffc107'
    };

    #name;
    #color;
    #position;

    constructor(name) {
        this.#name = name;
        const randomIndex = Math.floor(Math.random() * Player.#availableColors.length);
        this.#color = Player.#availableColors[randomIndex];
        this.#position = 0;
    }

    move(steps) {
        this.#position += steps;
        if (this.#position > 100) {
            this.#position = 100;
        }
        return this.#position;
    }

    get name() {
        return this.#name;
    }

    get color() {
        return this.#color;
    }

    get colorHex() {
        return Player.#colorMap[this.#color];
    }

    get position() {
        return this.#position;
    }

    set position(value) {
        this.#position = value;
    }
}

// Snake and Ladder Game Logic
class SnakeAndLaddersGame {
    constructor() {
        // Snakes: head -> tail (going down)
        this.snakes = {
            99: 22,
            95: 75,
            86: 55,
            77: 37,
            76: 27,
            66: 6,
            59: 17,
            48: 9,
            43: 24,
            39: 3
        };

        // Ladders: bottom -> top (going up)
        this.ladders = {
            5: 58,
            16: 25,
            27: 84,
            31: 53,
            47: 88,
            51: 92,
            60: 81,
            72: 90,
            80: 100
        };

        this.players = [];
        this.currentPlayerIndex = 0;
        this.canvas = null;
        this.ctx = null;
        this.isGameOver = false;
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    movePlayer(steps) {
        const player = this.getCurrentPlayer();
        const oldPosition = player.position;
        let newPosition = player.move(steps);

        // Check for snake
        if (this.snakes[newPosition]) {
            console.log(`🐍 Oh no! Snake at ${newPosition}, sliding down to ${this.snakes[newPosition]}`);
            newPosition = this.snakes[newPosition];
            player.position = newPosition;
        }

        // Check for ladder
        if (this.ladders[newPosition]) {
            console.log(`🪜 Great! Ladder at ${newPosition}, climbing up to ${this.ladders[newPosition]}`);
            newPosition = this.ladders[newPosition];
            player.position = newPosition;
        }

        // Check for win
        if (newPosition === 100) {
            this.isGameOver = true;
            setTimeout(() => {
                alert(`🎉 ${player.name} wins! Congratulations!`);
            }, 500);
        }

        return { oldPosition, newPosition, player };
    }

    initCanvas(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }
    }

    getSquarePosition(squareNumber) {
        if (squareNumber < 1 || squareNumber > 100) {
            return { x: 0, y: 0 };
        }

        const squareSize = 74; // 740 / 10
        const row = Math.floor((squareNumber - 1) / 10);
        const col = (squareNumber - 1) % 10;

        // Reverse row because square 1 is at bottom left
        const actualRow = 9 - row;

        // Zigzag pattern: even rows go left-to-right, odd rows go right-to-left
        let actualCol;
        if (row % 2 === 0) {
            actualCol = col;
        } else {
            actualCol = 9 - col;
        }

        return {
            x: actualCol * squareSize + squareSize / 2,
            y: actualRow * squareSize + squareSize / 2
        };
    }

    drawPlayers() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.players.forEach((player, index) => {
            if (player.position > 0) {
                const pos = this.getSquarePosition(player.position);
                
                // Offset multiple players on same square
                const offset = (index - (this.players.length - 1) / 2) * 15;

                this.ctx.beginPath();
                this.ctx.arc(pos.x + offset, pos.y, 12, 0, 2 * Math.PI);
                this.ctx.fillStyle = player.colorHex;
                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 3;
                this.ctx.stroke();

                // Add player initial
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(player.name[0].toUpperCase(), pos.x + offset, pos.y);
            }
        });
    }

    updateUI() {
        this.drawPlayers();

        const currentPlayer = this.getCurrentPlayer();
        const currentPlayerInfo = document.getElementById('currentPlayerInfo');
        if (currentPlayerInfo) {
            currentPlayerInfo.innerHTML = `
                <span class="player-token" style="background-color: ${currentPlayer.colorHex}"></span>
                ${currentPlayer.name} (Position: ${currentPlayer.position})
            `;
        }

        const playersInfo = document.getElementById('playersInfo');
        if (playersInfo) {
            playersInfo.innerHTML = this.players.map(player => `
                <div class="player-info" data-testid="player-info-${player.name}">
                    <span class="player-token" style="background-color: ${player.colorHex}"></span>
                    <strong>${player.name}:</strong> Square ${player.position}
                </div>
            `).join('');
        }
    }

    reset() {
        this.players.forEach(player => {
            player.position = 0;
        });
        this.currentPlayerIndex = 0;
        this.isGameOver = false;
        this.updateUI();
    }
}

// Initialize the game
const game = new SnakeAndLaddersGame();
const dice = new Die(6);

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas
    game.initCanvas('gameCanvas');

    // Create players
    const player1 = new Player('Tsini');
    const player2 = new Player('Rose');
    game.addPlayer(player1);
    game.addPlayer(player2);

    // Initial UI update
    game.updateUI();

    // Get DOM elements
    const diceElement = document.getElementById('dicePlaceholder');
    const rollDiceButton = document.getElementById('rollDiceButton');
    const newGameButton = document.getElementById('newGameButton');

    // Show initial dice
    diceElement.innerHTML = dice.getIcon();

    // Roll dice event
    rollDiceButton.addEventListener('click', () => {
        if (game.isGameOver) {
            alert('Game is over! Start a new game.');
            return;
        }

        // Disable button during roll
        rollDiceButton.disabled = true;

        // Add rolling animation
        diceElement.classList.add('dice-rolling');

        // Roll the dice
        setTimeout(() => {
            // Roll the die to get a random value (1-6)
            const rolledValue = dice.roll();
            
            // Render the icon of the die in the diceElement using the getIcon method
            // This returns the appropriate Font Awesome icon based on the rolled value
            // For example, if rolled a 6, it renders '<i class="fa fa-dice-six"></i>'
            diceElement.innerHTML = dice.getIcon();
            
            diceElement.classList.remove('dice-rolling');

            console.log(`${game.getCurrentPlayer().name} rolled a ${rolledValue}`);

            // Move player
            const result = game.movePlayer(rolledValue);
            
            // Update UI
            setTimeout(() => {
                game.updateUI();

                // Next player's turn if game is not over
                if (!game.isGameOver) {
                    game.nextPlayer();
                    game.updateUI();
                }

                // Re-enable button
                rollDiceButton.disabled = false;
            }, 300);
        }, 500);
    });

    // New game event
    newGameButton.addEventListener('click', () => {
        if (confirm('Start a new game?')) {
            game.reset();
            diceElement.innerHTML = dice.getIcon();
            console.log('New game started!');
        }
    });
});
