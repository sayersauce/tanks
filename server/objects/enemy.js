/**
 * Tanks - Enemy Tank Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");


class Enemy {
    constructor(x, y, a, id) {
        this.x = x;
        this.y = y;
        this.angle = a;
        this.turretAngle = a;
        this.id = id;
        this.viewRadius = 500; 
        this.turretSpeed = 50;
        this.lastShot = 0;
        this.cooldown = 2;
        this.shooting = false;
        this.width = 30;
        this.height = 30;
        this.image = "shooter";
    }

    check(players) {
        // Checks that target is still in view, if not removes the target
        if (this.targetId) {
            if (players[this.targetId]) {
                let target = players[this.targetId];
                if (!this.inView(this.x, this.y, target.x, target.y)) {
                    // console.log("target out of view");
                    this.targetId = undefined;
                }
            } else {
                this.targetId = undefined;
            }
        }

        // Checks if any other targets are available if it has no target
        if (!this.targetId) {
            for (let p in players) {
                let player = players[p];
                if (this.inView(this.x, this.y, player.x, player.y)) {
                    this.targetId = p;
                    // console.log("new target " + player.name);
                    break;
                }
            }
        }
    }

    seek(dt, target, timestamp) {
        let angleToTarget = Math.atan2(target.y - this.y, target.x - this.x) * 180 / Math.PI + 90;
        if (angleToTarget < 0) {
            angleToTarget = 360 + angleToTarget;
        }
        
        let difference = (this.turretAngle - angleToTarget);

        if (Math.abs(difference) > 1) {
            if (difference < 0) {
                this.rotateTurret(this.turretSpeed, dt);
            } else {
                this.rotateTurret(-this.turretSpeed, dt);
            }
        } else {
            if ((timestamp - this.lastShot) / 1000 > this.cooldown) {
                //this.shooting = true;
                this.lastShot = timestamp;
            }
        }
    }

    rotateTurret(a, dt) {
        this.turretAngle += a * dt;
        this.turretAngle = this.turretAngle % 360;
        if (this.turretAngle < 0) {
            this.turretAngle = 360 - this.turretAngle;
        }
    }

    inView(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) <= this.viewRadius;
    }

    collision(x, y, w, h, blocks, bounds, players, enemies) {
        // Block Collisions
        for (let b of blocks) {
            if (Util.boxCollision(x, y, w, h, b.x, b.y, b.width, b.height)) {
                return true;
            }
        }

        // Player Collisions
        for (let p in players) {
            p = players[p];
            if (Util.boxCollision(x, y, w, h, p.x, p.y, p.width, p.height)) {
                return true;
            }
        }

        // Enemy Collisions
        for (let e of enemies) {
            if (e.id != this.id) {
                if (Util.boxCollision(x, y, w, h, e.x, e.y, e.width, e.height)) {
                    return true;
                }
            }
        }

        // Map Border Collisions
        let topCollision = Util.boxCollision(x, y, w, h, 0, 0, bounds.x, 0);
        let bottomCollision = Util.boxCollision(x, y, w, h, 0, bounds.y, bounds.x, 0);
        let leftCollision = Util.boxCollision(x, y, w, h, 0, 0, 0, bounds.y);
        let rightCollision = Util.boxCollision(x, y, w, h, bounds.x, 0, 0, bounds.y);
        if(topCollision || bottomCollision || leftCollision || rightCollision) return true;

        return false;
    }

    spawn(blocks, bounds, players, enemies) {
        let spawned = false;
        let x, y = undefined;
        while (!spawned) {
            x = Util.randomInt(50, bounds.x - 50);
            y = Util.randomInt(50, bounds.y - 50);
            spawned = !this.collision(x - 30, y - 30, this.width + 30, this.height + 30, blocks, bounds, players, enemies);
        }
        this.x = x;
        this.y = y;
    }

    data() {
        // Returns important information about the enemy
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            turretAngle: this.turretAngle,
            id: this.id,
            image: this.image
        };
    }
    
}

exports.Enemy = Enemy;