/**
 * Tanks - Player Handler Class
 * Max Sayer
 * https://max.lat
 */


class PlayerHandler {
    constructor() {
        this.players = {};
        this.scoreboard = {};
        this.playerCount = 0;
        this.width = 30;
        this.height = 30;
    }

    addPlayer(socket, map, treads, bullets, enemies) {
        // Send game information to the player
        socket.emit("map", map);
        socket.emit("id", socket.id);
        socket.emit("treads", treads);
        socket.emit("bullets", bullets);
    
        for (let enemy of enemies) {
            socket.emit("enemy", enemy.data())
        }
    
        for (let player in this.players) {
            socket.emit("connection", player);
            socket.emit("player", this.players[player]);
        }
    
        // Add player to scoreboard
        this.scoreboard[socket.id] = 0;
        socket.emit("scoreboard", this.scoreboard);
    
        // Inform other players of a new player
        socket.broadcast.emit("connection", socket.id);
        this.playerCount++;
        console.log("There are " + this.playerCount + " players in the lobby.")
    }

    updatePlayer(socket, data) {
        data.id = socket.id;
        data.width = this.width;
        data.height = this.height;
        this.players[socket.id] = data;
        socket.broadcast.emit("player", this.players[socket.id]);
    }

    removePlayer(socket, io) {
        delete this.players[socket.id];
        delete this.scoreboard[socket.id];
        io.emit("disconnection", socket.id);
        this.playerCount--;
        console.log("There are " + this.playerCount + " players in the lobby.")
    }
}


module.exports = new PlayerHandler();