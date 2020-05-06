// Tanks - Player Object
// Max Sayer
// https://max.lat

(() => {
    class Player extends Game.Tank {
        constructor(x, y, name) {
            super(x, y, name);
    
            this.velocity = 0;
            this.maxVelocity = 100;
            this.acceleration = 100;
            this.deceleration = 150;
            this.angularVelocity = 90;
            this.cooldown = 1;
            this.lastShot = 0;
    
            this.input = {
                up: false,
                down: false,
                left: false,
                right: false
            };
        }
    
        update(dt) {
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
    
            if(this.input.left) {
                this.angle -= this.angularVelocity * dt;
            }
    
            if(this.input.right) {
                this.angle += this.angularVelocity * dt;
            }
    
            this.move(dt);
        }
    
        move(dt) {
            this.x += this.velocity * dt * Math.sin(this.angle * Math.PI/180);
            this.y -= this.velocity * dt * Math.cos(this.angle * Math.PI/180);
        }
    
        shoot() {
            if((Util.timestamp() - this.lastShot) / 1000 > this.cooldown) {
                this.velocity -= 50;
                Game.bullets.push(new Game.Bullet(this.cx, this.cy, this.angle, this.width / 2 + 10));
                this.lastShot = Util.timestamp();
            }
        }
    }

    Game.Player = Player;
})();