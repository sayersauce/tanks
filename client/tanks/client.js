// Tanks - Socket Client
// Max Sayer
// https://max.lat

(() => {
    
    Socket.init = function() {
        const sock = io.connect("http://86.31.146.170:3000");

        // Socket Events

        sock.on("id", data => {
            Socket.id = data;
            console.log("My real name is " + data + ".");
        });

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
            player.turretAngle = data.turretAngle;
            player.body = player.images[data.image];
            player.name = data.name;
        });

        sock.on("blocks", data => {
            Game.blocks = [];
            for(let block of data) {
                Game.blocks.push(new Game.Block(Game.images["rock"], block.x, block.y, 0));
            }
            console.log(Game.blocks);
        });

        sock.on("treads", data => {
            // All current treads on server
            Game.treads = [];
            for(let tread of data) {
                Game.treads.push(new Game.Block(Game.images["tread"], tread.x, tread.y, tread.angle));
            }
        });

        sock.on("bullets", data => {
            // All bullets on server
            Game.bullets = {};
            for(let b in data) {
                let bullet = data[b];
                Game.bullets[b] = new Game.Bullet(bullet.x, bullet.y, bullet.angle, bullet.barrel);
            }
        });

        sock.on("addBullet", bullet => {
            // Single bullet
            Game.bullets[bullet.id] = new Game.Bullet(bullet.x, bullet.y, bullet.angle, bullet.barrel);
        });

        sock.on("removeBullet", bullet => {
            delete Game.bullets[bullet];
        });


        sock.on("kill", data => {
            if(data == Socket.id) {
                Game.player.spawn();
            }
        });

        sock.on("scoreboard", data => {
            Game.scoreboard.values = data;
        });

        // Socket Object Functions

        Socket.sendObject = function(name, data) {
            sock.emit(name, data);
        }
    }

})();