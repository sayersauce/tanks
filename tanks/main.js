// Tanks
// Max Sayer
// https://max.lat

(() => {

	// Constants
	
	Game.WIDTH = 1280;
	Game.HEIGHT = 720;
	IMAGES = [
		"tank",
		"tank1",
		"turret",
		"tread",
		"shell"
	];

	// Variables
	
	Game.player;
	Game.canvas = document.getElementById("canvas");
	Game.ctx = canvas.getContext("2d");
	Game.images = {};
	Game.bullets = [];
	Game.camera = { x: 0, y: 0 };
	Game.bounds = { x: 2000, y: 2000 };

	// Game
	
	function loadImages(names, callback) {
		let count = names.length;
		for(let name of names) {
			const image = new Image();
			image.src = "res/" + name + ".png";
			image.onload = () => { if (--count == 0) callback(); Game.images[name] = image; };
		}
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
		Game.camera = { x: Game.player.cx - canvas.width/2, y: Game.player.cy - canvas.height/2 };
	}

	function render() {
		Game.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT); 
		for(let tread of Game.player.treads) {
			tread.draw();
		}
		Game.player.draw();
		for(let bullet of Game.bullets) {
			bullet.draw();
		}

		/*
		for(let x = -500; x < 2000; x+=100) {
			for(let y = -500; y < 2000; y+= 100) {
				GFX.drawText(x + ", " + y, x, y);
			}
		}*/
	}
	
	function frame(last) {
		const now = Util.timestamp();
		const dt = (now - last) / 1000;
		update(dt);
		render();
		requestAnimationFrame(() => { frame(now) });
	}

	function run() {
		Game.player = new Game.Player(Util.randomInt(0, Game.bounds.x), Util.randomInt(0, Game.bounds.y), "max");
		requestAnimationFrame(() => { frame(Util.timestamp()) });
	}	

	function setup() {
		canvas.width = Game.WIDTH;
		canvas.height = Game.HEIGHT;

		document.addEventListener("keydown", (ev) => { return onkey(ev, ev.code, true); }, false);
		document.addEventListener("keyup", (ev) => { return onkey(ev, ev.code, false); }, false);

		loadImages(IMAGES, run);
	}

	setup();

})();