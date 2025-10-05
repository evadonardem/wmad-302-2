class Die {

    // Private static mapping for standard 6-sided die icons (Font Awesome)
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
        this.currentRoll = 1; 
    }

    roll() {
        this.currentRoll = Math.floor(Math.random() * this.sides) + 1;
        return this.currentRoll;
    }

    getIcon() {
        const iconName = Die.#sidesToIcon[this.currentRoll];

        if (iconName) {
            return `<i class="fa fa-${iconName}"></i>`;
        }
        
        let fallbackIcon = `dice-d${this.sides}`;
        
        if (this.sides === 6) {
             fallbackIcon = 'dice';
        }
        
        return `<i class="fa fa-${fallbackIcon}"></i>`;
    }
}

class Player {

    constructor(name, color) { 
        this.name = name;
        this.color = color;     // Color is explicitly assigned
        this.position = 0;
    }

    move(steps) {
        this.position += steps;
    }
}


// -----------------------------------------------------------------
// GAME LOGIC & BOARD TRACKING
// -----------------------------------------------------------------

// --- DOM Elements & Die Instance ---
const diceElement = document.getElementById('dicePlaceholder'); 
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6); 

const addPlayerButton = document.getElementById('addPlayerButton');
const removePlayerButton = document.getElementById('removePlayerButton'); 
const resetButton = document.getElementById('resetButton'); 
const playerCountSpan = document.getElementById('playerCount'); 
const activePlayerNameSpan = document.getElementById('activePlayerName');
const playerListElement = document.getElementById('playerList'); 

// --- Game Board Transfers (Ladders: Lower -> Higher, Snakes: Higher -> Lower) ---
const BOARD_TRANSFERS = {
    // Ladders (Go Up)
    4: 25,
    13: 46,
    50: 69,
    62: 81,
    74: 92,
    
    // Snakes (Go Down)
    22: 5,
    40: 3,
    43: 18,
    54: 31,
    66: 45,
    89: 53,
    95: 77,
    99: 41
};

