class BingoBall {
    constructor(letter, number) {
        this.letter = letter;
        this.number = number;
    }
}

class BingoMachine {
    #balls;

    constructor() {
        this.#initBalls();
    }
    
    #initBalls() {
        this.#balls = [];
        const ranges = {
            'B': _.range(1, 16),
            'I': _.range(16, 31),
            'N': _.range(31, 46),
            'G': _.range(46, 61),
            'O': _.range(61, 76),
        };
        for (let [letter, numbers] of Object.entries(ranges)) {
            numbers.forEach(num => {
                this.#balls.push(new BingoBall(letter, num));
            });
        }
    }

    isEmpty() {
        return this.#balls.length === 0;
    }

    roll() {
        this.#balls = _.shuffle(this.#balls);
    }

    draw() {
        if (this.#balls.length === 0) {
            return null;
        }
        let index = _.random(0, this.#balls.length - 1);
        return _.pullAt(this.#balls, index)[0];
    }

    reset() {
        this.#initBalls();
    }

    getRemainingBalls() {
        return this.#balls.length;
    }
}

class BingoCard {
    static #cellValueLookup = new Map([
        ['B', _.range(1, 16)],
        ['I', _.range(16, 31)],
        ['N', _.range(31, 46)],
        ['G', _.range(46, 61)],
        ['O', _.range(61, 76)],
    ]);

    #cells;
    #luckyCard = false;
    
    constructor() {
        this.#initCells();    
    }

    #initCells() {
        let randomCellValues = new Map([
            [0, _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5)],
            [1, _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5)],
            [2, _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5)],
            [3, _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5)],
            [4, _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5)],
        ]);

        this.#cells = [];
        for (let row = 0; row < 5; row++) {
            this.#cells[row] = [];
            for (let col = 0; col < 5; col++) {
                this.#cells[row][col] = {
                    value: randomCellValues.get(col)[row],
                    isMarked: false
                };
            }
        }

        // Middle FREE space
        this.#cells[2][2] = { value: "FREE", isMarked: true };
    }

    get rows() {
        return this.#cells;
    }

    set luckyCard(value) {
        this.#luckyCard = value;
    }

    get luckyCard() {
        return this.#luckyCard;
    }
}

/**
 * Lucky cards templates
 */
const luckyCards = [
    [
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, true, true, true, true],
    ],
    [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, true],
        [false, false, false, false, true],
        [true, true, true, true, true],
    ],
    [
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
    ]
];

/**
 * Lucky cards cell matches lookup
 */
const luckyCardsCellMatches = luckyCards.map((rows) => {
    let cellMatches = [];
    rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                cellMatches.push(`${i}-${j}`);
            }
        });
    });
    cellMatches.sort();
    return cellMatches;
});

let cards = [];
let nabola = [];
let gameOver = false;   // 🚨 stop game after win
const tambiolo = new BingoMachine();

function generateCards(count = 1) {
    let newCards = [];
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

function checkLuckyCards() {
    cards.forEach(card => {
        let markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });
        markedCells.sort();

        card.luckyCard = luckyCardsCellMatches.some(pattern =>
            pattern.every(pos => markedCells.includes(pos))
        );
    });

    // 🚨 If any card is lucky, game over
    if (cards.some(c => c.luckyCard)) {
        gameOver = true;
        drawBtn.setAttribute('disabled', true);
        alert("🎉 BINGO! We have a winner!");
    }
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    // --- Render Cards ---
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                        return `<tr>
                            <td class="${row[0].isMarked ? 'bg-success' : ''}">${row[0].value}</td>
                            <td class="${row[1].isMarked ? 'bg-success' : ''}">${row[1].value}</td>
                            <td class="${row[2].isMarked ? 'bg-success' : ''}">${row[2].value}</td>
                            <td class="${row[3].isMarked ? 'bg-success' : ''}">${row[3].value}</td>
                            <td class="${row[4].isMarked ? 'bg-success' : ''}">${row[4].value}</td>
                        </tr>`; 
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    // --- Render Lucky Card Templates ---
    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        <td class="${row[0] ? 'bg-success' : ''}">&nbsp;</td>
                        <td class="${row[1] ? 'bg-success' : ''}">&nbsp;</td>
                        <td class="${row[2] ? 'bg-success' : ''}">&nbsp;</td>
                        <td class="${row[3] ? 'bg-success' : ''}">&nbsp;</td>
                        <td class="${row[4] ? 'bg-success' : ''}">&nbsp;</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');

    // --- Render Drawn Balls + Progress Bar ---
    let remaining = tambiolo.getRemainingBalls();
let percent = (remaining / 75) * 100;
let barClass = "bg-success";
if (percent <= 50 && percent > 20) barClass = "bg-warning";
if (percent <= 20) barClass = "bg-danger";

document.getElementById('drawnBallsPlaceholder').innerHTML = `
    <div class="progress mb-2" style="height: 25px;">
        <div class="progress-bar ${barClass}" role="progressbar"
            style="width: ${percent}%;">
            ${percent.toFixed(0)}%
        </div>
    </div>
    ${nabola.map((bola) => 
        `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`
    ).join(' ')}
`;

}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards  = generateCards(numberOfCards);
    nabola = [];
    gameOver = false;  // reset game
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    if (gameOver) return; // 🚨 stop if already won

    const bola = tambiolo.draw();
    if (!bola) {
        alert("No more balls!");
        drawBtn.setAttribute('disabled', true);
        return;
    }

    nabola.push(bola);

    // Mark matches
    cards.forEach(card => {
        card.rows.forEach(row => {
            row.forEach(cell => {
                if (cell.value === bola.number) {
                    cell.isMarked = true;
                }
            });
        });
    });

    checkLuckyCards(); // this may end the game
    render();
});

render();