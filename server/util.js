/**
 * Tanks - Utilities Object
 * Max Sayer
 * https://max.lat
 */


module.exports = {
    randomId: () => {
        return Math.floor(Math.random() * module.exports.timestamp()); 
    },
    
    timestamp: () => {
        return new Date().getTime();
    },

    limit: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },
    
    boxCollision: (x1, y1, w1, h1, x2, y2, w2, h2) => {
        return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2);
    },
    
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}