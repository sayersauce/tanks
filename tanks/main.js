// Tanks
// Max Sayer
// https://max.lat

(() => {

	// Constants
	
	Game.WIDTH = 1280;
	Game.HEIGHT = 720;

	// Variables
	
	Game.player;
	Game.canvas = document.getElementById("canvas");
	Game.ctx = canvas.getContext("2d");
	Game.images = {};
	Game.bullets = [];

	// Game
	
	function loadImage(name, last = false) {
		const image = new Image();
		image.src = "res/" + name + ".png";
		image.onload = () => {
			Game.images[name] = image;
			if(last) {
				run();
			}
		}
	}
	
	function loadImages() {
		loadImage("tank");
		loadImage("turret");
		loadImage("shell", true);
	}

	function onkey(ev, key, pressed) {
		switch(key) {
			case "KeyW": Game.player.input.up = pressed; ev.preventDefault(); break;
			case "KeyS": Game.player.input.down = pressed; ev.preventDefault(); break;
			case "KeyA": Game.player.input.left = pressed; ev.preventDefault(); break;
			case "KeyD": Game.player.input.right = pressed; ev.preventDefault(); break;
			case "Space": Game.player.shoot(); ev.preventDefault(); break;
		}
	}

	function update(dt) {
		Game.player.update(dt);	
		for(bullet of Game.bullets) {
			bullet.update(dt);
		}
	}

	function render() {
		Game.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
		Game.player.draw();
		for(bullet of Game.bullets) {
			bullet.draw();
		}
	}
	
	function frame(last) {
		const now = Util.timestamp();
		const dt = (now - last) / 1000;
		update(dt);
		render();
		requestAnimationFrame(() => { frame(now) });
	}

	function run() {
		Game.player = new Game.Player(Util.randomInt(0, Game.WIDTH), Util.randomInt(0, Game.HEIGHT), "max");
		requestAnimationFrame(() => { frame(Util.timestamp()) });
	}	

	function setup() {
		canvas.width = Game.WIDTH;
		canvas.height = Game.HEIGHT;

		document.addEventListener("keydown", (ev) => { return onkey(ev, ev.code, true); }, false);
		document.addEventListener("keyup", (ev) => { return onkey(ev, ev.code, false); }, false);

		loadImages();
	}

	setup();

})();
