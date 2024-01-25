class pokerGame {
    constructor(playerNumber) {
        this.playerNumber = playerNumber;
        this.handLength = 2 * playerNumber;
        this.deck = [];
        this.hand = [];
    }

    createDeck() {
        const suits = ["hearts", "diamonds", "clubs", "spades"];
        const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

        const tmp = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                const card = `${rank}_of_${suit}`;
                tmp.push(card);
            }
        }

        return tmp;
    }

    shuffle() {
        for (let i = 0; i < 1000; i++) {
            const location1 = Math.floor(Math.random() * this.deck.length);
            const location2 = Math.floor(Math.random() * this.deck.length);
            const tmp = this.deck[location1];

            this.deck[location1] = this.deck[location2];
            this.deck[location2] = tmp;
        }
    }

    dealCards() {
        this.deck = this.createDeck();
        this.shuffle();

        for (let i = 0; i < this.handLength; i++) {
            this.hand[i] = this.deck.pop();
        }

        return this.hand;
    }

    renderCards(displayId, numberOfCards, cardAction) {
        const display = document.getElementById(displayId);
        display.innerHTML = '';
    
        for (let i = 0; i < numberOfCards; i++) {
            const tmp = cardAction(); 
            const cardImage = document.createElement('img');
            cardImage.src = `playCards/${tmp}.svg`; 
            cardImage.alt = tmp;
            cardImage.width = 100; 
    
            display.appendChild(cardImage);
        }
    }
    
    renderHand() {
        this.hand = this.dealCards();
        console.log(this.hand);
    
        this.renderCards('handDisplay', this.hand.length, () => this.deck.shift());
    }
    
    renderFlop() {
        this.deck.pop();
    
        this.renderCards('flopDisplay', 3, () => this.deck.pop());
    }
    
    renderTurn() {
        this.deck.pop();
    
        this.renderCards('turnDisplay', 1, () => this.deck.pop());
    }
    
    renderRiver() {
        this.deck.pop();
    
        this.renderCards('riverDisplay', 1, () => this.deck.pop());
    }

    startGame() {
        this.renderHand();
    }

}

const cards = new pokerGame(1);
cards.startGame();

