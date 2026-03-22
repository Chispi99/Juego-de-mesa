// js/types/board.js
export class Board {
    constructor(cols = 8, rows = 8) {
        this.cols = cols;
        this.rows = rows;
        this.towers = [];
        
        // Definimos la ruta de celdas (x, y) por las que caminará el enemigo
        this.path = [
            { x: -1, y: 1 }, 
            { x: 5, y: 1 },
            { x: 5, y: 5 },
            { x: 2, y: 5 },
            { x: 2, y: 7 },
            { x: 7, y: 7 } // Final dentro del tablero (índices 0-7)
        ];
    }

    isPathCell(x, y) {
        for (let i = 0; i < this.path.length - 1; i++) {
            const p1 = this.path[i];
            const p2 = this.path[i+1];
            if (p1.x === p2.x && x === p1.x && y >= Math.min(p1.y, p2.y) && y <= Math.max(p1.y, p2.y)) return true;
            if (p1.y === p2.y && y === p1.y && x >= Math.min(p1.x, p2.x) && x <= Math.max(p1.x, p2.x)) return true;
        }
        return false;
    }

    isCellEmpty(x, y) {
        if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return false;
        return !this.towers.some(t => t.x === x && t.y === y) && !this.isPathCell(x, y);
    }
}
