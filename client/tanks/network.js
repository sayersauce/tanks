/**
 * Tanks - Socket Client
 * Max Sayer
 * https://max.lat
 */

(() => {

    // This function connects to the server and sets out functions for sending and receiving data
    Socket.init = function() {
        const sock = io.connect("http://tanks.max.lat:3000");

        // Socket Events

        // Client receiving it's server-side ID
        sock.on("id", data => {
            Socket.id = data;
            console.log("My real name is " + data + ".");
        });

        // Player connection event
        sock.on("connection", data => {
            console.log("Player: " + data + " has joined the party.")
            Game.players[data] = new Game.Tank(undefined, undefined, undefined, data);
        });

        // Player disconnection event
        sock.on("disconnection", data => {
            console.log("Player: " + data + " has departed.");
            delete Game.players[data];
        });

        // Player update event
        sock.on("player", data => {
            let player = Game.players[data.id];
            player.x = data.x;
            player.y = data.y;
            player.angle = data.angle;
            player.turretAngle = data.turretAngle;
            player.body = player.images[data.image];
            player.name = data.name;
        });

        // Map creation event
        sock.on("map", map => {
            Game.bounds = map.bounds;
            Game.blocks = [];
            for (let block of map.blocks) {
                Game.blocks.push(new Game.Block(Game.images[block.image], block.x, block.y, 0));
            }
            Game.player.spawn();
        });

        /**
         * Multiple treadmark creation event
         * All treadmarks currently in the game are received when the client connects
         */
        sock.on("treads", data => {
            Game.treads = [];
            for (let tread of data) {
                Game.treads.push(new Game.Tread(tread.x, tread.y, tread.angle, tread.timestamp));
            }
        });

        // Treadmark creation event
        sock.on("tread", tread => {
            Game.treads.push(new Game.Tread(tread.x, tread.y, tread.angle, tread.timestamp));
        });

        /**
         * Multiple bullet creation event
         * All treadmarks currently in the game are received when the client connects
         */
        sock.on("bullets", data => {
            Game.bullets = {};
            for (let b in data) {
                let bullet = data[b];
                Game.bullets[b] = new Game.Bullet(bullet.x, bullet.y, bullet.angle, bullet.barrel);
            }
        });

        // Bullet creation event
        sock.on("addBullet", bullet => {
            Game.bullets[bullet.id] = new Game.Bullet(bullet.x, bullet.y, bullet.angle, bullet.barrel);
        });

        // Bullet destruction event
        sock.on("removeBullet", bullet => {
            delete Game.bullets[bullet];
        });

        // Player death event
        sock.on("kill", data => {
            if (data == Socket.id) {
                Game.player.spawn();
            }
        });

        // Scoreboard update event
        sock.on("scoreboard", data => {
            Game.scoreboard.values = data;
        });

        // Socket Object Functions

        Socket.sendObject = function(name, data) {
            sock.emit(name, data);
        }
    }

})();
