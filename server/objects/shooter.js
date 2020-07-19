/**
 * Tanks - Shooter Enemy Tank Class
 * Max Sayer
 * https://max.lat
 * 
 * This tank is stationary and only shoots. Hence the name.
 */

const { Enemy } = require("./enemy.js");



class Shooter extends Enemy {
    constructor(x, y, a, id) {
        super(x, y, a, id);
        this.viewRadius = 400; 
        this.lastShot = 0;
        this.cooldown = 2;
    }

    update(dt, players, enemies, timestamp) {
        // Check for targets
        this.check(players);

        // Seek and shoot target
        if (this.targetId && players[this.targetId]) {
            this.seek(dt, players[this.targetId], timestamp);
        }
    }
}

exports.Shooter = Shooter;