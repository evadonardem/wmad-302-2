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
        // B - 1 to 15
        for (let i = 1; i <= 15; i++) this.#balls.push(new BingoBall('B', i));
        // I - 16 to 30
        for (let i = 16; i <= 30; i++) this.#balls.push(new BingoBall('I', i));
        // N - 31 to 45
        for (let i = 31; i <= 45; i++) this.#balls.push(new BingoBall('N', i));
        // G - 46 to 60
        for (let i = 46; i <= 60; i++) this.#balls.push(new BingoBall('G', i));
        // O - 61 to 75
        for (let i = 61; i <= 75; i++) this.#balls.push(new BingoBall('O', i));
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
        for (let i = 0; i < 5; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < 5; j++) {
                let value = randomCellValues.get(j)[i];
                this.#cells[i].push({
                    value: (i === 2 && j === 2) ? 'FREE' : value,
                    isMarked: (i === 2 && j === 2)
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
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

function checkLuckyCards() {
    cards.forEach((card) => {
        let markedCells = [];
        card.rows.forEach((row, i) => {
            row.forEach((cell, j) => {
                if (cell.isMarked) {
                    markedCells.push(`${i}-${j}`);
                }
            });
        });
        markedCells.sort();
        card.luckyCard = luckyCardsCellMatches.some((template) =>
            _.isEqual(template, markedCells)
        );
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    const drawnBallsElem = document.getElementById('drawnBallsPlaceholder');

    // Render Bingo Cards
    cardsPlaceholderElem.innerHTML = cards.map((card, idx) => {
        const rows = card.rows;
        return `
            <div class="mb-4">
                <table class="table table-bordered text-center">
                    <thead>
                        <tr>
                            <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((row, i) => `
                            <tr>
                                ${row.map((cell, j) => `
                                    <td class="${cell.isMarked ? 'marked' : ''}">
                                        ${cell.value}
                                    </td>
                                `).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${card.luckyCard ? '<div class="alert alert-success p-1 text-center">Lucky Card!</div>' : ''}
            </div>
        `;
    }).join('');

    // Render Lucky Card Templates
    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((template) => `
        <table class="table table-bordered text-center mb-2">
            <thead>
                <tr>
                    <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                </tr>
            </thead>
            <tbody>
                ${template.map((row) => `
                    <tr>
                        ${row.map((cell) => `
                            <td class="${cell ? 'table-success' : ''}"></td>
                        `).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `).join('');

    // Render Drawn Balls
    drawnBallsElem.innerHTML = nabola.map((bola) =>
        `<span class="badge bg-primary">${bola.letter}${bola.number}</span>`
    ).join(' ');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const drawSound = document.getElementById('drawSound');

numberOfCardsInput.addEventListener('change', () => {
    let count = parseInt(numberOfCardsInput.value) || 1;
    cards = generateCards(count);
    nabola = [];
    tambiolo.reset();
    render();
});

rollBtn.addEventListener('click', () => {
    tambiolo.roll();
    render();
});

drawBtn.addEventListener('click', () => {
    if (tambiolo.isEmpty()) return;
    const bola = tambiolo.draw();
    if (bola) {
        nabola.push(bola);
        // Mark cells in all cards
        cards.forEach(card => {
            card.rows.forEach(row => {
                row.forEach(cell => {
                    if (cell.value === bola.number) {
                        cell.isMarked = true;
                    }
                });
            });
        });
        checkLuckyCards();
        drawSound.play();
        render();
    }
});

// Initial render
cards = generateCards(1);
render();