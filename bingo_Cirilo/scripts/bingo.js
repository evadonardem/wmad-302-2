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
        
        /**
         * Initialize bingo ball instances from 1 to 75.
         * Breakdown:
         *     B - 1 to 15
         *     I - 16 to 30
         *     N - 31 to 45
         *     G - 46 to 60
         *     O - 61 to 75
         */

    for (let i = 1; i <= 75; i++) {
        let letter;
        if (i <= 15) {
            letter = 'B';
        } else if (i <= 30) {
            letter = 'I';
        } else if (i <= 45) {
            letter = 'N';
        } else if (i <= 60) {
            letter = 'G';
        } else {
            letter = 'O';
        }

        this.#balls.push({ number: i, letter });
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
}

class BingoCard {
    static #cellValueLookup = new Map([
        ['B', _.range(1, 15)],
        ['I', _.range(16, 30)],
        ['N', _.range(31, 45)],
        ['G', _.range(46, 60)],
        ['O', _.range(61, 75)],
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
    for (let i = 0; i < 5; i++) {
        this.#cells[i] = [];
        for (let j = 0; j < 5; j++) {
            let value = randomCellValues.get(j)[i];
            // Set center cell to "FREE"
            if (i === 2 && j === 2) {
                value = "FREE";
            }
            this.#cells[i].push({
                value: value,
                isMarked: value === "FREE" // Automatically mark the free space
            });
        }
    }
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
        [true, false, false, true, true],
        [true, false, true, false, false],
        [true, true, false, false, false],
        [true, false, true, false, false],
        [true, false, false, true, true],
    ],
    [
        [false, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, false],
        [true, false, false, false, true],
        [false, true, true, true, false],
    ],
    [
        [true, true, true, true, false],
        [true, false, false, false, true],
        [true, false, false, false, true],
        [true, true, true, true, false],
        [true, false, false, false, false],
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
const tambiolo = new BingoMachine();

function generateCards(count = 1) {
    let newCards = [];
    // generate cards using loops
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }

    return newCards;
}

function isLuckyCard(card) {
    return luckyCards.some(template => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (template[i][j] && !card.rows[i][j].isMarked) {
                    return false;
                }
            }
        }
        return true;
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
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
                            <td class="${row[0].isMarked ? 'bg-danger' : ''}">${row[0].value}</td>
                            <td class="${row[1].isMarked ? 'bg-danger' : ''}">${row[1].value}</td>
                            <td class="${row[2].isMarked ? 'bg-danger' : ''}">${row[2].value}</td>
                            <td class="${row[3].isMarked ? 'bg-danger' : ''}">${row[3].value}</td>
                            <td class="${row[4].isMarked ? 'bg-danger' : ''}">${row[4].value}</td>
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
                        <td class="${row[0] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[1] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[2] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[3] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[4] ? 'bg-danger' : ''}">&nbsp;</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');
    
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`).join(' ');
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
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});


rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    // 1. Draw a ball from tambiolo
    if (tambiolo.isEmpty()) {
        alert('All balls have been drawn!');
        drawBtn.setAttribute('disabled', 'disabled');
        return;
    }
    const drawnBall = tambiolo.draw();

    // 2. Add drawn ball to nabola
    nabola.push(drawnBall);

    // 3. Check all cards and mark matching cells
    cards.forEach(card => {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = card.rows[row][col];
                if (cell.value === drawnBall.number) {
                    cell.isMarked = true;
                }
            }
        }
    });

    // 4. Check for BINGO
    cards.forEach(card => {
        if (typeof checkBingo === 'function' && checkBingo(card)) {
            card.isWinner = true;
            alert('BINGO! We have a winner!');
        }
    });

    // 5. Check for Lucky Cards
    cards.forEach(card => {
        card.luckyCard = isLuckyCard(card);
    });

    // 6. Render the page
    render();

    // 7. Disable draw button if no balls left
    if (tambiolo.isEmpty()) {
        drawBtn.setAttribute('disabled', 'disabled');
    }

    // 8. Check and disable if any lucky card is found
    checkAndDisableOnLuckyCard();
});

function checkAndDisableOnLuckyCard() {
    if (cards.some(card => card.luckyCard)) {
        drawBtn.setAttribute('disabled', 'disabled');
        alert('Lucky Card found! Drawing is now disabled.');
    }
}

const resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', () => {
    // Reset game state
    nabola = [];
    tambiolo.reset();
    cards = generateCards(Number(numberOfCardsInput.value) || 1);
    drawBtn.removeAttribute('disabled');
    render();
});

render();