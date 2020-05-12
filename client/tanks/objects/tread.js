// Tanks - Tread Object
// Max Sayer
// https://max.lat

(() => {
    class Tread extends Game.Block {
        constructor(x, y, angle, timestamp) {
            super(Game.images["tread"], x, y, angle);
            this.timestamp = timestamp;
            this.lifespan = 60000;
        }

        alive() {
            if(this.timestamp > Util.datetime() - this.lifespan) {
                return true;
            } 
            return false;
        }
    }

    Game.Tread = Tread;
})();