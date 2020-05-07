Game = {};

window.Util = {
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    },
    limit: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    }
}


window.GFX = {
    // Graphics Handler
    coords: function(x, y) {
        // Coordinates based on camera position, avoids camera moving out of the boundary
        if(Game.camera.x > 0 && Game.camera.x < Game.bounds.x - Game.canvas.width) {
            x = x - Game.camera.x;
        }

        if(Game.camera.x >= Game.bounds.x - Game.canvas.width) {
            x = Game.canvas.width - (Game.bounds.x - x);
        }
        
        if(Game.camera.y > 0 && Game.camera.y < Game.bounds.y - Game.canvas.height) {
            y = y - Game.camera.y;
        }

        if(Game.camera.y >= Game.bounds.y - Game.canvas.height) {
            y = Game.canvas.height - (Game.bounds.y - y);
        }
        
        return {
            x: x,
            y: y
        };
    },
    inView: function(x, y, width, height) {
        const coords = this.coords(x, y);
        return !(coords.x + width < 0 || coords.x > Game.canvas.width || coords.y + height < 0 || coords.y - height > Game.canvas.height);
    },
    drawImage: function(image, x, y, width, height, rotation) {
        const ctx = Game.ctx;
        const coords = this.coords(x, y);
        const cx = coords.x + width / 2;
        const cy = coords.y + height / 2;

        if(!this.inView(x, y, width, height)) {
            return;
        }
        
        ctx.translate(cx, cy);
        ctx.rotate(rotation * Math.PI/180);
        ctx.translate(-cx, -cy);
        ctx.drawImage(image, coords.x, coords.y);
        ctx.resetTransform();
    },
    drawText: function(text, x, y) {
        const ctx = Game.ctx;
        const coords = this.coords(x, y);

        if(!this.inView(x, y, 100, 100)) {
            return;
        }

        ctx.font = "10px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(text, coords.x, coords.y);
    }
}