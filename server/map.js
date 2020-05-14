/**
 * Tanks - Server Map Loading
 * Max Sayer
 * https://max.lat
 * 
 * Maps are stored as png image files, where each pixel represents a block.
 * Each block type is represented by a different rgb value.
 * The width and height of the image determine the Game's map size.
 */

const fs = require("fs");
const PNG = require("pngjs").PNG;

const blockSize = 30;
const types = {
    "0,0,255": "blue",
    "0,0,0": "stone"
};

// Load map function
exports.load = function(path, callback) {
    fs.createReadStream(path).pipe(new PNG()).on("parsed", function() {
        callback({
            blocks: convertToMap(this.width, this.data),
            width: this.width * blockSize,
            height: this.height * blockSize
        });
    });
}

// This function converts the opaque pixels to an array of blocks
function convertToMap(width, data) {
    let map = [];

    for (let i = 0; i < data.length; i += 4) {
        let pixel = new Int16Array(data.slice(i, i + 4));

        // Opaque pixels are blocks
        if (pixel[3] == 255 && pixel.slice(0, 3) in types) {
            pixel = pixel.slice(0, 3).toString();

            let block = {};
            block.image = types[pixel];
            block.x = ((i / 4) % width) * blockSize;
            block.y = Math.floor((i / 4) / width) * blockSize;

            map.push(block);
        }
    }

    return map;
}