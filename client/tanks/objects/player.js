/**
 * Tanks - Player Object
 * Max Sayer
 * https://max.lat
 */

(() => {
    class Player extends Game.Tank {
        constructor(angle, name) {
            super(undefined, undefined, angle, name);
    
            this.input = {
                w: false,
                a: false,
                s: false,
                d: false,
                left: false,
                right: false,
                space: false
            };
        }
    
        update(dt) {
            super.update();

            if (!dt) {
                return;
            }

            Socket.sendObject("position", {
                dt: dt,
                image: this.images.indexOf(this.body),
                name: this.name,
                input: this.input
            });
        }
    }

    Game.Player = Player;
})();