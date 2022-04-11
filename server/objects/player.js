/**
 * Tanks - Player Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");
const BulletHandler = require("../handlers/BulletHandler.js");
const TreadHandler = require("../handlers/TreadHandler.js");

class Player {
    constructor(id, blockSize, rows, cols, walls, map) {
        this.id = id;
        this.velocity = 0;
        this.maxVelocity = 140;
        this.acceleration = 100;
        this.deceleration = 150;
        this.angularVelocity = 80;
        this.turretVelocity = 80;
        this.cooldown = 1;
        this.lastShot = 0;
        this.treadDistance = 0;
        this.x = 0;
        this.y = 0;
        this.turretAngle = 0;
        this.angle = 0;
        this.name = "max";
        this.width = 30;
        this.height = 30;
        this.input = {
            w: false,
            a: false,
            s: false,
            d: false,
            left: false,
            right: false,
            space: false
        };
        this.dt = 0;
        this.image = 0;
        this.blockSize = blockSize;
        this.cols = cols;
        this.rows = rows;
        this.walls = walls;
        this.map = map;
        this.route = [];
    }

    update(data, players, enemies) {
        this.name = data.name;
        this.dt = data.dt;
        this.image = data.image;
        this.input = data.input;
        this.move(data.dt, players, enemies);
        if (this.input.space) this.shoot();
        //this.tread()
    }

    move(dt, players, enemies) {
        // Movement
        if (this.input.w) {
            this.velocity = Util.limit(this.velocity + this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
        } else if (this.input.s) {
            this.velocity = Util.limit(this.velocity - this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
        } else if (this.velocity > 0) {
            this.velocity = Util.limit(this.velocity - this.deceleration * dt, 0, this.maxVelocity);
        } else {
            this.velocity = Util.limit(this.velocity + this.deceleration * dt, -this.maxVelocity, 0);
        }
    
        // Rotation
        let da = this.angularVelocity * dt;

        if (this.input.a) {
            this.angle -= da;
            this.turretAngle -= da;
        }

        if (this.input.d) {
            this.angle += da;
            this.turretAngle += da;
        }

        let ta = this.turretVelocity * dt;

        if (this.input.left) {
            this.turretAngle -= ta;
        }

        if (this.input.right) {
            this.turretAngle += ta;
        }

        let dx = this.velocity * dt * Math.sin(this.angle * Math.PI/180);
        let dy = this.velocity * dt * Math.cos(this.angle * Math.PI/180);

        if (this.collision(this.x + dx, this.y, this.width, this.height, this.map.blocks, this.map.bounds, players, enemies)) dx = 0;
        if (this.collision(this.x, this.y - dy, this.width, this.height, this.map.blocks, this.map.bounds, players, enemies)) dy = 0;

        this.x += dx;
        this.y -= dy;
        this.treadDistance += Math.abs(dx) + Math.abs(dy);
        this.velocity = Math.sign(this.velocity) * Math.sqrt(dx**2 + dy**2) / dt;
        this.tread(Util.timestamp());
    }

    tread(timestamp) {
        if (this.treadDistance > 5) {
            this.image = 1;
        } else {
            this.image = 0;
        }

        if (this.treadDistance > 10) {
            TreadHandler.addTread({
                x: this.x,
                y: this.y + this.width / 2,
                angle: this.angle,
                timestamp: timestamp
            })
            this.treadDistance = 0;
        }
    }

    shoot() {
        if ((Util.timestamp() - this.lastShot) / 1000 > this.cooldown) {
            // Recoil Animation
            let difference = Math.abs(this.turretAngle - this.angle) % 360;
            if (difference > 315 || difference < 45) {
                this.velocity -= 40;
            } else if (difference > 135 && difference < 225) {
                this.velocity += 40;
            }

            BulletHandler.addBullet({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                angle: this.turretAngle,
                barrel: this.width / 2 + 10,
                owner: this.id
            });
            this.lastShot = Util.timestamp();
        }
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
            if (p != this.id) {
                p = players[p];
                if (Util.boxCollision(x, y, w, h, p.x, p.y, p.width, p.height)) {
                    return true;
                }
            }
        }

        // Enemy Collisions
        for (let e of enemies) {
            if (Util.boxCollision(x, y, w, h, e.x, e.y, e.width, e.height)) {
                return true;
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
        // Returns important information about the player
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            turretAngle: this.turretAngle,
            image: this.image,
            name: this.name,
            id: this.id,
            width: this.width,
            height: this.height
        };
    }
     
}
 
exports.Player = Player;