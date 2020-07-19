/**
 * A Star Algorithm Implementation
 * Max Sayer
 * https://max.lat
 * 
 * Project from my GitHub https://github.com/sayersauce/astar
 */


// Pathfinding


class Node {
    constructor(pos, wall) {
        this.pos = pos;
        this.wall = wall;
        this.closed = false;
        this.visited = false;
        this.h = 0;
        this.f = 0;
        this.parent = null;
    }
}

class Grid {
    constructor(rows, cols, walls) {
        this.rows = rows;
        this.cols = cols;
        this.nodes = [];
        
        for (let y = 0; y < rows; y++) {
            this.nodes[y] = [];
            for (let x = 0; x < cols; x++) {
                let wall = false;
                for (let w of walls) {
                    if (x == w.x && y == w.y) {
                        wall = true;
                        break;
                    }
                }
                this.nodes[y][x] = new Node({ x: x, y: y }, wall);
            }
        }
    }

    getNode(pos) {
        if (pos.x < 0) {
            pos.x = 0;
        }
        if (pos.y < 0) {
            pos.y = 0;
        }
        if (this.nodes[pos.y] && this.nodes[pos.y][pos.x]) return this.nodes[pos.y][pos.x];
    }

    getNeighbours(node, diagonals) {
        const neighbours = [];
        const x = node.pos.x;
        const y = node.pos.y;

        // North
        if (this.nodes[y-1] && this.nodes[y-1][x]) {
            neighbours.push(this.nodes[y-1][x]);
        }

        // South
        if (this.nodes[y+1] && this.nodes[y+1][x]) {
            neighbours.push(this.nodes[y+1][x]);
        }

        // East
        if (this.nodes[y] && this.nodes[y][x+1]) {
            neighbours.push(this.nodes[y][x+1]);
        }

        // West
        if (this.nodes[y] && this.nodes[y][x-1]) {
            neighbours.push(this.nodes[y][x-1]);
        }

        if (diagonals) {
            // North East
            if (this.nodes[y-1] && this.nodes[y-1][x+1]) {
                neighbours.push(this.nodes[y-1][x+1]);
            }

            // North West
            if (this.nodes[y-1] && this.nodes[y-1][x-1]) {
                neighbours.push(this.nodes[y-1][x-1]);
            }

            // South East
            if (this.nodes[y+1] && this.nodes[y+1][x+1]) {
                neighbours.push(this.nodes[y+1][x+1]);
            }

            // South West
            if (this.nodes[y+1] && this.nodes[y+1][x-1]) {
                neighbours.push(this.nodes[y+1][x-1]);
            }
        }
        
        return neighbours;
    }
}

class AStar {
    constructor(grid) {
        this.grid = grid;
    }

    pathfind(start, end, diagonals) {
        // Parameters `start` and `end` are nodes
        const openList = [start];

        while (openList.length) {
            // Get node with the lowest f cost in the openList
            let lowIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[lowIndex].f) {
                    lowIndex = i;
                }
            }
            let current = openList[lowIndex];

            // Check if the current node is at the end position. If so we have finished
            if (current.pos == end.pos) {
                // Return path from start to end
                let c = current;
                const path = [c];
                while (c.parent) {
                    path.push(c.parent);
                    c = c.parent;
                }
                return path.reverse();
            }

            // If not, mark the current node as closed
            current.closed = true;
            openList.splice(lowIndex, 1);
            let neighbours = this.grid.getNeighbours(current, diagonals);

            for (let neighbour of neighbours) {
                // Check neighbour is valid
                if (neighbour.wall || neighbour.closed) {
                    continue;
                }

                // Calculating g cost, assuming initially it is diagonal     
                let g = current.g + 14;

                // Checks if the node isn't diagonal, if not it has a g cost of 10
                let north = neighbour.pos.x == current.pos.x && neighbour.pos.y == current.pos.y - 1;
                let south = neighbour.pos.x == current.pos.x && neighbour.pos.y == current.pos.y + 1;
                let east = neighbour.pos.x == current.pos.x + 1 && neighbour.pos.y == current.pos.y;
                let west = neighbour.pos.x == current.pos.x - 1 && neighbour.pos.y == current.pos.y;
                if (north || south || east || west) g = current.g + 10;
                

                // Check if the neighbour has not been visited or if it has a lower g cost than its current one
                if (!neighbour.visited || g < neighbour.g) {
                    let h = this.heuristic(neighbour.pos, end.pos);
                    let f = g + h;

                    neighbour.g = g;
                    neighbour.h = h;
                    neighbour.f = f;
                    neighbour.visited = true;
                    neighbour.parent = current;
                    openList.push(neighbour);
                }
            }
        }

        // No path
        return [];
    }

    heuristic(pos1, pos2) {
        // Using The Manhattan Distance heuristic
        return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
    }
}

module.exports = { AStar: AStar, Grid: Grid };