// --- Canvas Setup ---
const canvas = document.querySelector('#boardPlaceholder canvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 74; // 740px / 10 tiles = 74px per tile

// --- Game State ---
const MAX_PLAYERS = 4;
// Define the static, unique colors available for the game
const ALL_COLORS = ['red', 'blue', 'green', 'yellow']; 
const players = []; // Array to hold Player objects
let activePlayerIndex = 0; 
let gameStarted = false;

// -----------------------------------------------------------------
// BOARD AND PLAYER DRAWING FUNCTIONS
// -----------------------------------------------------------------

/**
 * Maps a board position (1-100) to an (x, y) pixel coordinate for the canvas.
 * This is based on the snake-like path of the board.
 * @param {number} pos - The player's board position (1 to 100).
 * @returns {{x: number, y: number}} The canvas coordinates.
 */
function getTileCenter(pos) {
    if (pos < 1 || pos > 100) return { x: 0, y: 0 };
    
    // Calculate 0-indexed row and column
    const row0 = Math.floor((pos - 1) / 10);
    const col0 = (pos - 1) % 10;
    
    let x, y;
    
    // Determine Y coordinate (rows are 9 down to 0)
    y = (9 - row0) * TILE_SIZE + TILE_SIZE / 2;
    
    // Determine X coordinate (columns zig-zag)
    if (row0 % 2 === 0) {
        // Even row (0, 2, 4, 6, 8) moves left-to-right (0-9)
        x = col0 * TILE_SIZE + TILE_SIZE / 2;
    } else {
        // Odd row (1, 3, 5, 7, 9) moves right-to-left (9-0)
        x = (9 - col0) * TILE_SIZE + TILE_SIZE / 2;
    }

    return { x: x, y: y };
}

function checkSnakesAndLadders(position) {
    // Check if the current position is a key in the BOARD_TRANSFERS map
    const newPosition = BOARD_TRANSFERS[position];
    
    if (newPosition) {
        // Determine if it was a Snake or Ladder for logging purposes
        const type = newPosition > position ? 'LADDER' : 'SNAKE';
        console.log(`BINGO! Hit ${type} at ${position}, moving to ${newPosition}`);
        
        // Return the new position
        return newPosition;
    }
    
    // If no transfer is found, return the original position
    return position;
}

/**
 * Draws all player tokens onto the canvas.
 */
function drawPlayers() {
    // Clear the canvas area (important for animation)
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    players.forEach((player, index) => {
        const { x, y } = getTileCenter(player.position);
        
        // Offset players slightly so they don't overlap when on the same tile
        const offset = index * 5 - (players.length - 1) * 2.5;

        ctx.beginPath();
        // Draw a circle for the token
        ctx.arc(x + offset, y + offset, 10, 0, Math.PI * 2);
        
        // Set the token color from the Player object
        ctx.fillStyle = player.color;
        ctx.fill();
        
        // Add a dark border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.closePath();
    });
}

// -----------------------------------------------------------------
// PLAYER MANAGEMENT AND STATE UPDATES
// -----------------------------------------------------------------

// Function to update the player count, buttons, and display the active player
function updatePlayerState() {
    playerCountSpan.textContent = players.length;
    
    // Update player list HTML
    playerListElement.innerHTML = players.map((p, i) => `
        <li class="list-group-item d-flex justify-content-between align-items-center ${i === activePlayerIndex && gameStarted ? 'active' : ''}">
            <span style="color: ${p.color}; font-weight: bold;">${p.name}</span>
            <span>Pos: ${p.position}</span>
        </li>
    `).join('');
    
    // Update active player name
    if (players.length > 0) {
        activePlayerNameSpan.textContent = players[activePlayerIndex].name;
    } else {
        activePlayerNameSpan.textContent = "N/A";
    }

    // Logic for ADD Player Button: check if a unique color is available
    const availableColor = getFirstAvailableColor();

    const canAdd = players.length < MAX_PLAYERS && availableColor;
    
    addPlayerButton.disabled = !canAdd;
    if (canAdd) {
        addPlayerButton.textContent = "Add Player";
    } else {
        addPlayerButton.textContent = availableColor
            ? "Max Players Reached (4)" 
            : "No More Colors Available"; // (Will only happen if MAX_PLAYERS > 4)
    }
    
    // Logic for REMOVE Player Button
    const canRemove = players.length > 0;
    removePlayerButton.disabled = !canRemove;
    if (canRemove) {
        removePlayerButton.textContent = `Remove ${players[players.length - 1].name}`;
    } else {
        removePlayerButton.textContent = "Remove Last Player";
    }

    // Roll button is disabled if there are no players
    rollDiceButton.disabled = players.length === 0;
    if (players.length > 0 && !gameStarted) {
         // Start the game implicitly when the first roll happens
         rollDiceButton.textContent = `Start Game (Roll)`;
    } else if (gameStarted) {
         rollDiceButton.textContent = `Roll for ${players[activePlayerIndex].name}`;
    }

    // Re-draw players whenever state changes
    drawPlayers();
}

// Function to get the list of colors currently in use
function getUsedColors() {
    return players.map(p => p.color);
}

// Function to get the first available color from the fixed list
function getFirstAvailableColor() {
    const usedColors = getUsedColors();
    return ALL_COLORS.find(color => !usedColors.includes(color));
}

// -----------------------------------------------------------------
// EVENT LISTENERS
// -----------------------------------------------------------------

// --- Dice Rolling Event Listener (Moves Player) ---
rollDiceButton.addEventListener('click', () => {
    if (players.length === 0) return;

    gameStarted = true;
    
    const currentPlayer = players[activePlayerIndex];
    
    // 1. Roll the die and update icon
    const steps = dice.roll(); 
    const iconHtml = dice.getIcon();
    const iconClassMatch = iconHtml.match(/fa-([a-z-]+)">/);
    const iconName = iconClassMatch ? iconClassMatch[1] : 'dice';
    diceElement.innerHTML = `<i class="fa fa-2xl fa-${iconName}"></i>`;

    // 2. Move the player normally
    currentPlayer.move(steps);
    
    // --- NEW: Check for Win BEFORE Transfer ---
    if (currentPlayer.position >= 100) {
        alert(`${currentPlayer.name} WINS!`);
        resetGame();
        return;
    }

    // 3. APPLY SNAKE/LADDER TRANSFER
    const finalPosition = checkSnakesAndLadders(currentPlayer.position);
    currentPlayer.position = finalPosition; // Update position after transfer

    // 4. Draw the players to show the immediate movement (roll + transfer)
    drawPlayers(); 

    // 5. Update game state and switch turn
    activePlayerIndex = (activePlayerIndex + 1) % players.length;
    updatePlayerState(); 
});

/**
 * Checks if the player's current position is a snake or ladder head/foot,
 * updates their position, and displays a message via alert().
 * @param {number} position - The current position.
 * @returns {number} The new position after any transfer.
 */
function checkSnakesAndLadders(position) {
    const newPosition = BOARD_TRANSFERS[position];
    
    if (newPosition) {
        const isLadder = newPosition > position;
        const type = isLadder ? 'LADDER' : 'SNAKE';
        
        // Font Awesome icons translated to plain text/description for the alert:
        const iconDescription = isLadder ? '[FA: ladder]' : '[FA: snake]';

        const currentPlayer = players[activePlayerIndex];
        
        console.log(`BINGO! Hit ${type} at ${position}, moving to ${newPosition}. Icon: ${iconDescription}`);
        
        // Display the message using an alert
        if (isLadder) {
            alert(`🎉 ${currentPlayer.name} found a LADDER! Climb from ${position} to ${newPosition}!`);
        } else {
            alert(`⬇️ ${currentPlayer.name} hit a SNAKE! Slide down from ${position} to ${newPosition}.`);
        }

        return newPosition;
    }
    
    return position;
}

// --- Add Player Listener ---
addPlayerButton.addEventListener('click', () => {
    const assignedColor = getFirstAvailableColor();

    if (players.length < MAX_PLAYERS && assignedColor) {
        const newPlayerName = `Player ${players.length + 1}`;
        
        // Pass the assigned unique color to the Player constructor
        const newPlayer = new Player(newPlayerName, assignedColor); 
        players.push(newPlayer);
        
        console.log(`${newPlayerName} added with color: ${newPlayer.color}`);
    }
    updatePlayerState();
});

// --- Remove Player Listener ---
removePlayerButton.addEventListener('click', () => {
    if (players.length > 0) {
        // Removing the player frees up their color automatically, 
        // making it available for the next added player.
        players.pop(); 
        
        // Ensure the active player index is valid after removal
        if (activePlayerIndex >= players.length && players.length > 0) {
            activePlayerIndex = players.length - 1; // Move back to the last remaining player
        } else if (players.length === 0) {
            activePlayerIndex = 0;
        }
    }
    updatePlayerState();
});

// --- NEW: Reset Game Listener ---
resetButton.addEventListener('click', resetGame);

/**
 * Resets the entire board state.
 */
function resetGame() {
    // 1. Visually clear the board first.
    clearBoardCanvas(); // <--- CALL TO CLEAR THE CANVAS

    // 2. Reset all player positions to 0 (or 1, depending on game rules)
    players.forEach(p => p.position = 0);
    
    // 3. Reset game state variables
    activePlayerIndex = 0;
    gameStarted = false;
    
    // 4. Clear dice display
    diceElement.innerHTML = `<i class="fa fa-2xl fa-dice"></i>`;
    
    // 5. Update the UI and redraw players at their starting point (position 0/1)
    // The drawPlayers() inside updatePlayerState() will handle placing them at 0.
    updatePlayerState(); 
    
    console.log("Game board reset.");
}

/**
 * Clears the entire canvas drawing area.
 */
function clearBoardCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
}