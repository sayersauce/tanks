/**
 * Tanks - Enemy Tanks
 * Max Sayer
 * https://max.lat
 * 
 * Enemies are sent as fake `player` tanks.
 */

class Enemy {
    constructor(x, y, a, id) {
        this.x = x;
        this.y = y;
        this.angle = a;
        this.id = id;
        this.viewRadius = 500; 
        this.angularSpeed = 50;
        this.lastShot = 0;
        this.cooldown = 2;
        this.shooting = false;
        this.width = 30;
        this.height = 30;
    }

    update(dt, players, timestamp) {
        this.check(players);

        if (this.targetId && players[this.targetId]) {
            this.seek(dt, players[this.targetId], timestamp);
        }
    }

    check(players) {
        // Checks for players within its view radius

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
            angleToTarget = 360 - angleToTarget;
        }
        
        let difference = this.angle - angleToTarget;

        // console.log({ angle: this.angle, targetAngle: angleToTarget, difference: difference });

        if (Math.abs(difference) > 1) {
            if (difference < 0) {
                this.rotate(this.angularSpeed, dt);
            } else {
                this.rotate(-this.angularSpeed, dt);
            }
        } else {
            if ((timestamp - this.lastShot) / 1000 > this.cooldown) {
                this.shooting = true;
                this.lastShot = timestamp;
            }
        }
    }

    rotate(a, dt) {
        this.angle += a * dt;
        this.angle = this.angle % 360;
        if (this.angle < 0) {
            this.angle = 360 - this.angle;
        }
    }

    inView(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1)**2 + (y2 - y1)**2) <= this.viewRadius;
    }

    spawn(blocks, bounds, boxCollision, randomInt) {
        while (true) {
            let x = randomInt(this.width * 2, bounds.x - this.width * 2);
            let y = randomInt(this.height * 2, bounds.y - this.height * 2);

            for (let b of blocks) {
                if (boxCollision(x, y, this.width, this.height, b.x, b.y, 30, 30)) {
                    continue;
                }
            }

            this.x = x;
            this.y = y;
            break;
        }

    }
    
}

exports.Enemy = Enemy;