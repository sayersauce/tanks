/**
 * Tanks - Bullet Handler Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");

class BulletHandler {
    constructor() {
        this.bullets = {};
        this.velocity = 350;
        this.dimensions = {
            w: 4,
            h: 6
        };
    }

    init(io) {
        this.io = io;
    }

    addBullet(data) {
        let bullet = data;
        bullet.id = Util.randomId();
    
        let dx = Math.sin(bullet.angle * Math.PI/180);
        let dy = Math.cos(bullet.angle * Math.PI/180);
        bullet.x = bullet.x + (bullet.barrel * dx);
        bullet.y = bullet.y - (bullet.barrel * dy);
    
        this.io.emit("addBullet", bullet);
        bullet.dx = dx;
        bullet.dy = dy;
        this.bullets[bullet.id] = data;
    }

    removeBullet(id) {
        delete this.bullets[id];
        this.io.emit("removeBullet", id);
    }

    updateBullets(dt, blocks, bounds, PlayerHandler, EnemyHandler) {    
        for (let id in this.bullets) {
            let bullet = this.bullets[id];
            bullet.x += this.velocity * dt * bullet.dx;
            bullet.y -= this.velocity * dt * bullet.dy;
            
            let collision = false;

            // Bullet collision
            for (let b in this.bullets) {
                if (b != id) {
                    b = this.bullets[b];
                    if (Util.boxCollision(bullet.x - this.dimensions.w / 2 , bullet.y - this.dimensions.h / 2, this.dimensions.w, this.dimensions.h, b.x, b.y, this.dimensions.w, this.dimensions.h)) {
                        collision = true;
                        this.removeBullet(b.id, this.io);
                    }
                }
            }
    
            // Block collision
            for (let b of blocks) {
                if (Util.boxCollision(bullet.x - this.dimensions.w / 2 , bullet.y - this.dimensions.h / 2, this.dimensions.w, this.dimensions.h, b.x, b.y, 30, 30)) {
                    collision = true;
                }
            }
    
            // Player collision
            for (let p in PlayerHandler.players) {
                if (p != bullet.owner) {
                    let player = PlayerHandler.players[p];
                    if (Util.boxCollision(bullet.x - this.dimensions.w / 2 , bullet.y - this.dimensions.h / 2, this.dimensions.w, this.dimensions.h, player.x, player.y, 30, 30)) {
                        if (!bullet.enemy) {
                            if (PlayerHandler.players[bullet.owner] && "kills" in PlayerHandler.players[bullet.owner]) {
                                PlayerHandler.players[bullet.owner].kills += 1;
                            } else {
                                PlayerHandler.players[bullet.owner].kills = 1;
                            }
                        }
                        this.io.emit("kill", p);
                        player.spawn(blocks, bounds, PlayerHandler.players, EnemyHandler.enemies);
                        this.io.emit("player", player.data());
                        collision = true;
                    }
                }
            }
    
            // Enemy collision
            for (let enemy of EnemyHandler.enemies) {
                if (enemy.id != bullet.owner) {
                    if (Util.boxCollision(bullet.x - this.dimensions.w / 2 , bullet.y - this.dimensions.h / 2, this.dimensions.w, this.dimensions.h, enemy.x, enemy.y, 30, 30)) {
                        enemy.spawn(blocks, bounds, PlayerHandler.players, EnemyHandler.enemies);
                        if (!bullet.enemy) {
                            if (PlayerHandler.players[bullet.owner] && "kills" in PlayerHandler.players[bullet.owner]) {
                                PlayerHandler.players[bullet.owner].kills += 1;
                            } else {
                                PlayerHandler.players[bullet.owner].kills = 1;
                            }
                            PlayerHandler.scoreboard[bullet.owner] += 1;
                            this.io.emit("scoreboard", PlayerHandler.scoreboard);
                        }
                        collision = true;
                    }
                }
            }
    
            // Boundary collision
            if (bullet.y < 0 || bullet.y > bounds.y || bullet.x < 0 || bullet.x > bounds.x) collision = true;
    
            if (collision) {
                this.removeBullet(id);
            }
        }
    }
}


module.exports = new BulletHandler();