// Tanks - Player Object
// Max Sayer
// https://max.lat

(() => {
    class Player extends Game.Tank {
        constructor(x, y, angle, name) {
            super(x, y, angle, name);
    
            this.velocity = 0;
            this.maxVelocity = 150;
            this.acceleration = 100;
            this.deceleration = 150;
            this.angularVelocity = 90;
            this.cooldown = 1;
            this.lastShot = 0;
            this.treads = [];
            this.treadDistance = 0;
    
            this.input = {
                up: false,
                down: false,
                left: false,
                right: false
            };
        }
    
        update(dt) {
            // Movement
            if(this.input.up) {
                this.velocity = Util.limit(this.velocity + this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
            }
    
            else if(this.input.down) {
                this.velocity = Util.limit(this.velocity - this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
            }
    
            else {
                if(this.velocity > 0) {
                    this.velocity = Util.limit(this.velocity - this.deceleration * dt, 0, this.maxVelocity);
                } else {
                    this.velocity = Util.limit(this.velocity + this.deceleration * dt, -this.maxVelocity, 0);
                }
            }
        
            // Rotation
            if(this.input.left) {
                this.angle -= this.angularVelocity * dt;
            }
    
            if(this.input.right) {
                this.angle += this.angularVelocity * dt;
            }
            
            this.move(dt);
            this.tread();
        }
    
        move(dt) {
            let dx = this.velocity * dt * Math.sin(this.angle * Math.PI/180);
            let dy = this.velocity * dt * Math.cos(this.angle * Math.PI/180);

            // Block Collisions
            for(let b of Game.blocks) {
                if(Util.boxCollision(this.x + dx, this.y, this.width, this.height, b.x, b.y, b.width, b.height)) {
                    dx = 0;
                }

                if(Util.boxCollision(this.x, this.y - dy, this.width, this.height, b.x, b.y, b.width, b.height)) {
                    dy = 0;
                }
            }

            // Player Collisions
            for(let p in Game.players) {
                p = Game.players[p];
                if(Util.boxCollision(this.x + dx, this.y, this.width, this.height, p.x, p.y, p.width, p.height)) {
                    dx = 0;
                }

                if(Util.boxCollision(this.x, this.y - dy, this.width, this.height, p.x, p.y, p.width, p.height)) {
                    dy = 0;
                }
            }

            // Map Border Collisions
            let topCollision = Util.boxCollision(this.x, this.y - dy, this.width, this.height, 0, 0, Game.bounds.x, 0);
            let bottomCollision = Util.boxCollision(this.x, this.y - dy, this.width, this.height, 0, Game.bounds.y, Game.bounds.x, 0);
            let leftCollision = Util.boxCollision(this.x + dx, this.y, this.width, this.height, 0, 0, 0, Game.bounds.y);
            let rightCollision = Util.boxCollision(this.x + dx, this.y, this.width, this.height, Game.bounds.x, 0, 0, Game.bounds.y);
            if(topCollision || bottomCollision) dy = 0;
            if(leftCollision || rightCollision) dx = 0; 

            this.x += dx;
            this.y -= dy;
            this.treadDistance += Math.abs(dx) + Math.abs(dy);
            this.velocity = Math.sign(this.velocity) * Math.sqrt(dx**2 + dy**2) / dt;

            Socket.sendObject("position", {
                x: this.x,
                y: this.y,
                angle: this.angle,
                image: this.images.indexOf(this.body)
            });
        }
    
        shoot() {
            if((Util.timestamp() - this.lastShot) / 1000 > this.cooldown) {
                this.velocity -= 50;
                Socket.sendObject("bullet", {
                    x: this.cx,
                    y: this.cy,
                    angle: this.angle,
                    barrel: this.width / 2 + 10
                });
                this.lastShot = Util.timestamp();
            }
        }

        tread() {
            // Track Animation
            if(this.treadDistance > 5) {
                this.body = this.images[1];
            } else {
                this.body = this.images[0];
            }

            if(this.treadDistance > 10) {
                // Treadmarks
                Socket.sendObject("tread", {
                    x: this.x,
                    y: this.cy,
                    angle: this.angle
                });
                this.treadDistance = 0;
            }
        }

        spawn() {
            this.x = Util.randomInt(50, Game.bounds.x - 50);
            this.y = Util.randomInt(50, Game.bounds.y - 50);
        }
    }

    Game.Player = Player;
})();