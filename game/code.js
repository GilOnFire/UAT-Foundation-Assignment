let playerHand = [];
let dealerHand = [];
let gameActive = false;
let shuffleSoundCandidates = [
    'shuffle.mp3',
    
];
let shuffleSoundIndex = 0;

function initializeShuffleSound() {
    const sound = document.getElementById('shuffleSound');
    if (!sound) return;

    sound.addEventListener('error', function () {
        if (shuffleSoundIndex < shuffleSoundCandidates.length - 1) {
            shuffleSoundIndex += 1;
            sound.src = shuffleSoundCandidates[shuffleSoundIndex];
            sound.load();
        }
    });

    sound.src = shuffleSoundCandidates[shuffleSoundIndex];
    sound.load();
}

function playShuffleSound() {
    const sound = document.getElementById('shuffleSound');
    if (!sound) return;

    if (!sound.src) {
        initializeShuffleSound();
        return;
    }

    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(function () {
        // Browser autoplay rules may block playback until the player clicks a button.
    });
}

// Deck of cards represented as an array of values
var DECK_REFRESH_THRESHOLD = 8; // when deck length falls to this, refresh
function createDeck() {
    // standard single-deck values (4 suits)
    var singleSuit = [2,3,4,5,6,7,8,9,10,10,10,10];
    var d = [];
    for (var i=0; i<4; i++) d = d.concat(singleSuit);
    return d;
}
// Shuffle the deck to avoid predictability
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}
// Initialize the deck and shuffle it at the start
var deck = createDeck();
shuffle(deck);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShuffleSound);
} else {
    initializeShuffleSound();
}

// Function to reset the deck (reshuffle)
function resetDeck() {
    deck = createDeck();
    shuffle(deck);
    playShuffleSound();
    console.log('Deck reset (reshuffled)');
}

// Function to add a card to the player's hand
function drawRandomCard() {
    // refresh deck if it's getting low
    if (deck.length <= DECK_REFRESH_THRESHOLD) {
        resetDeck();
    }
    var randomIndex = Math.floor(deck.length * Math.random());
    // remove the card from the deck and return it
    var card = deck.splice(randomIndex, 1)[0];
    return card;
   
}
// Function to calculate the current value of a hand
function calculateHandValue(hand) {
    var sum = 0;
    for(var i=0; i < hand.length; i++) {
        sum += hand[i];
    }
    return sum;
}
// Function to handle the "Hit" action
function hit() {
    console.log("Hit button clicked");
    // drawRandomCard returns a card; push it once into the player's hand
    var card = drawRandomCard();
    playerHand.push(card);
    console.log('hit!');
    console.log('new player hand:', playerHand.join(', '));
    if(calculateHandValue(playerHand) > 21) {
        endGame("Player busts! Game over.", false);
        return;
    }
    updateUI();
}
// Function to handle the "Stand" action
function stand() {
    console.log("Stand button clicked");
    // Dealer draws until reaching 17 or higher
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(drawRandomCard());
    }
    var playerTotal = calculateHandValue(playerHand);
    var dealerTotal = calculateHandValue(dealerHand);
    var message = '';
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        message = 'Player wins!';
    } else if (playerTotal === dealerTotal) {
        message = 'Push (tie).';
    } else {
        message = 'Dealer wins.';
    }
    var playerWon = (dealerTotal > 21 || playerTotal > dealerTotal);
    endGame(message, playerWon);
}
// Function to start a new game
function startGame() {
    console.log("Start Game button clicked");
    hideResult();
    playShuffleSound();
    // Initialize player's hand
    playerHand = [drawRandomCard(), drawRandomCard()];
    // Initialize dealer's hand
    dealerHand = [drawRandomCard(), drawRandomCard()];
    gameActive = true;
    updateUI();
    setButtonStates();
}

// Update UI elements for hands and messages
function updateUI() {
    var playerEl = document.getElementById("playerHand");
    var dealerEl = document.getElementById("dealerHand");
    var messageEl = document.getElementById("gameMessage");
    if (playerEl) playerEl.innerHTML = "Your current hand is: " + playerHand.join(", ") + " (" + calculateHandValue(playerHand) + ")";
    if (dealerEl) {
        // If game is active, hide dealer's second card
        if (gameActive) {
            if (dealerHand.length > 0) {
                var first = dealerHand[0];
                dealerEl.innerHTML = "The dealer's current hand is: " + first + ", [hidden]";
            } else {
                dealerEl.innerText = "The dealer's current hand is: ";
            }
        } else {
                dealerEl.innerHTML = "The dealer's current hand is: " + dealerHand.join(", ") + " (" + calculateHandValue(dealerHand) + ")";
        }
    }
    if (messageEl) messageEl.innerHTML = '';
}
// Enable or disable buttons based on game state
function setButtonStates() {
    var startBtn = document.getElementById('StartGame');
    var hitBtn = document.getElementById('addCard');
    var standBtn = document.getElementById('keepHand');
    if (startBtn) startBtn.disabled = gameActive;
    if (hitBtn) hitBtn.disabled = !gameActive;
    if (standBtn) standBtn.disabled = !gameActive;
}
// Function to end the game and show results
function endGame(message, isWin) {
    gameActive = false;
    // reveal dealer hand and show message in the page
    var messageEl = document.getElementById('gameMessage');
    if (messageEl) messageEl.innerHTML = message;
    updateUI();
    setButtonStates();
    // show modal result screen
    showResult(message, !!isWin);
}
// Function to show the result modal with appropriate message and styling
function showResult(message, isWin) {
    var modal = document.getElementById('resultModal');
    var textEl = document.getElementById('resultText');
    var titleEl = document.getElementById('resultTitle');
    if (textEl) textEl.innerHTML = message;
    if (titleEl) titleEl.innerHTML = isWin ? 'You Win!' : 'Game Over';
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.toggle('win', !!isWin);
        modal.classList.toggle('lose', !isWin);
        modal.setAttribute('aria-hidden', 'false');
    }
}
// Function to hide the result modal
function hideResult() {
    var modal = document.getElementById('resultModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('win');
        modal.classList.remove('lose');
        modal.setAttribute('aria-hidden', 'true');
    }
}
// Reset game state for a new round
function resetGameState() {
    playerHand = [];
    dealerHand = [];
    gameActive = false;
    updateUI();
    setButtonStates();
}
// Handler for "Play Again" button in the result modal
function playAgain() {
    hideResult();
    // optionally refresh deck for a clean experience
    resetDeck();
    resetGameState();
    startGame();
}

function attachGameEvents() {
    const startBtn = document.getElementById('StartGame');
    const hitBtn = document.getElementById('addCard');
    const standBtn = document.getElementById('keepHand');
    const playAgainBtn = document.getElementById('playAgainBtn');

    if (startBtn) startBtn.addEventListener('click', startGame);
    if (hitBtn) hitBtn.addEventListener('click', hit);
    if (standBtn) standBtn.addEventListener('click', stand);
    if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachGameEvents);
} else {
    attachGameEvents();
}

// Update DOM displays (use join to present arrays as strings)
if (document.getElementById("playerHand")) {
    document.getElementById("playerHand").innerHTML = "Your current hand is: " + playerHand.join(", ");
}
if (document.getElementById("dealerHand")) {
    document.getElementById("dealerHand").innerHTML = "The dealer's current hand is: " + dealerHand.join(", ");
}
console.log('playerHand:', playerHand.join(', '));
console.log('dealerHand:', dealerHand.join(', '));