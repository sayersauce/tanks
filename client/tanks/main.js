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
	Game.scoreboard = new Game.Scoreboard(Game.width - 200, 10);
	Game.camera = { x: 0, y: 0 };
	Game.bounds = { x: 1500, y: 1500 };
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
			case "KeyW": Game.player.input.w = pressed; ev.preventDefault(); break;
			case "KeyS": Game.player.input.s = pressed; ev.preventDefault(); break;
			case "KeyA": Game.player.input.a = pressed; ev.preventDefault(); break;
			case "KeyD": Game.player.input.d = pressed; ev.preventDefault(); break;
			case "ArrowLeft": Game.player.input.left = pressed; ev.preventDefault(); break;
			case "ArrowRight": Game.player.input.right = pressed; ev.preventDefault(); break;
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

		Game.scoreboard.draw();
	}
	
	function frame(last) {
		const now = Util.timestamp();
		const dt = (now - last) / 1000;
		update(dt);
		render();
		requestAnimationFrame(() => { frame(now) });
	}

	function run() {
		Game.player = new Game.Player(0, "max");
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
