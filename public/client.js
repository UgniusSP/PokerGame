const socket = io();

const players = {};
let currentPlayerId;
const playersAsArray = [];

socket.on('currentPlayerId', (id) => {
    currentPlayerId = id;
    
    updateDisplay();
})

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        if(!players[id]){
            players[id] = backendPlayers[id];
        } 
        players[id].chips = backendPlayers[id].chips;
        players[id].folded = backendPlayers[id].folded;
        players[id].bet = backendPlayers[id].bet;
    }

    for(const id in players){
        if(!backendPlayers[id]){
            delete players[id];
        }  
    }

    updateDisplay();
    
    console.log(players);
    
})

socket.on('bet', (pot) => { // pot value (Pot: ....)
    var potValue = 0;
    potValue += pot;
    document.getElementById("pot").textContent = potValue;

    updateDisplay();
})

function fold(){
    players[currentPlayerId].folded = true;
    socket.emit('fold');
    
    updateDisplay();
}

function bet(){
    const betAmount = document.getElementById("betInput").value;

    socket.emit('bet', betAmount);
}

function call(){
    socket.emit('call');
}

function displayCards() {
    const display = document.getElementById('handDisplay');
    display.innerHTML = '';

    for (const id in players) {
        const playerInfo = players[id];
        if (playerInfo.id === currentPlayerId && Array.isArray(playerInfo.hand)) { // dabartinis zaidejas
            for (const card of playerInfo.hand) {
                if(playerInfo.folded == true){
                    const cardImage = document.createElement('img');
                    cardImage.src = `playCards/Card_back_grey.svg.png`;
                    cardImage.alt = "Fold Card Back";
                    cardImage.width = 100;
                    display.appendChild(cardImage);
                } else {
                    const cardImage = document.createElement('img');
                    cardImage.src = `playCards/${card}.svg`;
                    cardImage.alt = card;
                    cardImage.width = 100;
                    display.appendChild(cardImage);
                }
                
            }
        } else if (Array.isArray(playerInfo.hand)) { // kitas zaidejas
            for (let i = 0; i < playerInfo.hand.length; i++) {
                if(playerInfo.folded == true){
                    const cardImage = document.createElement('img');
                    cardImage.src = `playCards/Card_back_grey.svg.png`;
                    cardImage.alt = "Fold Card Back";
                    cardImage.width = 100;
                    display.appendChild(cardImage);
                } else {
                    const cardImage = document.createElement('img');
                    cardImage.src = `playCards/Card_back_01.svg.png`;
                    cardImage.alt = "Card Back";
                    cardImage.width = 100;
                    display.appendChild(cardImage);
                }
                
            }
        }  
    }
}

function updateChips(id){
    if(players[id]){
        document.getElementById("chipCount").textContent = players[id].chips;
    }
}

function updateDisplay(){
    displayCards();
    updateChips(currentPlayerId);
}

