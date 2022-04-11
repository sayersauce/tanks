/**
 * Tanks - Server
 * Max Sayer
 * https://max.lat
 */

const port = 3000;
const io = require("socket.io")(port);
const map = require("./map.js");
const Util = require("./util.js");
const PlayerHandler = require("./handlers/PlayerHandler.js");
const TreadHandler = require("./handlers/TreadHandler.js");
const EnemyHandler = require("./handlers/EnemyHandler.js");
const BulletHandler = require("./handlers/BulletHandler.js");
const blockSize = 30;

// Variables

let blocks = [];
let bounds = {};


function init(){
    console.log("Server running on port " + port);

    map.load("map.png", data => {
        blocks = data.blocks;
        bounds.x = data.width;
        bounds.y = data.height;

        EnemyHandler.init(blocks, bounds, blockSize);
        EnemyHandler.createFollowers(5, PlayerHandler.players);
        TreadHandler.init(io);
        PlayerHandler.init(blocks, bounds, blockSize);
        BulletHandler.init(io);
        //EnemyHandler.createShooters(5, PlayerHandler.players);

        initSocket();
        update(Util.timestamp());
    });
}

function update(updateTime) {
    let now = Util.timestamp();
    let dt = (now - updateTime) / 1000;
    setTimeout(() => { update(now); }, 1000/60);

    BulletHandler.updateBullets(dt, blocks, bounds, PlayerHandler, EnemyHandler);
    TreadHandler.updateTreads();
    EnemyHandler.updateEnemies(dt, PlayerHandler.players, BulletHandler, io);
}


// Socket 


function initSocket() {
    io.on("connection", (socket) => {
        PlayerHandler.addPlayer(io, socket, { bounds: bounds, blocks: blocks }, TreadHandler.treads, BulletHandler.bullets, EnemyHandler.enemies);
    
        socket.on("position", data => {
            PlayerHandler.updatePlayer(io, socket, data, EnemyHandler.enemies);
        });
    
        socket.on("tread", data => {
            TreadHandler.addTread(data);
        });
    
        socket.on("disconnect", () => {
            PlayerHandler.removePlayer(socket, io);
        });
    });
}


init();