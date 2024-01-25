const socket = io()

socket.on('updatePlayers', (players) => {
    console.log(players)
})