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
        for (let i = 1; i <= 15; i++) {
            this.#balls.push(new BingoBall('B', i));
        }
        
        // I - 16 to 30
        for (let i = 16; i <= 30; i++) {
            this.#balls.push(new BingoBall('I', i));
        }
        
        // N - 31 to 45
        for (let i = 31; i <= 45; i++) {
            this.#balls.push(new BingoBall('N', i));
        }
        
        // G - 46 to 60
        for (let i = 46; i <= 60; i++) {
            this.#balls.push(new BingoBall('G', i));
        }
        
        // O - 61 to 75
        for (let i = 61; i <= 75; i++) {
            this.#balls.push(new BingoBall('O', i));
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

    get remainingBalls() {
        return this.#balls;
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
                this.#cells[i].push({
                    value: "&nbsp;",
                    isMarked: false
                });
            }
        }

        // Fill in the cell values based on the random numbers selected
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (j === 2 && i === 2) {
                    // Set the center space as "free" space
                    this.#cells[i][j] = { value: "FREE", isMarked: true };
                } else {
                    let column = ['B', 'I', 'N', 'G', 'O'][i];
                    this.#cells[i][j].value = randomCellValues.get(i).pop();
                }
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

    // Checks if the card matches the lucky card template
    isLuckyCard(luckyCardTemplate) {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (luckyCardTemplate[i][j] && this.#cells[i][j].isMarked === false) {
                    return false; // A lucky card position is not marked
                }
            }
        }
        return true;
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

// Function to check if any card matches a lucky card
function checkLuckyCard() {
    for (let card of cards) {
        for (let luckyCardTemplate of luckyCards) {
            if (card.isLuckyCard(luckyCardTemplate)) {
                card.luckyCard = true;
                return true; // Stop drawing when lucky card is found
            }
        }
    }
    return false;
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
                    <tfoot class="${card.luckyCard ? 'bg-pink text-white' : ''}">
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

    // Show the remaining balls
    document.getElementById('remainingBalls').innerHTML = tambiolo.remainingBalls.map((bola) => 
        `<span class="badge bg-secondary mb-1">${bola.letter}<br>${bola.number}</span>`).join(' ');
}

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
    const drawnBall = tambiolo.draw();
    if (drawnBall) {
        nabola.push(drawnBall);

        // Mark the ball on each card if it matches
        cards.forEach(card => {
            card.rows.forEach(row => {
                row.forEach(cell => {
                    if (cell.value === drawnBall.number && !cell.isMarked) {
                        cell.isMarked = true;
                    }
                });
            });
        });

        // Check if any card matches a lucky card
        if (checkLuckyCard()) {
            alert('We have a Lucky Card!');
            drawBtn.setAttribute('disabled', 'true'); // Disable the draw button
        }

        render();
    }
});

render();
