/**
 * Tanks - Helper Functions & Globals
 * Max Sayer
 * https://max.lat
 */

Game = {};
Socket = {};

// Utilities
window.Util = {
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    
    timestamp: function() {
        return window.performance && window.performance.now ? window.performance.now() : this.datetime();
    },

    datetime: function() {
        return new Date().getTime();
    },

    limit: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },

    boxCollision: function(x1, y1, w1, h1, x2, y2, w2, h2) {
        return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
    }
}


// Graphics Handler
window.GFX = {
    coords: function(x, y) {
        // Coordinates based on camera position, avoids camera moving out of the boundary
        if (Game.camera.x > 0 && Game.camera.x < Game.bounds.x - Game.canvas.width) {
            x = x - Game.camera.x;
        }

        if (Game.camera.x >= Game.bounds.x - Game.canvas.width) {
            x = Game.canvas.width - (Game.bounds.x - x);
        }
        
        if (Game.camera.y > 0 && Game.camera.y < Game.bounds.y - Game.canvas.height) {
            y = y - Game.camera.y;
        }

        if (Game.camera.y >= Game.bounds.y - Game.canvas.height) {
            y = Game.canvas.height - (Game.bounds.y - y);
        }
        
        return {
            x: x,
            y: y
        };
    },

    inView: function(x, y, width, height) {
        const coords = this.coords(x, y);
        const tolerance = 50;
        return !(coords.x + width + tolerance < 0 || coords.x - (width + tolerance) > Game.canvas.width || coords.y + height + tolerance < 0 || coords.y - (height + tolerance) > Game.canvas.height);
    },

    drawImage: function(image, x, y, width, height, rotation) {
        const ctx = Game.ctx;
        const coords = this.coords(x, y);
        const cx = coords.x + width / 2;
        const cy = coords.y + height / 2;

        if (!this.inView(x, y, width, height)) {
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

        if (!this.inView(x, y, 100, 100)) {
            return;
        }

        ctx.font = "10px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(text, coords.x, coords.y);
    },

    fillRect: function(x, y, w, h, col) {
        const ctx = Game.ctx;
        const coords = this.coords(x, y);

        if (!this.inView(x, y, w, h)) {
            return;
        }

        ctx.fillStyle = col;
        ctx.fillRect(coords.x, coords.y, w, h)
    }
}