/**
 * Tanks - Follower Enemy Tank Class
 * Max Sayer
 * https://max.lat
 * 
 * This tank follows players.
 */

const { Enemy } = require("./enemy.js");
const Pathfinding = require("../pathfinding/astar.js");


class Follower extends Enemy {
    constructor(x, y, a, id, blockSize, rows, cols, walls, map, TreadHandler) {
        super(x, y, a, id);
        this.viewRadius = 1000; 
        this.turretSpeed = 100;
        this.velocity = 100;
        this.angularVelocity = 80;
        this.lastShot = 0;
        this.cooldown = 6;
        this.pathfindTime = 0;
        this.pathfindInterval = 2;
        this.treadDistance = 0;
        this.TreadHandler = TreadHandler;
        this.blockSize = blockSize;
        this.cols = cols;
        this.rows = rows;
        this.walls = walls;
        this.map = map;
        this.route = [];
    }

    update(dt, players, enemies, timestamp) {
        // Check for targets
        this.check(players);

        // Seek target & Pathfind to target
        if (this.targetId && players[this.targetId]) {
            this.seek(dt, players[this.targetId], timestamp);

            if ((timestamp - this.pathfindTime) / 1000 > this.pathfindInterval) {
                // New grid must be created every time
                let Grid = new Pathfinding.Grid(this.rows, this.cols, this.walls)
                let AStar = new Pathfinding.AStar(Grid);

                let player = players[this.targetId];

                let nodeX = Math.floor(this.x / this.blockSize);
                let nodeY = Math.floor(this.y / this.blockSize);
                let playerX = Math.floor(player.x / this.blockSize);
                let playerY = Math.floor(player.y / this.blockSize);

                let routeNodes = AStar.pathfind(Grid.getNode({ x: nodeX, y: nodeY }), Grid.getNode({ x: playerX, y: playerY }), this.Grid);
                this.route = [];
                for (let node of routeNodes) {
                    this.route.push({ x: node.pos.x * this.blockSize, y: node.pos.y * this.blockSize });
                }
                
                this.pathfindTime = timestamp;
            }
        } else {
            this.route = [];
        }

        this.move(dt, players, enemies);
        this.tread(timestamp);
    }

    move(dt, players, enemies) {
        // Move to target
        if (this.route.length > 3) {
            let desiredPos = this.route[1];

            // Calculating difference in angles

            let angleTo = (Math.atan2(desiredPos.y - this.y, desiredPos.x - this.x) * 180 / Math.PI) + 90;

            if (angleTo > 360) {
                angleTo %= 360;
            } else if (angleTo < 0) {
                angleTo += 360;
            }

            let a = Math.abs(this.angle - angleTo) % 360;
            let d = a
            let sign = -1;

            if (a > 180) {
                d = 360 - a
            }

            if ((this.angle - angleTo >= 0 && this.angle - angleTo <= 180) || (this.angle - angleTo <=-180 && this.angle - angleTo >= -360)) {
                sign = 1;
            }
            
            d = d * sign;

            // If difference is positive, steer anti-clockwise, otherwise if negative steer clockwise
            if (d > 0) {
                this.angle -= this.angularVelocity * dt;
            } else if (d < 0) {
                this.angle += this.angularVelocity * dt;
            }

            let dx = this.velocity * dt * Math.sin(this.angle * Math.PI/180);
            let dy = this.velocity * dt * Math.cos(this.angle * Math.PI/180);

            if (!this.collision(this.x + dx, this.y - dy, this.width, this.height, this.map.blocks, this.map.bounds, players, enemies)) {
                this.x += dx;
                this.y -= dy;    
                this.treadDistance += Math.abs(dx) + Math.abs(dy);
            }
        }
    }

    tread(timestamp) {
        if (this.treadDistance > 10) {
            this.TreadHandler.addTread({
                x: this.x,
                y: this.y + this.width / 2,
                angle: this.angle,
                timestamp: timestamp
            })
            this.treadDistance = 0;
        }
    }
}

exports.Follower = Follower;