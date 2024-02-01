class Cards {
    constructor() {
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
        if(this.deck.length === 0){
            this.deck = this.createDeck();
            this.shuffle();
        }

        console.log(this.deck)
        const hand = [];
        for (let i = 0; i < 2; i++) {
            hand[i] = this.deck.pop();
        }
        console.log(hand)
        return hand;
    }

    renderCards(displayId, numberOfCards, cardAction) {
        const display = document.getElementById(displayId);
        display.innerHTML = '';
    
        for (let i = 0; i < numberOfCards; i++) {
            const tmp = cardAction(i); 
            const cardImage = document.createElement('img');
            cardImage.src = `playCards/${tmp}.svg`; 
            cardImage.alt = tmp;
            cardImage.width = 100; 
    
            display.appendChild(cardImage);
        }
    }
    
    renderHand() {
        this.hand = this.dealCards()
    
        this.renderCards('handDisplay', 2, (i) => this.hand[i]);
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

}

const pokergame = new Cards();
pokergame.renderHand();

