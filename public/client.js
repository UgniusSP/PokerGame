const socket = io()

const pokergame = new Cards();
const player = new Player(20000)
const players = {}

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        //const backendPlayer = backendPlayers[id];

        if(!players[id]){
            players[id] = new Player(20000, pokergame.dealCards());
        }
    }
    
    displayCards();
    console.log(players)
})

function displayCards() {
    const display = document.getElementById('handDisplay');
    display.innerHTML = '';

    for (const id in players) {
        const playerInfo = players[id];
        const hand = playerInfo.hand;

        if (hand && Array.isArray(hand)) {
            for (const card of hand) {
                const cardImage = document.createElement('img');
                cardImage.src = `playCards/${card}.svg`;
                cardImage.alt = card;
                cardImage.width = 100;

                display.appendChild(cardImage);
            }
        }
    }
}



