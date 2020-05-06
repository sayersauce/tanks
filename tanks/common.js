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


window.gfx = {
    drawImage : function(image, x, y, width, height, rotation) {
        let cx = x + width / 2;
        let cy = y + height / 2;
        Game.ctx.translate(cx, cy);
        Game.ctx.rotate(rotation * Math.PI/180);
        Game.ctx.translate(-cx, -cy);
        Game.ctx.drawImage(image, x, y);
        Game.ctx.resetTransform();
    }
}