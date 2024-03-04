const socket = io();

const players = {};
let currentPlayerId;
const playersAsArray = [];
let sb = false;
let bb = false;

socket.on('currentPlayerId', (id) => {
    currentPlayerId = id;
})

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        if(!players[id]){
            players[id] = backendPlayers[id];
        } 
        players[id].hand = backendPlayers[id].hand;
    }

    for(const id in players){
        if(!backendPlayers[id]){
            delete players[id];
        }  
    }

    updateDisplay();
    console.log(players);
    
});

socket.on('bet', (data) => { 
    for(const id in data.players){
        players[id].bet = data.players[id].bet;
        players[id].chips = data.players[id].chips;
    }
    
    var potValue = 0;
    potValue += data.pot; 

    updateChips(currentPlayerId);
    document.getElementById("pot").textContent = data.pot;
});

socket.on('fold', (backendPlayers) => {
    for(const id in backendPlayers){
        players[id].folded = backendPlayers[id].folded;
    }

});


socket.on('flop', (flop) => {
    console.log(flop);

    displayCards(flop.length, flop, 'flopDisplay');

})

socket.on('turn', (turn) => {
    console.log(turn);

    displayCards(turn.length, turn, 'turnDisplay');

})

socket.on('message', () => {
    alert('Sorry, the game is full. Please try again later.');
    window.location.href = '/disconnect'; // Redirect to the disconnect screen
})

socket.on('blinds', ({smallBlindIndex, bigBlindIndex, playersObj}) => {

    if(currentPlayerId === playersObj[smallBlindIndex]){
        sb = true;
    } else if(currentPlayerId === playersObj[bigBlindIndex]){
        bb = true;
    }
    
})

function fold(){
    players[currentPlayerId].folded = true;
    socket.emit('fold');
    
}

function bet(){
    const betAmount = document.getElementById("betInput").value;

    socket.emit('bet', betAmount);
}

function call(){
    socket.emit('call');
}

function updateChips(id){
    if(players[id]){
        document.getElementById("chipCount").textContent = players[id].chips;
    }
}

function updateDisplay(){
    displayHands();
    updateChips(currentPlayerId);
}

function startGame(){
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameplay").style.display = "block";

    socket.emit('startGame');
}

