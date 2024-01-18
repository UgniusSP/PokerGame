// poker logic

var deck = [];
var playerNumber = 3;
var handLength = 2*playerNumber;
var hand = [];

function createDeck() {
    const suits = ["hearts", "diamonds", "clubs", "spades"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king", "ace"];

    tmp = [];
    let card = 0;
    for(let i = 0; i < suits.length; i++){
        for(let j = 0; j < ranks.length; j++){
            let card = `${ranks[j]}_of_${suits[i]}`;
            tmp.push(card);
        }
    }
    
    return tmp;
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

function dealCards(){
    deck = createDeck();
    shuffle(deck);

    for(let i = 0; i < handLength; i++){
        hand[i] = deck.pop();
    }
    return hand;
}

function renderCards(displayId, numberOfCards, cardAction) {
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

function renderHand(){

    hand = dealCards(deck);
    console.log(hand);

    renderCards('handDisplay', hand.length, () => deck.shift());
}

function renderFlop(){
    deck.pop();

    renderCards('flopDisplay', 3, () => deck.pop());
}

function renderTurn(){
    deck.pop();

    renderCards('turnDisplay', 1, () => deck.pop());
}

function renderRiver(){
    deck.pop();

    renderCards('riverDisplay', 1, () => deck.pop());
}

function startGame(){
    
    renderHand();
    console.log(deck);
    renderFlop();
    console.log(deck);
    renderTurn();
    renderRiver();
}



