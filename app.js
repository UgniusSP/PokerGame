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
let preflop = true;
let currentPlayer = smallBlindIndex;
let turnCount = 0;

let playerQuantity = 4;
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
    }

    socket.on('disconnect', disconnect(socket));

    // WHEN ALL PLAYERS PRESS START GAME
    
    socket.on('startGame', () => {
        players[socket.id].chips = 20000;
        players[socket.id].folded = false;
        players[socket.id].bet = 0;
        players[socket.id].hand = cards.dealCards();
        players[socket.id].blind = 0;
        
        socket.emit('currentPlayerId', socket.id);
        io.emit('updatePlayers', players);

        socket.on('fold', fold(socket));
        socket.on('bet', bet(socket));
        socket.on('call', call(socket));

        assignBlinds(socket.id);
        
    });

    playerTurns();
    players[socket.id].pos = currentPlayer;
    

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
        
        if (players[socket.id] && turnCount === players[socket.id].pos) {
            players[socket.id].folded = true;
            io.emit('fold', players);

            turns();
            
        }
    };
}

function bet(socket){
    return (betAmount) => {
        
        if(preflop) {
            players[socket.id].blind = players[socket.id].bet;
            preflop = false;
        }

        if (players[socket.id] && betAmount >= bigBlindAmount && betAmount <= players[socket.id].chips && !players[socket.id].folded
            && turnCount === players[socket.id].pos){
            players[socket.id].chips -= betAmount;
            players[socket.id].bet = Number(players[socket.id].bet) - Number(players[socket.id].blind) + Number(betAmount);
            pot = Number(pot) + Number(betAmount);
        
            io.emit('bet', {pot, players});
            
            console.log("bet " + players[socket.id].bet);
            
            turns();
            
        }
        
    };
}

function call(socket){
    return () => {
        const playerIDs = Object.keys(players);

        const highestBet = Math.max(...playerIDs.map(id => players[id].bet)); // find the highest bet on the table

        const amountToCall = highestBet - players[socket.id].bet;
    
        if (players[socket.id] && players[socket.id].chips >= amountToCall && !players[socket.id].folded && turnCount === players[socket.id].pos) {
            players[socket.id].chips -= amountToCall;
            players[socket.id].bet += amountToCall;
            pot += amountToCall;

            io.emit('bet', {pot, players});
            console.log("tocall " + amountToCall);

            turns();
           
        }

        var allEq = true;
        for(let i = 1; i < playerIDs.length; i++){
            if(players[playerIDs[i]].bet !== players[playerIDs[i-1]].bet){
                allEq = false;
                break;
            }
        }

        if(allEq){
            io.emit('flop', (cards.dealFlop()));

            for(var i in players){
                players[i].bet = 0;     // zero all elements after call
            }

            io.emit('updatePlayers', players);
            turnCount = 0;
        }

    };
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
   
    io.emit('bet', {pot, players});

    if(id === playersObj[smallBlindIndex] || id === playersObj[bigBlindIndex]){
        io.emit('blinds', {smallBlindIndex, bigBlindIndex, playersObj});
    }

}

function playerTurns() {
    const playerObj = Object.keys(players);
    
    currentPlayer = (currentPlayer + 1) % playerObj.length;
    console.log(currentPlayer);
}

function turns(){
    const playersObj = Object.keys(players); 
    
    turnCount = (turnCount + 1) % playersObj.length;
    console.log(turnCount);
    
}


server.listen(port, () => {
    console.log(`Example listening on port ${port}`);
})

console.log('server did load');