/**
 * Tanks - Bullet Object
 * Max Sayer
 * https://max.lat
 * 
 * Bullets are updated both client-side and server-side.
 * This is to make the bullets appear smooth in motion.
 * Collision detection is performed server-side.
 */

(() => {
    class Bullet {
		constructor(x, y, angle, barrelLength) {
			this.velocity = 400;
			this.image = Game.images["shell"];
			this.angle = angle;
			this.dx = Math.sin(this.angle * Math.PI/180);
			this.dy = Math.cos(this.angle * Math.PI/180);
			this.x = x;
			this.y = y;
		}

		update(dt) {
			this.x += dt * this.velocity * this.dx;
			this.y -= dt * this.velocity * this.dy;
		}

		draw() {
			GFX.drawImage(this.image, this.x, this.y, this.image.width, this.image.height, this.angle);
		}
    }
    
    Game.Bullet = Bullet;
})();