/**
 * Tanks - Enemy Handler Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");
const { Shooter } = require("../objects/shooter.js");
const { Follower } = require("../objects/follower.js");


class EnemyHandler {
    constructor() {
        this.map = {};
        this.enemies = [];
    }

    init(blocks, bounds, blockSize, TreadHandler) {
        this.map = {
            blocks: blocks,
            bounds: bounds
        }
        this.blockSize = blockSize;
        this.TreadHandler = TreadHandler;
        this.cols = bounds.x / blockSize;
        this.rows = bounds.y / blockSize;

        // Convert walls to nodes
        this.walls = [];
        for (let wall of blocks) {
            this.walls.push({ x: Math.floor(wall.x / blockSize), y: Math.floor(wall.y / blockSize )});
        }
    }

    createEnemies (n, players) {
        for (let i = 0; i < n; i++) {
            let e = new Follower(undefined, undefined, 0, Util.randomId(), this.blockSize, this.rows, this.cols, this.walls, this.map, this.TreadHandler);
            e.spawn(this.map.blocks, this.map.bounds, players, this.enemies)
            this.enemies.push(e);
        }
    }

    updateEnemies (dt, players, BulletHandler, io) {
        for (let enemy of this.enemies) {
            enemy.update(dt, players, this.enemies, Util.timestamp());
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