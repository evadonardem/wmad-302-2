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
            B: _.range(1, 16),
            I: _.range(16, 31),
            N: _.range(31, 46),
            G: _.range(46, 61),
            O: _.range(61, 76),
        };
        for (const [letter, nums] of Object.entries(ranges)) {
            nums.forEach(num => this.#balls.push(new BingoBall(letter, num)));
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
    matchedTemplates = [];

    constructor() {
        this.#initCells();
    }

    #initCells() {
        this.#cells = [];
        const columns = {
            B: _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5),
            I: _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5),
            N: _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5),
            G: _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5),
            O: _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5),
        };
        const letters = ['B', 'I', 'N', 'G', 'O'];

        for (let row = 0; row < 5; row++) {
            this.#cells[row] = [];
            for (let col = 0; col < 5; col++) {
                let val = columns[letters[col]][row];
                this.#cells[row][col] = {
                    value: (row === 2 && col === 2) ? "FREE" : val,
                    isMarked: (row === 2 && col === 2)
                };
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

    mark(ball) {
        const letterIndex = { B: 0, I: 1, N: 2, G: 3, O: 4 }[ball.letter];
        for (let row = 0; row < 5; row++) {
            if (this.#cells[row][letterIndex].value === ball.number) {
                this.#cells[row][letterIndex].isMarked = true;
            }
        }
    }

    getMarkedCells() {
        let marked = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (this.#cells[i][j].isMarked) {
                    marked.push(`${i}-${j}`);
                }
            }
        }
        marked.sort();
        return marked;
    }
}

// === Lucky cards templates ===
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

const luckyCardsCellMatches = luckyCards.map(template => {
    let matches = [];
    template.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) matches.push(`${i}-${j}`);
        });
    });
    matches.sort();
    return matches;
});

// === Globals ===
let cards = [];
let nabola = [];
let autoDrawInterval = null;
const tambiolo = new BingoMachine();

// === Generate cards ===
function generateCards(count = 1) {
    let newCards = [];
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

// === Check for winners ===
function checkLuckyCards() {
    let winners = [];
    cards.forEach(card => {
        const marked = card.getMarkedCells();
        const matchedTemplates = [];
        luckyCardsCellMatches.forEach((template, idx) => {
            const templateWithFree = [...template, '2-2']; // FREE cell
            if (templateWithFree.every(cell => marked.includes(cell))) matchedTemplates.push(idx);
        });
        card.matchedTemplates = matchedTemplates;
        card.luckyCard = matchedTemplates.length > 0;
        if (card.luckyCard) winners.push(card);
    });

    // Remove old banner
    const oldBanner = document.querySelector(".winner-banner");
    if (oldBanner) oldBanner.remove();

    if (winners.length > 0) {
        if (autoDrawInterval) {
            clearInterval(autoDrawInterval);
            autoDrawInterval = null;
            autoDrawBtn.textContent = "Auto Draw";
            autoDrawBtn.classList.replace("btn-danger", "btn-warning");
        }

        drawBtn.setAttribute("disabled", "true");

        const container = document.querySelector(".container");
        const banner = document.createElement("div");
        banner.className = "winner-banner";

        if (winners.length === 1) {
            banner.innerHTML = `🎉 <strong>We have a WINNER!</strong> 🎉<br>Pattern matched: ${winners[0].matchedTemplates.map(n => n + 1).join(', ')}`;
        } else {
            banner.innerHTML = `🎉 <strong>It's a TIE!</strong> 🎉<br>${winners.length} cards won! Patterns matched: ${winners.map(c => c.matchedTemplates.map(n => n + 1).join(',')).join(' | ')}`;
        }

        container.prepend(banner);
    }
}

// === Render ===
function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    const patternColors = ['#ff69b4', '#00ffff', '#7fff00'];

    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map(card => {
            const rows = card.rows;
            return `<div class="col-md-4 mb-3">
                <table class="table table-bordered text-center shadow-sm ${card.luckyCard ? 'winner-glow' : ''}">
                    <thead class="table-primary"><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></thead>
                    <tbody>
                        ${rows.map((row, rIdx) => `<tr>
                            ${row.map((cell, cIdx) => {
                                let cellStyle = '';
                                if (cell.isMarked) cellStyle += 'background-color:#ff4500;color:white;font-weight:bold;';
                                if (card.luckyCard) {
                                    let appliedColor = null;
                                    for (const tIdx of card.matchedTemplates) {
                                        if (luckyCards[tIdx][rIdx][cIdx]) {
                                            appliedColor = patternColors[tIdx];
                                            break;
                                        }
                                    }
                                    if (appliedColor) cellStyle += `background-color:${appliedColor}; color:#000; font-weight:bold;`;
                                }
                                return `<td style="${cellStyle}">${cell.value}</td>`;
                            }).join('')}
                        </tr>`).join('')}
                    </tbody>
                    <tfoot><td colspan=5>${card.luckyCard ? `Pattern(s) WINNER: ${card.matchedTemplates.map(n => n + 1).join(', ')}` : '&nbsp;'}</td></tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map(template => `<table class="table table-bordered text-center shadow-sm mb-3">
        <thead class="table-primary"><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></thead>
        <tbody>${template.map(row => `<tr>${row.map(cell => `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`).join('');

    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map(b => `<span class="badge bg-primary mb-1">${b.letter}<br>${b.number}</span>`).join(' ');
}

// === Events ===
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const autoDrawBtn = document.getElementById('autoDraw');

numberOfCardsInput.addEventListener('change', e => {
    const count = e.target.value;
    cards = generateCards(count);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});

rollBtn.addEventListener('click', () => tambiolo.roll());

drawBtn.addEventListener('click', () => {
    const bola = tambiolo.draw();
    if (!bola) { alert("No more balls left!"); drawBtn.setAttribute('disabled', 'true'); return; }
    nabola.push(bola);
    cards.forEach(card => card.mark(bola));
    checkLuckyCards();
    render();
});

autoDrawBtn.addEventListener('click', () => {
    if (autoDrawInterval) {
        clearInterval(autoDrawInterval);
        autoDrawInterval = null;
        autoDrawBtn.textContent = "Auto Draw";
        autoDrawBtn.classList.replace("btn-danger", "btn-warning");
    } else {
        autoDrawBtn.textContent = "Stop Auto";
        autoDrawBtn.classList.replace("btn-warning", "btn-danger");

        autoDrawInterval = setInterval(() => {
            const bola = tambiolo.draw();
            if (!bola) {
                clearInterval(autoDrawInterval);
                autoDrawInterval = null;
                autoDrawBtn.textContent = "Auto Draw";
                autoDrawBtn.classList.replace("btn-danger", "btn-warning");
                alert("No more balls left!");
                drawBtn.setAttribute('disabled', 'true');
                return;
            }
            nabola.push(bola);
            cards.forEach(card => card.mark(bola));
            checkLuckyCards();
            render();
        }, 1000);
    }
});

render();
