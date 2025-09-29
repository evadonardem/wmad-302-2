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

        // Build 1-75 with correct letters
        const ranges = {
            B: [1, 15],
            I: [16, 30],
            N: [31, 45],
            G: [46, 60],
            O: [61, 75]
        };

        Object.entries(ranges).forEach(([letter, [start, end]]) => {
            for (let n = start; n <= end; n++) {
                this.#balls.push(new BingoBall(letter, n));
            }
        });
    }

    isEmpty() {
        return this.#balls.length === 0;
    }

    roll() {
        this.#balls = _.shuffle(this.#balls);
    }

    draw() {
        if (this.#balls.length === 0) return null;
        const index = _.random(0, this.#balls.length - 1);
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
        // pick 5 numbers for each column
        const randomCellValues = new Map([
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
            const value = randomCellValues.get(col)[row];
            this.#cells[row].push({ value, isMarked: false });
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

    mark(letter, number) {
        // mark the cell if it matches the drawn ball
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                const cell = this.#cells[r][c];
                if (cell.value === number) cell.isMarked = true;
            }
        }
    }

    matchedPositions() {
        // returns array of "r-c" for marked cells
        const arr = [];
        this.#cells.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell.isMarked) arr.push(`${r}-${c}`);
            });
        });
        arr.sort();
        return arr;
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

const luckyCardsCellMatches = luckyCards.map((rows) => {
    const cellMatches = [];
    rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) cellMatches.push(`${i}-${j}`);
        });
    });
    cellMatches.sort();
    return cellMatches;
});

let cards = [];
let nabola = [];
const tambiolo = new BingoMachine();

function generateCards(count = 1) {
    const newCards = [];
    for (let i = 0; i < count; i++) newCards.push(new BingoCard());
    return newCards;
}

function checkLuckyCards() {
    cards.forEach(card => {
        const marked = card.matchedPositions();
        const isLucky = luckyCardsCellMatches.some(template =>
            template.every(pos => marked.includes(pos))
        );
        card.luckyCard = isLucky;
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');

    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map(card => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map(row => `<tr>
                        ${row.map(cell =>
                            `<td class="${cell.isMarked ? 'bg-danger' : ''}">${cell.value}</td>`
                        ).join('')}
                    </tr>`).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map(luckyCard => `
        <table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map(row => `<tr>
                    ${row.map(c => `<td class="${c ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}
                </tr>`).join('')}
            </tbody>
        </table>
    `).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML =
        nabola.map(b => `<span class="badge bg-primary mb-1">${b.letter}<br>${b.number}</span>`).join(' ');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', e => {
    const numberOfCards = parseInt(e.target.value, 10);
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    if (tambiolo.isEmpty()) {
        alert('No more balls!');
        drawBtn.setAttribute('disabled', 'disabled');
        return;
    }

    // 1. draw a ball
    const ball = tambiolo.draw();

    // 2. add to drawn balls
    nabola.push(ball);

    // 3. mark cards
    cards.forEach(card => card.mark(ball.letter, ball.number));

    // 4. check lucky cards
    checkLuckyCards();

    // 🔑 5. If at least one winner, stop drawing
    const hasWinner = cards.some(card => card.luckyCard);
    if (hasWinner) {
        drawBtn.setAttribute('disabled', 'disabled');   // stop further draws
        alert('🎉 We have a winner! Drawing stopped.');
    }

    // 6. re-render
    render();
});

