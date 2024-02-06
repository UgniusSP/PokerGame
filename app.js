const express = require('express')
const app = express()

//socket.io setup
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const port = 3000
const Cards = require('./public/Cards')
const pokergame = new Cards()

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const players = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    players[socket.id] = {
        id: socket.id,
        chips: 20000,
        hand: pokergame.dealCards(),
    }
    
    io.emit('updatePlayers', players)

    socket.emit('currentPlayerId', socket.id)

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete players[socket.id]
        io.emit('updatePlayers', players)
    })

    console.log(players)
});

server.listen(port, () => {
    console.log(`Example listening on port ${port}`)
})

console.log('server did load')