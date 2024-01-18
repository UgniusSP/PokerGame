// poker logic

var deck;
var hand;

function createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

    deck = [];
    let card = 0;
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < ranks.length; j++){
            let card = `${ranks[j]}_of_${suits[i]}`;
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
    hand = new Array(2);
    for(let i = 0; i < 2; i++){
        hand[i] = deck.pop();
    }
    return hand;
}

function renderHand(hand){
    const handDisplay = document.getElementById('handDisplay');
    handDisplay.innerHTML = ''; // Clear previous content

    for (let i = 0; i < hand.length; i++) {
        const cardImage = document.createElement('img');
        cardImage.src = `playCards/${hand[i]}.svg`; // Assuming images are in the "cards" directory
        cardImage.alt = hand[i];
        cardImage.width = 100; // Set the desired width

        handDisplay.appendChild(cardImage);
    }
}

function startGame(){
    deck = createDeck();
    shuffle(deck);
    hand = [];
    hand = dealCards(deck);
    
    console.log(hand);

    renderHand(hand);
}



