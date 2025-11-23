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
            'B': [1, 15],
            'I': [16, 30],
            'N': [31, 45],
            'G': [46, 60],
            'O': [61, 75],
        };

        for (let letter in ranges) {
            let [start, end] = ranges[letter];
            for (let num = start; num <= end; num++) {
                this.#balls.push(new BingoBall(letter, num));
            }
        }
    }

    isEmpty() {
        return this.#balls.length === 0;
    }

    roll() {
        this.#balls = _.shuffle(this.#balls);
    }

    draw() {
        if (this.#balls.length === 0) return null;
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
                this.#cells[i].push({
                    value: randomCellValues.get(j)[i],
                    isMarked: false
                });
            }
        }

        // Free space center
        this.#cells[2][2].value = "★";
        this.#cells[2][2].isMarked = true;
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
    ]
];

const luckyCardsCellMatches = luckyCards.map((rows) => {
    let cellMatches = [];
    rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                cellMatches.push(`${i}-${j}`);
            }
        });
    });
    return cellMatches.sort();
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
            pattern.every(c => markedCells.includes(c))
        );
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');

    cardsPlaceholderElem.innerHTML = `<div class="row g-3">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-6 col-lg-4">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                        return `<tr>
                            ${row.map(cell =>
                                `<td class="${cell.isMarked ? 'bg-danger text-white fw-bold' : ''}">${cell.value}</td>`
                            ).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success fw-bold' : ''}">
                        <tr><td colspan=5>${card.luckyCard ? '🎉 Lucky Card!' : '&nbsp;'}</td></tr>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center mb-3">
            <thead class="table-primary">
                <tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        ${row.map(cell => `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola
        .map((bola) => `<span class="badge bg-warning text-dark">${bola.letter}${bola.number}</span>`)
        .join(' ');
}

// 🎯 Events
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
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
    let bola = tambiolo.draw();
    if (!bola) {
        alert("All balls drawn! Game over.");
        return;
    }
    nabola.push(bola);

    // Mark on cards
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
    render();
});

render();