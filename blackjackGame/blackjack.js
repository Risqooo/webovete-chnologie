document.addEventListener("DOMContentLoaded", function() {
    const suits = ["H", "D", "C", "S"];
    const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let deck = [];
    let playerHand = [];
    let dealerHand = [];
    let isPlayerTurn = true;
    let gameStatus = "";

    function initGame() {
        deck = createDeck();
        shuffleDeck(deck);
        playerHand = [drawCard(), drawCard()];
        dealerHand = [drawCard(), drawCard()];
        isPlayerTurn = true;
        gameStatus = "Your turn";
        updateDisplay();
        checkForBlackjack();
    }

    function createDeck() {
        let deck = [];
        for (let suit of suits) {
            for (let value of values) {
                deck.push(value + "-" + suit);
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function drawCard() {
        return deck.pop();
    }

    function updateDisplay() {
        document.getElementById("player-cards").innerHTML = renderHand(playerHand);
        document.getElementById("player-value").textContent = "Player's Value: " + calculateHandValue(playerHand);
        document.getElementById("dealer-cards").innerHTML = renderHand(dealerHand, isPlayerTurn);
        document.getElementById("dealer-value").textContent = isPlayerTurn ? "Dealer's Value: ?" : "Dealer's Value: " + calculateHandValue(dealerHand);
        document.getElementById("game-status").textContent = gameStatus;
    }
    

    function renderHand(hand, hideSecondCard = false) {
        return hand.map((card, index) => {
            if (index === 1 && hideSecondCard) {
                return `<img src='cards/BACK.png' />`;
            } else {
                return `<img src='cards/${card}.png' />`;
            }
        }).join("");
    }

    document.getElementById("hit-button").addEventListener("click", function() {
        if (isPlayerTurn) {
            playerHand.push(drawCard());
            if (calculateHandValue(playerHand) > 21) {
                gameStatus = "Player busts!";
                isPlayerTurn = false;
            }
            updateDisplay();
        }
    });

    document.getElementById("stand-button").addEventListener("click", function() {
        if (isPlayerTurn) {
            isPlayerTurn = false;
            dealerTurn();
        }
    });

    document.getElementById("new-game-button").addEventListener("click", function() {
        initGame();
    });

    function dealerTurn() {
        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(drawCard());
        }
        endGame();
    }

    function endGame() {
        let playerValue = calculateHandValue(playerHand);
        let dealerValue = calculateHandValue(dealerHand);
        if (playerValue > 21) {
            gameStatus = "Player busts!";
        } else if (dealerValue > 21) {
            gameStatus = "Player wins!";
        } else if (playerValue > dealerValue) {
            gameStatus = "Player wins!";
        } else if (playerValue < dealerValue) {
            gameStatus = "Dealer wins!";
        } else {
            gameStatus = "It's a tie!";
        }
        updateDisplay();
    }

    function calculateHandValue(hand) {
        let value = 0;
        let aceCount = 0;
        for (let card of hand) {
            let cardValue = card.split("-")[0];
            if (cardValue === "A") {
                aceCount++;
                value += 11;
            } else if (["J", "Q", "K"].includes(cardValue)) {
                value += 10;
            } else {
                value += parseInt(cardValue);
            }
        }
        while (value > 21 && aceCount > 0) {
            value -= 10;
            aceCount--;
        }
        return value;
    }

    function checkForBlackjack() {
        if (calculateHandValue(playerHand) === 21) {
            gameStatus = "Blackjack! Player wins!";
            isPlayerTurn = false;
            updateDisplay();
        }
    }

    initGame();
});
