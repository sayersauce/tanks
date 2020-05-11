// Tanks - Tread Object
// Max Sayer
// https://max.lat

(() => {
    class Tread extends Game.Block {
        constructor(x, y, angle) {
            super(Game.images["tread"], x, y, angle);
            Game.treads.push(this);
            setTimeout(() => { Game.treads.splice(); }, 30000);
        }
    }

    Game.Tread = Tread;
})();