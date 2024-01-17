// poker logic
function createDeck() {
    const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const deck = [];
    let card = 0;
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < ranks.length; j++){
            let card = {Rank: ranks[j], Suit: suits[i]}
            deck.push(card);
        }
    }
    //console.log(deck);
    return deck;
}

function shuffle(deck){
    for(let i = 0; i < 1000; i++){
        let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
    }
    
}

function dealCards(deck){
    var hand = new Array(2);
    for(let i = 0; i < 2; i++){
        hand[i] = deck.pop();
    }
    return hand;
}

let deck = [];
deck = createDeck();
shuffle(deck);
let hand = [];
hand = dealCards(deck);
console.log(hand);

