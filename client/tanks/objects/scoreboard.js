/**
 * Tanks - Scoreboard Object
 * Max Sayer
 * https://max.lat
 */

(() => {
    class Scoreboard {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.values = {};
        }
    
        draw() {
            let ctx = Game.ctx;
            ctx.font = "10px Arial";
            ctx.fillStyle = "#000000";
            ctx.fillText("Scoreboard:", this.x, this.y);
    
            let offset = 12;
            for (let player in this.values) {
                // Player name defaults to 'Unknown'
                let name = "Unknown";

                if (Game.players[player]) {
                    // If the player is in the players array, then set its name
                    name = Game.players[player].name;
                } else if (Socket.id == player) {
                    // If the player isn't in the players array, then it might be the client
                    name = Game.player.name;
                }

                ctx.fillText(name + ": " + this.values[player], this.x, this.y + offset);
                offset += 10;
            }
        }
    }    

    Game.Scoreboard = Scoreboard;
})();