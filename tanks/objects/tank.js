// Tanks - Tank Object
// Max Sayer
// https://max.lat

(() => {
    class Tank {
        constructor(x, y, name) {
            this.x = x;
            this.y = y;
            this.angle = 0;
            this.name = name;
            this.body = Game.images["tank"];
            this.turret = Game.images["turret"];
            this.width = this.body.width;
            this.height = this.body.height;
        }
    
        draw() {
            this.cx = this.x + this.width / 2;
            this.cy = this.y + this.height / 2;
            gfx.drawImage(this.body, this.x, this.y, this.width, this.height, this.angle);
            gfx.drawImage(this.turret, this.cx - this.turret.width / 2, this.cy - this.turret.height / 2, this.turret.width, this.turret.width, this.angle);
            Game.ctx.fillStyle = "#000000";
            Game.ctx.font = "10px Arial";
            Game.ctx.fillText(this.name, this.x, this.cy + this.height);
        }
    }    

    Game.Tank = Tank;
})();