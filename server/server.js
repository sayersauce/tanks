// Tanks - Socket Server
// Max Sayer
// https://max.lat

const port = 3000;
const io = require("socket.io")(port);

console.log("Server running at localhost:" + port);

// Variables

let playerCount = 0;
let players = {};
let scoreboard = {};
let bullets = [];
let treads = [];
let blocks = [];
let updateTime = timestamp();

// Constants
const bounds = {
    x: 1500,
    y: 1500
};

// Connection Handling

io.on("connection", (socket) => {
    addPlayer(socket);

    socket.on("position", data => {
        updatePlayer(socket, data);
    });

    socket.on("bullet", data => {
        data.owner = socket.id;
        addBullet(data);
    });

    socket.on("tread", data => {
        addTread(data);
    });

    socket.on("disconnect", () => {
        removePlayer(socket);
    });
});

// Misc

(function init(){
    // Make blocks
    const noBlocks = 50;
    for(let i = 0; i < 50; i++) {
        blocks.push({
            x: randomInt(0, 1500),
            y: randomInt(0, 1500)
        });
    };

    update();
})();

function update() {
    setTimeout(update, 10);
    let now = timestamp();
    let dt = (now - updateTime) / 1000;
    updateTime = now;

    updateBullets(dt);
}

// Util

function timestamp() {
    return new Date().getTime();
}

function boxCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Player

function addPlayer(socket) {
    // Send game information to the player
    socket.emit("id", socket.id);
    for(let player in players) {
        socket.emit("connection", player);
        socket.emit("player", players[player]);
    }
    socket.emit("blocks", blocks);

    // Add player to scoreboard
    scoreboard[socket.id] = 0;
    socket.emit("scoreboard", scoreboard);

    // Inform other players of a new player
    socket.broadcast.emit("connection", socket.id);
    playerCount++;
    console.log("There are " + playerCount + " players in the lobby.")
}

function updatePlayer(socket, data) {
    data.id = socket.id;
    players[socket.id] = data;
    socket.broadcast.emit("player", players[socket.id]);
}

function removePlayer(socket) {
    delete players[socket.id];
    delete scoreboard[socket.id];
    io.emit("disconnection", socket.id);
    playerCount--;
    console.log("There are " + playerCount + " players in the lobby.")
}

function killPlayer(killer, player) {
    console.log(killer + " killed " + player);
    scoreboard[killer] += 1;
    io.emit("kill", player);
    io.emit("scoreboard", scoreboard);
}

// Bullets

function addBullet(data) {
    let bullet = data;
    bullet.dx = Math.sin(bullet.angle * Math.PI/180);
    bullet.dy = Math.cos(bullet.angle * Math.PI/180);
    bullets.push(data);
}

function updateBullets(dt) {
    const velocity = 400;
    let newBullets = [];
    for(let bullet of bullets) {
        bullet.x += velocity * dt * bullet.dx;
        bullet.y -= velocity * dt * bullet.dy;
        
        let collision = false;

        // Block collision
        for(let b of blocks) {
            if(boxCollision(bullet.x, bullet.y, 3, 3, b.x, b.y, 30, 30)) {
                collision = true;
            }
        }

        // Player collision
        for(let p in players) {
            if(p != bullet.owner) {
                player = players[p];
                if(boxCollision(bullet.x, bullet.y, 3, 3, player.x, player.y, 30, 30)) {
                    killPlayer(bullet.owner, p);
                    if("kills" in players[bullet.owner]) {
                        players[bullet.owner].kills += 1;
                    } else {
                        players[bullet.owner] = 1;
                    }
                    collision = true;
                }
            }
        }

        // Boundary collision
        if(bullet.y < 0 || bullet.y > bounds.y || bullet.x < 0 || bullet.x > bounds.x) collision = true;

        if(!collision) {
            newBullets.push(bullet);
        }
    }
    bullets = newBullets;
    io.emit("bullets", bullets);
}

// Treadmarks

function addTread(data) {
    treads.push(data);
    setTimeout(() => { treads.shift(); io.emit("treads", treads); }, 30000);
    io.emit("treads", treads);
}
