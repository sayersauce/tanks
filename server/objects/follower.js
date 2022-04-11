/**
 * Tanks - Follower Enemy Tank Class
 * Max Sayer
 * https://max.lat
 * 
 * This tank follows players.
 */

const { Enemy } = require("./enemy.js");
const { TreadHandler } = require("../handlers/TreadHandler.js");
const Pathfinding = require("../pathfinding/astar.js");


class Follower extends Enemy {
    constructor(x, y, a, id, blockSize, rows, cols, walls, map) {
        super(x, y, a, id);
        this.viewRadius = 800; 
        this.bubble = 30;
        this.turretSpeed = 100;
        this.velocity = 110;
        this.angularVelocity = 800;
        this.lastShot = 0;
        this.cooldown = 6;
        this.pathfindTime = 0;
        this.pathfindInterval = 0.5;
        this.treadDistance = 0;
        this.blockSize = blockSize;
        this.cols = cols;
        this.rows = rows;
        this.walls = walls;
        this.map = map;
        this.route = [];
        this.images = ["follower", "follower1"];
        this.image = this.images[0];
    }

    update(dt, players, enemies, timestamp) {
        // Check for targets
        this.check(players);

        // Seek target & Pathfind to target
        if (this.targetId && players[this.targetId]) {
            this.seek(dt, players[this.targetId], timestamp);

            if ((timestamp - this.pathfindTime) / 1000 > this.pathfindInterval) {
                // New grid must be created every time
                
                let colliders = [...this.walls];
                for (let e of enemies) {
                    let x = Math.round(e.x / this.blockSize);
                    let y = Math.round(e.y / this.blockSize);
                    colliders.push({x: x, y: y, enemy: true});
                }

                let Grid = new Pathfinding.Grid(this.rows, this.cols, colliders)
                let AStar = new Pathfinding.AStar(Grid);

                let player = players[this.targetId];

                let nodeX = Math.floor((this.x + this.width / 2) / this.blockSize);
                let nodeY = Math.floor((this.y + this.height / 2) / this.blockSize);
                let playerX = Math.floor((player.x + player.width / 2) / this.blockSize);
                let playerY = Math.floor((player.y + player.height / 2) / this.blockSize);

                let routeNodes = AStar.pathfind(Grid.getNode({ x: nodeX, y: nodeY }), Grid.getNode({ x: playerX, y: playerY }), this.Grid);
                this.route = [];
                let gradient;
                
                for (let i = 1; i < routeNodes.length; i++) {
                    let node = routeNodes[i];
                    
                    let nodePos = ({ x: node.pos.x * this.blockSize, y: node.pos.y * this.blockSize });

                    // Remove duplicates
                    if (routeNodes.length > 2) {
                        if (i == 1) {
                            gradient = (routeNodes[i + 1].pos.y - node.pos.y) / (routeNodes[i + 1].pos.x - node.pos.x);
                            this.route.push(nodePos);
                        } else if (i < routeNodes.length - 2) {
                            let next = routeNodes[i + 1];
                            let g2 = (routeNodes[i + 2].pos.y - next.pos.y) / (routeNodes[i + 2].pos.x - next.pos.x);

                            if (g2 != gradient) {
                                this.route.push(nodePos);
                            } else {
                                gradient = g2;
                            }
                        } else {
                            this.route.push(nodePos);
                        }
                    } else {
                        this.route.push(nodePos);
                    }
                }                
                this.pathfindTime = timestamp;
            }
        } else {
            this.route = [];
        }

        this.move(dt, players, enemies);
        //this.tread(timestamp);
    }

    move(dt, players, enemies) {
        // Move to target
        if (this.route.length > 1) {
            let nextNode = this.route[0];

            let angleTo = (Math.atan2(nextNode.y - this.y, nextNode.x - this.x) * 180 / Math.PI) + 90;
            this.angle = angleTo;

            // Checking for collisions and personal bubble before moving

            let distanceToTarget = Math.sqrt((this.x - players[this.targetId].x)**2 + (this.y - players[this.targetId].y)**2);
            let dx = this.velocity * dt * Math.sin(this.angle * Math.PI/180);
            let dy = this.velocity * dt * Math.cos(this.angle * Math.PI/180);

            if (!this.collision(this.x + dx, this.y - dy, this.width, this.height, [], this.map.bounds, players, []) && distanceToTarget > this.bubble) {
                this.x += dx;
                this.y -= dy;    
                this.treadDistance += Math.abs(dx) + Math.abs(dy);
            }

            // Removing nodes from the route when reached

            let nodeX = Math.floor((this.x + this.width / 2) / this.blockSize);
            let nodeY = Math.floor((this.y + this.height / 2) / this.blockSize);

            if (nodeX == nextNode.x / this.blockSize && nodeY == nextNode.y / this.blockSize) {
                this.route.splice(0, 1);
            }
        }
    }

    tread(timestamp) {
        if (this.treadDistance > 5) {
            this.image = this.images[1];
        } else {
            this.image = this.images[0];
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
}

exports.Follower = Follower;