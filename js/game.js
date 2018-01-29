// Variables
// Grab all the cards (NodeList) and spread into array.
let cards = [...document.querySelectorAll('.card')];
// Grab the deck of cards.
const deck = document.querySelector('.deck');
// Star Rating.
let starRating = [...document.querySelectorAll('.star-rating li')];
// Timer.
let timer = document.querySelector('.timer');
let seconds;
let minutes;
let interval;
// Moves.
let moves = 0;
let counter = document.querySelector('.moves__count');
// Restart Button.
const restartButton = document.querySelector('.restart-btn');
// Initialise OpenedCards array.
let openedCards = [];
// Grab all the matched cards (Array).
let matchedCard = document.getElementsByClassName('card--match');
// Modal
const modal = document.querySelector('.overlay');
const modalClose = document.querySelector('.overlay__close-btn');
const modalPlayAgain = document.querySelector('.overlay__play-btn');

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex--);
    // Add swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// Start game.
function startGame() {
  // Shuffle the deck of cards.
  let shuffleCards = shuffle(cards);

  shuffleCards.forEach(card => {
    deck.appendChild(card);
  });

  // Remove all existing classes from each card.
  cards.forEach(card => card.classList.remove('card--show', 'card--open', 'card--match', 'card--disabled'));

  // Reset moves and counter.
  moves = 0;
  counter.innerHTML = moves;

  // Reset the timer.
  timer.innerHTML = ' 0 mins 0 secs';
  clearInterval(interval);
}

function showCard() {
  this.classList.toggle('card--open');
  this.classList.toggle('card--show');
  this.classList.toggle('card--disabled');
}

function openCards() {
  openedCards.push(this);
  let l = openedCards.length;

  if (l === 2) {
    moveCounter();
    return openedCards[0].dataset.icon === openedCards[1].dataset.icon
      ? cardsMatched()
      : cardsUnmatched();
  }
}

function cardsMatched() {
  openedCards[0].classList.add('card--match');
  openedCards[1].classList.add('card--match');
  openedCards[0].classList.remove('card--show', 'card--open');
  openedCards[1].classList.remove('card--show', 'card--open');
  openedCards = [];
}

function cardsUnmatched() {
  openedCards[0].classList.add('card--unmatched');
  openedCards[1].classList.add('card--unmatched');
  disableCards();
  setTimeout(function() {
    openedCards[0].classList.remove('card--show', 'card--open', 'card--unmatched');
    openedCards[1].classList.remove('card--show', 'card--open', 'card--unmatched');
    enableCards();
    openedCards = [];
  }, 1100);
}

function disableCards() {
  cards.forEach(card => {
    card.classList.add('card--disabled');
  });
}

function enableCards() {
  cards.forEach(card => {
    card.classList.remove('card--disabled');
  });

  let m = Array.from(matchedCard);
  m.forEach(matchedCard => {
    matchedCard.classList.add('card--disabled');
  });
}

function moveCounter() {
  moves++;
  counter.innerHTML = moves;

  // Start the clock.
  if (moves === 1) {
    seconds = 0;
    minutes = 0;
    startTimer()
  }

  // Set star rating.
  if (moves > 2 && moves < 4) {
    starRating.forEach((star, index) => {
      if (index > 1) {
        star.style.display = 'none';
      }
    });
  } else if (moves > 5){
    starRating.forEach((star, index) => {
      if (index > 0) {
      star.style.display = 'none';
    }
  });
  }
}

// Game timer
function startTimer() {
  interval = setInterval(function () {
    timer.innerHTML = minutes + 'mins' + ' ' + seconds + 'secs';
    seconds++;

    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }
  }, 1000);
}

// Congrats Modal.
function congratulations() {
  if (matchedCard.length === cards.length) {
    clearInterval(interval);
    finalTime = timer.innerHTML;

    // Show the modal.
    modal.classList.add('overlay--show');

    // Declare star rating
    let starRating = document.querySelector('.star-rating').innerHTML;

    // Show modal moves, rating and time.
    document.querySelector('.overlay__moves').innerHTML = `You made ${moves} moves`;
    document.querySelector('.overlay__time').innerHTML = `in ${finalTime}`;
    document.querySelector('.overlay__rating').innerHTML = starRating;
  }
}

function closeModal() {
  modal.classList.remove('overlay--show');
  startGame();
}

function playAgain() {
  modal.classList.remove('overlay--show');
  startGame();
}

// Listeners.
// Add event listener to each card.
cards.forEach(card => card.addEventListener('click', showCard));
cards.forEach(card => card.addEventListener('click', openCards));
cards.forEach(card => card.addEventListener('click', congratulations));

restartButton.addEventListener('click', startGame);
modalClose.addEventListener('click', closeModal);
modalPlayAgain.addEventListener('click', playAgain);

// Start the game on page load.
window.onload = startGame();