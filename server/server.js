// Tanks - Socket Server
// Max Sayer
// https://max.lat

const port = 3000;
const io = require("socket.io")(port);

console.log("Server running at localhost:" + port);

// Variables

let playerCount = 0;
let players = {};
let bullets = [];
let treads = [];
let updateTime = timestamp();

// Connection Handling

io.on("connection", (socket) => {
    console.log("User connection: " + socket.handshake.headers.host);
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

(function update() {
    setTimeout(update, 10);
    let now = timestamp();
    let dt = (now - updateTime) / 1000;
    updateTime = now;

    updateBullets(dt);
})();

// Util

function timestamp() {
    return new Date().getTime();
}

function boxCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
}

// Player

function addPlayer(socket) {
    socket.emit("id", socket.id);
    for(let player in players) {
        socket.emit("connection", player);
    }
    socket.broadcast.emit("connection", socket.id);
    playerCount++;
    console.log("There are " + playerCount + " players in the lobby.")
}

function updatePlayer(socket, data) {
    players[socket.id] = data;
    data.id = socket.id;
    socket.broadcast.emit("player", data);
}

function removePlayer(socket) {
    delete players[socket.id];
    io.emit("disconnection", socket.id);
    playerCount--;
    console.log("There are " + playerCount + " players in the lobby.")
}

function killPlayer(player) {
    console.log("killing " + player);
    io.emit("kill", player);
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

        // Player collision
        for(let p in players) {
            if(p != bullet.owner) {
                player = players[p];
                if(boxCollision(bullet.x, bullet.y, 3, 3, player.x, player.y, 30, 30)) {
                    killPlayer(p);
                    collision = true;
                }
            }
        }

        // Boundary collision
        if(bullet.y < 0 || bullet.y > 2000 || bullet.x < 0 || bullet.y > 2000) collision = true;

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
