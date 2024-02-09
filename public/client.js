const socket = io();

const players = {};
let currentPlayerId;

socket.on('currentPlayerId', (id) => {
    currentPlayerId = id;
    //console.log(currentPlayerId);
    displayCards();
    updateChips(currentPlayerId);
})

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        if(!players[id]){
            players[id] = backendPlayers[id];
        } 
        players[id].chips = backendPlayers[id].chips;
    }

    for(const id in players){
        if(!backendPlayers[id]){
            delete players[id];
        }  
    }

    updateChips(currentPlayerId);
    console.log(players);
})

socket.on('raise', (pot) => {
    var potValue = 0;
    potValue += pot;
    document.getElementById("pot").textContent = potValue;

})

function raise(){
    
    const raiseAmount = document.getElementById("raiseInput").value;

    socket.emit('raise', raiseAmount);
}

function displayCards() {
    const display = document.getElementById('handDisplay');
    display.innerHTML = '';

    for (const id in players) {
        const playerInfo = players[id];
        if (playerInfo.id === currentPlayerId && Array.isArray(playerInfo.hand)) {
            for (const card of playerInfo.hand) {
                const cardImage = document.createElement('img');
                cardImage.src = `playCards/${card}.svg`;
                cardImage.alt = card;
                cardImage.width = 100;
                display.appendChild(cardImage);
            }
        } else if (Array.isArray(playerInfo.hand)) {
            for (let i = 0; i < playerInfo.hand.length; i++) {
                const cardImage = document.createElement('img');
                cardImage.src = `playCards/Card_back_01.svg.png`;
                cardImage.alt = "Card Back";
                cardImage.width = 100;
                display.appendChild(cardImage);
            }
        }
    }
}

function updateChips(id){
    if(players[id]){
        document.getElementById("chipCount").textContent = players[id].chips;
    }
}
