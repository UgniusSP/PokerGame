const express = require('express')
const app = express()

//socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const port = 3000
const Cards = require('./public/Cards')
const cards = new Cards()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {};
let pot = 0;

const smallBlindAmount = 500;
const bigBlindAmount = 1000;
let smallBlindIndex = 0;
let bigBlindIndex = 1;

let playerQuantity = 2;
let playerCount = 0;

io.on('connection', (socket) => {
    console.log('a user connected');

    playerCount++;
    if(playerCount > playerQuantity){
        socket.emit('message');
        socket.disconnect(true);
        return;
    }

    players[socket.id] = {
        id: socket.id,
        flag: false,
    }

    socket.on('disconnect', disconnect(socket));

    // WHEN ALL PLAYERS PRESS START GAME
    
    socket.on('startGame', () => {
        players[socket.id].chips = 20000;
        players[socket.id].folded = false;
        players[socket.id].bet = 0;
        players[socket.id].hand = cards.dealCards();
        
        io.emit('updatePlayers', players);
        socket.emit('currentPlayerId', socket.id);

        if(players[socket.id].flag === false){
            io.emit('updateDisplay');
            players[socket.id].flag = true;
        }

        socket.on('fold', fold(socket));
        socket.on('bet', bet(socket));
        socket.on('call', call(socket));

        assignBlinds(socket.id);
    });


});

function disconnect(socket){
    return (reason) => {
        console.log(reason);
        delete players[socket.id];
        pot = 0; 
        io.emit('updatePlayers', players);
        playerCount = 0;
    };
}

function fold(socket){
    return () => {
        if (players[socket.id]) {
            players[socket.id].folded = true;
            io.emit('fold', players); 
        }
    };
}

function bet(socket){
    return (betAmount) => {
        if (players[socket.id] && betAmount > 0 && betAmount <= players[socket.id].chips && players[socket.id].folded == false){
            players[socket.id].chips -= betAmount
            players[socket.id].bet = Number(players[socket.id].bet) + Number(betAmount)
            pot = Number(pot) + Number(betAmount)
        
            io.emit('bet', {pot, players});
            
            console.log("bet " + players[socket.id].bet)
        }
    };
}

function call(socket){
    return () => {
        const playerIDs = Object.keys(players);

        const highestBetPlayerID = Math.max(...playerIDs.map(id => players[id].id));

        const highestBet = Math.max(...playerIDs.map(id => players[id].bet)); // find the highest bet on the table

        const amountToCall = highestBet - players[socket.id].bet;
    
        if (players[socket.id] && players[socket.id].chips >= amountToCall && !players[socket.id].folded && highestBetPlayerID != socket.id) {
            players[socket.id].chips -= amountToCall;
            players[socket.id].bet += amountToCall;
            pot += amountToCall;

            io.emit('bet', {pot, players});
            console.log("tocall " + amountToCall);
        }

    };
}

function nextPlayer(){
    const playersObj = Object.keys(players);
    var currentPlayer = 0;
    currentPlayer = (currentPlayer + 1) % playersObj.length;
    
    //console.log(currentPlayer);
    return currentPlayer - 1;
}

function assignPlayerTurns(){

}

function assignBlinds(id) {
    const playersObj = Object.keys(players);
    
    console.log(playersObj);

    console.log('sb ' + smallBlindIndex);
    console.log('bb ' + bigBlindIndex);

    players[id].bet = (id === playersObj[smallBlindIndex] ? smallBlindAmount : (id === playersObj[bigBlindIndex] ? bigBlindAmount : 0));

    if(players[id].bet === smallBlindAmount){
        players[id].chips -= smallBlindAmount;
        pot += smallBlindAmount;
    } else if(players[id].bet === bigBlindAmount){
        players[id].chips -= bigBlindAmount;
        pot += bigBlindAmount;
    }
    console.log(bigBlindAmount);
    io.emit('bet', {pot, players});

    if(id === playersObj[smallBlindIndex] || id === playersObj[bigBlindIndex]){
        io.emit('blinds', {smallBlindIndex, bigBlindIndex, playersObj});
    }
    
}

server.listen(port, () => {
    console.log(`Example listening on port ${port}`);
})

console.log('server did load');