// Tanks - Socket Client
// Max Sayer
// https://max.lat

window.Socket = {};

(() => {
    const sock = io.connect("http://86.31.146.170:3000");

    // Socket Events

    sock.on("id", data => {
        Socket.id = data;
        console.log("My name is " + data + ".");
    })

    sock.on("connection", data => {
        console.log("Player: " + data + " has joined the party.")
        Game.players[data] = new Game.Tank(undefined, undefined, undefined, data);
    });

    sock.on("disconnection", data => {
        console.log("Player: " + data + " has departed.");
        delete Game.players[data];
    });

    sock.on("player", data => {
        let player = Game.players[data.id];
        player.x = data.x;
        player.y = data.y;
        player.angle = data.angle;
        player.body = player.images[data.image];
    });

    sock.on("treads", data => {
        Game.treads = [];
        for(let tread of data) {
            Game.treads.push(new Game.Block(Game.images["tread"], tread.x, tread.y, tread.angle));
        }
    });

    sock.on("bullets", data => {
        Game.bullets = [];
        for(let bullet of data) {
            Game.bullets.push(new Game.Bullet(bullet.x, bullet.y, bullet.angle, bullet.barrel));
        }
    });

    sock.on("kill", data => {
        if(data == Socket.id) {
            Game.player.spawn();
        }
    })

    // Socket Object Functions

    Socket.sendObject = function(name, data) {
        sock.emit(name, data);
    }
})();