function generateCards(count = 1) {
    const cardsPlaceholder = document.getElementById('cardsPlaceholder');

    cardsPlaceholder.innerHTML = "";

    // generate cards using loops
    for (let i = 0; i < count; i++) {
        cardsPlaceholder.innerHTML += `Card-${i} `;
    }
} 


document.getElementById('numberOfCards').addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    generateCards(numberOfCards);
});