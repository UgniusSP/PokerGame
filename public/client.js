const socket = io()

const player = new Cards()
const players = {}

socket.on('updatePlayers', (backendPlayers) => {
    for(const id in backendPlayers){
        const backendPlayer = backendPlayers[id];

        if(!players[id]){
            players[id] = new Player(20000, backendPlayer.hand);
        }
    }
    
    console.log(players)
})


