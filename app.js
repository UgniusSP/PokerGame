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
const Bets = require('./public/Bets')
const bets = new Bets()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {};
let pot = 0;

io.on('connection', (socket) => {
    console.log('a user connected');

    players[socket.id] = {
        id: socket.id,
        chips: 20000,
        hand: cards.dealCards(),
    }
    
    io.emit('updatePlayers', players)

    socket.emit('currentPlayerId', socket.id)

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete players[socket.id]
        pot = 0; // when players dc pot becomes 0 --- its temporary
        io.emit('updatePlayers', players)
    })

    socket.on('raise', (raiseAmount) => {
        if (players[socket.id] && raiseAmount > 0 && raiseAmount <= players[socket.id].chips) {
            players[socket.id].chips -= raiseAmount
            pot = Number(pot) + Number(raiseAmount)
            console.log(pot)
            io.emit('raise', pot)
            io.emit('updatePlayers', players)
            console.log(players[socket.id].chips)
        }
    })

    console.log(players)
});


server.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})

console.log('server did load')