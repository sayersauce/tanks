// Tanks - Block Object
// Max Sayer
// https://max.lat

(() => {
    class Block {
        constructor(image, x, y, angle) {
            this.image = image;
            this.width = image.width;
            this.height = image.height;
            this.x = x;
            this.y = y;
            this.angle = angle;
        }

        draw() {
            GFX.drawImage(this.image, this.x, this.y, this.width, this.height, this.angle);
        }
    }

    Game.Block = Block;
})();