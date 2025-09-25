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
      for (let num = 1; num <= 75; num++) {
        let letter;
        if (num <= 15) letter = 'B';
        else if (num <= 30) letter = 'I';
        else if (num <= 45) letter = 'N';
        else if (num <= 60) letter = 'G';
        else letter = 'O';
        this.#balls.push(new BingoBall(letter, num));
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
        ['B', _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5)],
        ['I', _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5)],
        ['N', _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5)],
        ['G', _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5)],
        ['O', _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5)],
      ]);
  
      this.#cells = [];
      for (let row = 0; row < 5; row++) {
        this.#cells[row] = [];
        let letters = ['B', 'I', 'N', 'G', 'O'];
        for (let col = 0; col < 5; col++) {
          this.#cells[row][col] = {
            value: randomCellValues.get(letters[col])[row],
            isMarked: false
          };
        }
      }
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
  let gameOver = false;
  
  function generateCards(count = 1) {
    let newCards = [];
    for (let i = 0; i < count; i++) {
      newCards.push(new BingoCard());
    }
    return newCards;
  }
  
  function checkLuckyCards() {
    cards.forEach((card) => {
      let matched = [];
      card.rows.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell.isMarked) {
            matched.push(`${i}-${j}`);
          }
        });
      });
      matched.sort();
      card.luckyCard = luckyCardsCellMatches.some((pattern) =>
        pattern.every((cellId) => matched.includes(cellId))
      );
      if (card.luckyCard) {
        gameOver = true;
      }
    });
  }
  
  function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
  
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
          const rows = card.rows;
          return `<div class="col-md-4">
                <table class="table table-bordered text-center ${card.luckyCard ? 'table-success' : ''}">
                    <thead class="table-primary">
                        <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                      return `<tr>
                            ${row.map(cell =>
                              `<td class="${cell.isMarked ? 'bg-danger' : ''}">${cell.value}</td>`
                            ).join('')}
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot>
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;
  
    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
      return `<table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                  return `<tr>
                        ${row.map(cell =>
                          `<td class="${cell ? 'bg-danger' : ''}">&nbsp;</td>`
                        ).join('')}
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');
  
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) =>
      `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`
    ).join(' ');
  }
  
  const numberOfCardsInput = document.getElementById('numberOfCards');
  const rollBtn = document.getElementById('roll');
  const drawBtn = document.getElementById('draw');
  
  numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    gameOver = false;
    drawBtn.removeAttribute('disabled');
    render();
  });
  
  rollBtn.addEventListener('click', () => {
    tambiolo.roll();
  });
  
  drawBtn.addEventListener('click', () => {
    if (gameOver) return;
  
    let bola = tambiolo.draw();
    if (!bola) {
      alert('No more balls left!');
      drawBtn.setAttribute('disabled', true);
      return;
    }
  
    nabola.push(bola);
  
    cards.forEach((card) => {
      card.rows.forEach((row) => {
        row.forEach((cell) => {
          if (cell.value === bola.number) {
            cell.isMarked = true;
          }
        });
      });
    });
  
    checkLuckyCards();
  
    if (gameOver) {
     
      drawBtn.setAttribute('disabled', true);
    }
  
    render();
  });
  
  render();
  