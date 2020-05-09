// Tanks
// Max Sayer
// https://max.lat

(() => {

	// Constants
	
	const IMAGES = [
		"tank",
		"tank1",
		"turret",
		"tread",
		"shell",
		"rock"
	];

	// Variables

	Game.width = 1280;
	Game.height = 720;
	Game.player;
	Game.canvas = document.getElementById("canvas");
	Game.ctx = canvas.getContext("2d");
	Game.images = {};
	Game.players = {};
	Game.bullets = [];
	Game.treads = [];
	Game.blocks = [];
	Game.camera = { x: 0, y: 0 };
	Game.bounds = { x: 2000, y: 2000 };
	Game.fullscreen = false;

	// Game
	
	function loadImages(names, callback) {
		let count = names.length;
		for(let name of names) {
			const image = new Image();
			image.src = "res/" + name + ".png";
			image.onload = () => { Game.images[name] = image; if (--count == 0) callback(); };
		}
	}

	function onkey(ev, key, pressed) {
		switch(key) {
			case "ArrowUp":
			case "KeyW": Game.player.input.up = pressed; ev.preventDefault(); break;
			case "ArrowDown":
			case "KeyS": Game.player.input.down = pressed; ev.preventDefault(); break;
			case "ArrowLeft":
			case "KeyA": Game.player.input.left = pressed; ev.preventDefault(); break;
			case "ArrowRight":
			case "KeyD": Game.player.input.right = pressed; ev.preventDefault(); break;
			case "Space": Game.player.shoot(); ev.preventDefault(); break;
		}
	}

	function update(dt) {
		Game.player.update(dt);	
		Game.camera = { x: Game.player.cx - canvas.width/2, y: Game.player.cy - canvas.height/2 };
	}

	function render() {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height); 
		Game.ctx.fillStyle = "#ffffff";
		Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

		for(let tread of Game.treads) {
			tread.draw();
		}

		for(let bullet of Game.bullets) {
			bullet.draw();
		}

		for(let block of Game.blocks) {
			block.draw();
		}

		Game.player.draw();

		for(let player in Game.players) {
			Game.players[player].draw();
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
		Game.player = new Game.Player(Util.randomInt(50, Game.bounds.x - 50), Util.randomInt(50, Game.bounds.y - 50), 0, "max");
		Game.blocks = [new Game.Block(Game.images["rock"], 100, 100, 0)];
		requestAnimationFrame(() => { frame(Util.timestamp()) });
	}	

	function setup() {
		canvas.width = Game.width;
		canvas.height = Game.height;

		document.addEventListener("keydown", (ev) => { return onkey(ev, ev.code, true); }, false);
		document.addEventListener("keyup", (ev) => { return onkey(ev, ev.code, false); }, false);

		loadImages(IMAGES, run);
	}

	setup();

})();
