
// AudioController
// class to control the audio with methods  
class AudioController {
    constructor(){
        this.bgMusic = new Audio('insert bg music');
        this.matchSound = new Audio('match sound');
        this.victoryFanfare = new Audio('victory fanfare mp3');
    }
    startMusic(){
        this.bgMusic.play();
    }
    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    match() {
        this.matchSound.play();
    }
    victory(){
        this.victoryFanfare.play();
    }
}


// class for game itself that hold all game attributes
class MatchingGame {
    constructor(cards){
        this.cardsArray = cards;
        this.audioController = new AudioController();
    }
    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0; // might use just to show how many clicks it took?
        this.matchedCards = [];
        this.busy = true;

        this.shuffleCards();

        setTimeout(() => {
            //this.audioController.startMusic();
            this.shuffleCards();
            this.busy = false;
        }, 500);
        this.hideCards();

    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }
    canFlipCard(card){
        //return true;
        // return true if the specific card meets the three cases 
        // not in animation, not an already matched card, and not currently flipped to check for a match
        return (!this.busy  && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
    flipCard(card){
        if(this.canFlipCard(card)) {
            this.totalClicks++;
            card.classList.add('visible');

            //
            if(this.cardToCheck){
                this.checkForCardMatch(card);
            } else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else 
            this.cardMismatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        //this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMismatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    getCardType(card) {
        return card.getElementsByClassName('otter')[0].src;
    }
    gameOver() {
        // reset countdown but doesnt have any 
        document.getElementById('game-over-text').classList.remove('hidden');
        document.getElementById('game-over-text').classList.add('visible');
    }

    victory(){
        document.getElementById('game-over-text').classList.remove('hidden');
        document.getElementById('game-over-text').classList.add('visible');
    }
    shuffleCards(){
        for(let i = this.cardsArray.length-1; i > 0; i--) {
            let randIndex = Math.floor(Math.random()*(i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;

        }
    }

    
}

function ready() {
    // grab cards elements by css class name
    let cards = Array.from(document.getElementsByClassName('card'));

    // initialize a new MatchingGame with cards
    let game = new MatchingGame(cards);

    // start the game automatically 
    game.startGame();


    // add click eventListener to each card, when clicked call flipCard method
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}

if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}
