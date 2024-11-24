const createDeck = () => {
    const deck = [];
    for (let i = 1; i <= 7; i++) {
        for (let j = 0; j < 4; j++) {
            deck.push({ name: `${i}`, value: i });
        }
    }
    for (let j = 0; j < 12; j++) { 
        deck.push({ name: "Special", value: 0.5 });
    }
    return deck.sort(() => Math.random() - 0.5); // Barajar 
};

let deck = createDeck();
let playerName = '';
let playerMoney = 0;
let playerHand = [];
let dealerHand = [];
let currentBet = 0;

const startGameButton = document.getElementById("start-game");
const gameArea = document.getElementById("game-area");
const playerInfo = document.getElementById("player-info");
const playerNameDisplay = document.getElementById("player-name-display");
const playerMoneyDisplay = document.getElementById("player-money-display");
const newRoundButton = document.getElementById("new-round");
const endGameButton = document.getElementById("end-game");
const playerCardsDiv = document.getElementById("player-cards");
const dealerCardsDiv = document.getElementById("dealer-cards");
const drawCardButton = document.getElementById("draw-card");
const standButton = document.getElementById("stand");
const betInput = document.getElementById("bet-input");

function disableButtons() {
    drawCardButton.disabled = true;
    standButton.disabled = true;
}

function enableButtons() {
    drawCardButton.disabled = false;
    standButton.disabled = false;
}

function updatePlayerMoneyDisplay() {
    playerMoneyDisplay.textContent = `Total money: ${playerMoney} €`;
}

function showElement(element) {
    element.classList.remove("hidden");
}

function hideElement(element) {
    element.classList.add("hidden");
}


startGameButton.addEventListener("click", () => {
    playerName = document.getElementById("player-name").value;
    playerMoney = parseFloat(document.getElementById("player-money").value);

    if (playerName && playerMoney > 0 && !isNaN(playerMoney)) {
        playerNameDisplay.textContent = playerName;
        updatePlayerMoneyDisplay();
        hideElement(playerInfo);
        showElement(gameArea);
        enableButtons();
        Swal.fire('Welcome!', `Good luck, ${playerName}!`, 'success');
    } else {
        Swal.fire("Error", "Please enter a valid name and initial money.", "error");
        disableButtons();
    }
});



newRoundButton.addEventListener("click", () => {
    const betAmount = parseFloat(betInput.value);

    if (betAmount <= 0 || betAmount > playerMoney || isNaN(betAmount)) {
        Swal.fire("Error", "Invalid bet. Make sure it does not exceed your money.", "error");
        return;
    }

    currentBet = betAmount;
    playerHand = [];
    dealerHand = [];
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    showElement(drawCardButton);
    showElement(standButton);
    Swal.fire("New Round", "May the cards be in your favor!", "info");
});



endGameButton.addEventListener("click", () => {
    Swal.fire({
        title: "Game Over",
        text: `Thank you for playing, ${playerName}! Your total money is: ${playerMoney} €.`,
        icon: "success",
        confirmButtonText: "Accept",
    }).then(() => {
        location.reload(); 
    });
});



drawCardButton.addEventListener("click", () => {
    const card = deck.pop(); 
    playerHand.push(card);

    const cardDiv = document.createElement("div");
    cardDiv.textContent = card.name; 
    cardDiv.classList.add("card");
    playerCardsDiv.appendChild(cardDiv);

    const total = playerHand.reduce((acc, card) => acc + card.value, 0);

    if (total > 7.5) {
        Swal.fire("You Lost!", "Your total exceeds 7.5.", "error").then(() => {
            playerMoney -= currentBet;
            updatePlayerMoneyDisplay();
            hideElement(drawCardButton);
            hideElement(standButton);
        });
    }
});



standButton.addEventListener("click", () => {
    let dealerTotal = dealerHand.reduce((acc, card) => acc + card.value, 0);

    while (dealerTotal < 5.5) {
        const card = deck.pop(); 
        dealerHand.push(card);

        const cardDiv = document.createElement("div");
        cardDiv.textContent = card.name; 
        cardDiv.classList.add("card");
        dealerCardsDiv.appendChild(cardDiv);

        dealerTotal = dealerHand.reduce((acc, card) => acc + card.value, 0);
    }

    const playerTotal = playerHand.reduce((acc, card) => acc + card.value, 0);

    if (playerTotal > 7.5) {
        Swal.fire("You Lost!", "Your total exceeds 7.5.", "error");
    } else if (dealerTotal > 7.5 || playerTotal > dealerTotal) {
        Swal.fire("You Won!", `You won ${currentBet} €!`, "success");
        playerMoney += currentBet;
    } else if (playerTotal < dealerTotal) {
        Swal.fire("You Lost!", "The dealer has a higher score.", "error");
        playerMoney -= currentBet;
    } else {
        Swal.fire("It's a Tie!", "Both have the same score.", "info");
    }

    updatePlayerMoneyDisplay();
    hideElement(drawCardButton);
    hideElement(standButton);
});
