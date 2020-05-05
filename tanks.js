// Tanks
// Max Sayer
// https://max.lat

(() => {

	"use strict"

	// Constants
	
	const WIDTH = 800;
	const HEIGHT = 600;

	// Variables
	
	let player;
	let canvas = document.getElementById("canvas");
	let ctx = canvas.getContext("2d");
	
	// Helpers

	const Util = {
		randomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min)) + min;
		},
		timestamp: function() {
			return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
		},
		limit: function(value, min, max) {
			return Math.max(min, Math.min(value, max));
		}
	}


	// Classes
	
	class Tank {
		constructor(x, y, name) {
			this.x = x;
			this.y = y;
			this.angle = 0;
			this.name = name;
			this.width = 20;
			this.height = 20;
		}

		draw() {
			let cx = this.x + this.width/2;
			let cy = this.y + this.height/2;

			ctx.translate(cx, cy);
			ctx.rotate(this.angle * Math.PI/180);
			ctx.translate(-cx, -cy);
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(this.x, this.y, this.width, this.height);
			ctx.resetTransform();

			ctx.fillStyle = "#000000";
			ctx.font = "10px Arial";
			ctx.fillText(this.name, this.x, cy + this.height);
		}
	}

	class Player extends Tank {
		constructor(x, y, name) {
			super(x, y, name);

			this.velocity = 0;
			this.maxVelocity = 100;
			this.acceleration = 100;
			this.breaking = 200;
			this.deceleration = 100;
			this.angularVelocity = 90;

			this.input = {
				up: false,
				down: false,
				left: false,
				right: false
			};
		}

		update(dt) {
			if(this.input.up) {
				this.velocity = Util.limit(this.velocity + this.acceleration * dt, 0, this.maxVelocity);
			}

			else if(this.input.down) {
				this.velocity = Util.limit(this.velocity - this.breaking * dt, 0, this.maxVelocity);
			}

			else {
				this.velocity = Util.limit(this.velocity - this.deceleration * dt, 0, this.maxVelocity);
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
	}

	// Game
	
	function onkey(ev, key, pressed) {
		switch(key) {
			case "KeyW": player.input.up = pressed; ev.preventDefault(); break;
			case "KeyS": player.input.down = pressed; ev.preventDefault(); break;
			case "KeyA": player.input.left = pressed; ev.preventDefault(); break;
			case "KeyD": player.input.right = pressed; ev.preventDefault(); break;
		}
	}

	function update(dt) {
		player.update(dt);	
	}

	function render(dt) {
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		player.draw();
	}
	
	function frame(last) {
		const now = Util.timestamp();
		const dt = (now - last) / 1000;
		update(dt);
		render(dt);
		requestAnimationFrame(() => { frame(now) });
	}

	function setup() {
		canvas.width = WIDTH;
		canvas.height = HEIGHT;

		player = new Player(Util.randomInt(0, WIDTH), Util.randomInt(0, HEIGHT), "max");
		document.addEventListener("keydown", (ev) => { return onkey(ev, ev.code, true); }, false);
		document.addEventListener("keyup", (ev) => { return onkey(ev, ev.code, false); }, false);
		requestAnimationFrame(() => { frame(Util.timestamp()) });
	}

	setup();

})();
