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
const BulletHandler = require("./handlers/BulletHandler.js");
const TreadHandler = require("./handlers/TreadHandler.js");
const EnemyHandler = require("./handlers/EnemyHandler.js");

// Variables

let blocks = [];
let bounds = {};


function init(){
    console.log("Server running on port " + port);

    map.load("map.png", data => {
        blocks = data.blocks;
        bounds.x = data.width;
        bounds.y = data.height;

        EnemyHandler.init(blocks, bounds);
        EnemyHandler.createStationaryEnemies(10, PlayerHandler.players);

        initSocket();
        update(Util.timestamp());
    });
}

function update(updateTime) {
    let now = Util.timestamp();
    let dt = (now - updateTime) / 1000;
    updateTime = now;
    setTimeout(() => { update(updateTime); }, 1000/60);

    BulletHandler.updateBullets(dt, blocks, bounds, PlayerHandler, EnemyHandler, io);
    TreadHandler.updateTreads();
    EnemyHandler.updateEnemies(dt, PlayerHandler.players, BulletHandler, io);
}


// Socket 


function initSocket() {
    io.on("connection", (socket) => {
        PlayerHandler.addPlayer(socket, { bounds: bounds, blocks: blocks }, TreadHandler.treads, BulletHandler.bullets, EnemyHandler.enemies);
    
        socket.on("position", data => {
            PlayerHandler.updatePlayer(socket, data);
        });
    
        socket.on("bullet", data => {
            data.owner = socket.id;
            BulletHandler.addBullet(data, io);
        });
    
        socket.on("tread", data => {
            TreadHandler.addTread(data);
            io.emit("tread", data);
        });
    
        socket.on("disconnect", () => {
            PlayerHandler.removePlayer(socket, io);
        });
    });
}


init();