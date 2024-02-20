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
let smallBlindIndex = 0;
let bigBlindIndex = 1;
const smallBlindAmount = 500;
const bigBlindAmount = 1000;

io.on('connection', (socket) => {
    console.log('a user connected');

    players[socket.id] = {
        id: socket.id,
        chips: 20000,
        hand: cards.dealCards(),
        folded: false,
        blinds: 0,
        bet: 0,
    }

    assignBlinds(socket.id)
    
    io.emit('updatePlayers', players)

    socket.emit('currentPlayerId', socket.id)

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete players[socket.id]
        pot = 0; // when players dc pot becomes 0 --- its temporary
        io.emit('updatePlayers', players)
        
    })

    socket.on('fold', () => {
        if (players[socket.id]) {
            players[socket.id].folded = true;
            io.emit('updatePlayers', players); // Emit updated players object to all clients
        }
        
    });

    socket.on('bet', (betAmount) => {
        if (players[socket.id] && betAmount > 0 && betAmount <= players[socket.id].chips && players[socket.id].folded == false){
            players[socket.id].chips -= betAmount
            players[socket.id].bet = Number(players[socket.id].bet) + Number(betAmount)
            pot = Number(pot) + Number(betAmount)
        
            io.emit('bet', pot)
            io.emit('updatePlayers', players)
            
            console.log(players[socket.id].bet)
        }
        
    })

    socket.on('call', () => {
        const currentPlayer = players[socket.id];
        const playerIDs = Object.keys(players);
        const highestBet = Math.max(...playerIDs.map(id => players[id].bet)); // Find the highest bet on the table
    
        const amountToCall = highestBet - currentPlayer.bet;
    
        if (currentPlayer && currentPlayer.chips >= amountToCall && !currentPlayer.folded) {
            currentPlayer.chips -= amountToCall;
            currentPlayer.bet += amountToCall;
            pot += amountToCall;

            io.emit('updatePlayers', players);
            io.emit('bet', pot);
            currentPlayer.bet = 0
            console.log(amountToCall);
        }
        
    });
    

    console.log(players)
    
});

function assignBlinds(playerId) {
    const playerIDs = Object.keys(players);

    players[playerId].blinds = (playerId === playerIDs[smallBlindIndex]) ? smallBlindAmount : (playerId === playerIDs[bigBlindIndex]) ? bigBlindAmount : 0
    if(playerIDs.length === 2){
        smallBlindIndex = (smallBlindIndex + 1) % playerIDs.length;
        bigBlindIndex = (bigBlindIndex + 1) % playerIDs.length;
    } else if(playerIDs.length > 2){
        
    }

    if(players[playerId].blinds === smallBlindAmount){
        players[playerId].chips -= smallBlindAmount;
        pot += smallBlindAmount;
        players[playerId].bet = Number(players[playerId].bet) + Number(smallBlindAmount)
    } else if(players[playerId].blinds === bigBlindAmount){
        players[playerId].chips -= bigBlindAmount;
        pot += bigBlindAmount;
        players[playerId].bet = Number(players[playerId].bet) + Number(bigBlindAmount)
    }
    io.emit('bet', pot)
    io.emit('updatePlayers', players)
}

server.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})

console.log('server did load')