
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

        //console.log(this.deck)
        const hand = [];
        for (let i = 0; i < 2; i++) {
            hand[i] = this.deck.pop();
        }
        console.log(hand);
        return hand;
    }

    dealFlop() {
        this.deck.pop();

        const flop = [];
        for (let i = 0; i < 3; i++) {
            flop[i] = this.deck.pop();
        }
        return flop;
    }
    
}

module.exports = Cards;

