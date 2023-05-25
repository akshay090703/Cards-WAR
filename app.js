const newDeck = document.getElementById('new-deck');
const drawCards = document.getElementById("draw-cards"); 
const cardsContainer = document.getElementById("cards-container");
const cardSlot = document.getElementsByClassName("card-slot");
const header = document.getElementById('header');
const remainingCardsEl = document.getElementById("remaining-cards");
const computerScoreEl = document.getElementById("computer-score");
const userScoreEl = document.getElementById("user-score");
drawCards.disabled = true;

let computerScore = 0;
let userScore = 0;
let deckId;
let remainingCards;

newDeck.addEventListener('click', async (event) => {
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    const data = await response.json()
    
    drawCards.disabled = false;
    console.log(data),
    deckId = data.deck_id
    remainingCards = data.remaining
    remainingCardsEl.innerText = `Remaining Cards: ${remainingCards}`;
});

drawCards.addEventListener("click", async () => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await response.json()
    
    const cards = data.cards
    remainingCards -= 2;
    const roundWinner = comparingTwoCards(data.cards[0], data.cards[1]);
    header.textContent = roundWinner;
    gameEndingCond();
    remainingCardsEl.innerText = `Remaining Cards: ${remainingCards}`;

    cardSlot[0].innerHTML = 
    `
        <img src=${cards[0].image} class="card" />
    `;
    cardSlot[1].innerHTML = 
    `
        <img src=${cards[1].image} class="card" />
    `;
});

const comparingTwoCards = (card1, card2) => {
    const deckArray = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"];
    const card1Index = deckArray.indexOf(card1.value);
    const card2Index = deckArray.indexOf(card2.value);
    if(card1Index > card2Index) {
        computerScore++;
        computerScoreEl.textContent = computerScore;
        return "Computer Wins!"
    } else if(card1Index < card2Index) {
        userScore++;
        userScoreEl.textContent = userScore;
        return "You Win!"
    } else {
        return "War!"
    }
}

const gameEndingCond = () => {
    if(remainingCards < 1) {
        drawCards.disabled = true;
        if (computerScore > userScore) {
            header.textContent = "Computer Won the Game!"
        } else if (computerScore < userScore) {
            header.textContent = "You Won the Game!"
        } else {
            header.textContent = "It's a Tie Game!";
        }
    }
}