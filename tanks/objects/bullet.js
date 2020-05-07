// Tanks - Bullet Object
// Max Sayer
// https://max.lat

(() => {
    class Bullet {
		constructor(x, y, angle, barrelLength) {
			this.image = Game.images["shell"];
			this.x = x + (barrelLength * Math.sin(angle * Math.PI/180)) - this.image.width/2;
			this.y = y - (barrelLength * Math.cos(angle * Math.PI/180)) - this.image.height/2;
			this.angle = angle;
			this.velocity = 400;
		}

		draw() {
			GFX.drawImage(this.image, this.x, this.y, this.image.width, this.image.height, this.angle);
		}

		update(dt) {
			this.move(dt);
		}

		move(dt) {
			this.x += this.velocity * dt * Math.sin(this.angle * Math.PI/180);
			this.y -= this.velocity * dt * Math.cos(this.angle * Math.PI/180);
		}
    }
    
    Game.Bullet = Bullet;
})();