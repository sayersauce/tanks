/**
 * Tanks - Player Handler Class
 * Max Sayer
 * https://max.lat
 */

const { Player } = require("../objects/player");

class PlayerHandler {
    constructor() {
        this.players = {};
        this.scoreboard = {};
        this.playerCount = 0;
        this.width = 30;
        this.height = 30;
    }

    init(blocks, bounds, blockSize) {
        this.map = {
            blocks: blocks,
            bounds: bounds
        }
        this.blockSize = blockSize;
        this.cols = bounds.x / blockSize;
        this.rows = bounds.y / blockSize;

        // Convert walls to nodes
        this.walls = [];
        for (let wall of blocks) {
            this.walls.push({ x: Math.floor(wall.x / blockSize), y: Math.floor(wall.y / blockSize )});
        }
    }

    addPlayer(io, socket, map, treads, bullets, enemies) {
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

        // Create player
        this.players[socket.id] = new Player(socket.id, this.blockSize, this.rows, this.cols, this.walls, this.map);
        this.players[socket.id].spawn(this.map.blocks, this.map.bounds, this.players, enemies);
    
        // Inform other players of a new player
        socket.broadcast.emit("connection", socket.id);
        io.emit("player", this.players[socket.id].data());
        this.playerCount++;
        console.log("There are " + this.playerCount + " players in the lobby.")
    }

    updatePlayer(io, socket, data, enemies) {
        let player = this.players[socket.id];
        player.update(data, this.players, enemies);
        io.emit("player", player.data());
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