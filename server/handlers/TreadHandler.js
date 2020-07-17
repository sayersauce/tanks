/**
 * Tanks - Tread Handler Class
 * Max Sayer
 * https://max.lat
 */

const Util = require("../util.js");


class TreadHandler {
    constructor() {
        this.treads = [];
        this.treadLife =  60000;
    }

    init(io) {
        this.io = io;
    }

    addTread(data) {
        this.treads.push(data);
        this.io.emit("tread", data);
    }

    updateTreads() {
        for (let i = this.treads.length - 1; i > -1; i--) {
            if (!(this.treads[i].timestamp > Util.timestamp() - this.treadLife)) {
                this.treads.splice(i, 1);
            }
        }
    }
}


module.exports = new TreadHandler();