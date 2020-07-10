/**
 * Tanks - Tank Object
 * Max Sayer
 * https://max.lat
 */

(() => {
    class Tank {
        constructor(x, y, angle, name) {
            this.x = x;
            this.y = y;
            this.angle = this.turretAngle = angle;
            this.name = name;
            this.images = [Game.images["tank"], Game.images["tank1"], Game.images["enemy"]];
            this.body = this.images[0];
            this.turret = Game.images["turret"];
            this.width = this.body.width;
            this.height = this.body.height;
        }
    
        draw() {
            this.cx = this.x + this.width / 2;
            this.cy = this.y + this.height / 2;
            GFX.drawImage(this.body, this.x, this.y, this.width, this.height, this.angle);
            GFX.drawImage(this.turret, this.cx - this.turret.width / 2, this.cy - this.turret.height / 2, this.turret.width, this.turret.width, this.turretAngle);
            GFX.drawText(this.name, this.cx - Game.ctx.measureText(this.name).width/2, this.cy + this.height);
        }
    }    

    Game.Tank = Tank;
})();