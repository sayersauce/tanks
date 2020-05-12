// Tanks - Player Object
// Max Sayer
// https://max.lat

(() => {
    class Player extends Game.Tank {
        constructor(angle, name) {
            super(undefined, undefined, angle, name);
            this.spawn();
    
            this.velocity = 0;
            this.maxVelocity = 150;
            this.acceleration = 100;
            this.deceleration = 150;
            this.angularVelocity = 90;
            this.turretVelocity = 60;
            this.cooldown = 1;
            this.lastShot = 0;
            this.treadDistance = 0;
    
            this.input = {
                w: false,
                a: false,
                s: false,
                d: false,
                left: false,
                right: false
            };
        }
    
        update(dt) {
            if(!dt) {
                return;
            }

            // Movement
            if(this.input.w) {
                this.velocity = Util.limit(this.velocity + this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
            } else if(this.input.s) {
                this.velocity = Util.limit(this.velocity - this.acceleration * dt, -this.maxVelocity, this.maxVelocity);
            } else {
                if(this.velocity > 0) {
                    this.velocity = Util.limit(this.velocity - this.deceleration * dt, 0, this.maxVelocity);
                } else {
                    this.velocity = Util.limit(this.velocity + this.deceleration * dt, -this.maxVelocity, 0);
                }
            }
        
            // Rotation

            let da = this.angularVelocity * dt;

            if(this.input.a) {
                this.angle -= da;
                this.turretAngle -= da;
            }
    
            if(this.input.d) {
                this.angle += da;
                this.turretAngle += da;
            }

            let ta = this.turretVelocity * dt;

            if(this.input.left) {
                this.turretAngle -= ta;
            }

            if(this.input.right) {
                this.turretAngle += ta;
            }

            this.move(dt);
            this.tread();
        }

        collision(x, y, w, h) {
            // Block Collisions
            for(let b of Game.blocks) {
                if(Util.boxCollision(x, y, w, h, b.x, b.y, b.width, b.height)) {
                    return true;
                }
            }

            // Player Collisions
            for(let p in Game.players) {
                p = Game.players[p];
                if(Util.boxCollision(x, y, w, h, p.x, p.y, p.width, p.height)) {
                    return true;
                }
            }

            // Map Border Collisions
            let topCollision = Util.boxCollision(x, y, w, h, 0, 0, Game.bounds.x, 0);
            let bottomCollision = Util.boxCollision(x, y, w, h, 0, Game.bounds.y, Game.bounds.x, 0);
            let leftCollision = Util.boxCollision(x, y, w, h, 0, 0, 0, Game.bounds.y);
            let rightCollision = Util.boxCollision(x, y, w, h, Game.bounds.x, 0, 0, Game.bounds.y);
            if(topCollision || bottomCollision || leftCollision || rightCollision) return true;

            return false;
        }
    
        move(dt) {
            let dx = this.velocity * dt * Math.sin(this.angle * Math.PI/180);
            let dy = this.velocity * dt * Math.cos(this.angle * Math.PI/180);

            if(this.collision(this.x + dx, this.y, this.width, this.height)) dx = 0;
            if(this.collision(this.x, this.y - dy, this.width, this.height)) dy = 0;

            this.x += dx;
            this.y -= dy;
            this.treadDistance += Math.abs(dx) + Math.abs(dy);
            this.velocity = Math.sign(this.velocity) * Math.sqrt(dx**2 + dy**2) / dt;

            Socket.sendObject("position", {
                x: this.x,
                y: this.y,
                angle: this.angle,
                turretAngle: this.turretAngle,
                image: this.images.indexOf(this.body),
                name: this.name
            });

        }
    
        shoot() {
            if((Util.timestamp() - this.lastShot) / 1000 > this.cooldown) {
                // Recoil Animation
                let difference = Math.abs(this.turretAngle - this.angle) % 360;
                if(difference > 315 || difference < 45) {
                    this.velocity -= 50;
                } else if(difference > 135 && difference < 225) {
                    this.velocity += 50;
                }

                Socket.sendObject("bullet", {
                    x: this.cx,
                    y: this.cy,
                    angle: this.turretAngle,
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
                    angle: this.angle,
                    timestamp: Util.datetime()
                });
                this.treadDistance = 0;
            }
        }

        spawn() {
            let spawned = false;
            while(!spawned) {
                this.x = Util.randomInt(50, Game.bounds.x - 50);
                this.y = Util.randomInt(50, Game.bounds.y - 50);
                spawned = !this.collision(this.x - 30, this.y - 30, this.width + 30, this.height + 30);
            }
        }
    }

    Game.Player = Player;
})();