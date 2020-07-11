/**
 * Tanks - Enemy Handler Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");
const { Shooter } = require("../objects/shooter.js");


class EnemyHandler {
    constructor() {
        this.map = {};
        this.enemies = [];
    }

    init(blocks, bounds) {
        this.map = {
            blocks: blocks,
            bounds: bounds
        }
    }

    createStationaryEnemies (n, players) {
        for (let i = 0; i < n; i++) {
            let e = new Shooter(undefined, undefined, 0, Util.randomId());
            e.spawn(this.map.blocks, this.map.bounds, players, this.enemies)
            this.enemies.push(e);
        }
    }

    updateEnemies (dt, players, BulletHandler, io) {
        for (let enemy of this.enemies) {
            enemy.update(dt, players, Util.timestamp());
            if (enemy.shooting) {
                enemy.shooting = false;
                BulletHandler.addBullet({
                    x: enemy.x + enemy.width / 2,
                    y: enemy.y + enemy.height / 2,
                    angle: enemy.turretAngle,
                    owner: enemy.id,
                    barrel: 25,
                    enemy: true
                }, io);
            }
            io.emit("enemy", enemy.data());
        }
    }
}


module.exports = new EnemyHandler();