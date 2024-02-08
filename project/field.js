class Field {
    constructor(cellSize, fieldSize) {
        fieldSize = createVector(
            min(fieldSize.x, width),
            min(fieldSize.y, height)
        );

        this.cellSize = createVector(
            min(cellSize.x,
                min(100, floor(fieldSize.x / 2))
            ),
            min(cellSize.y,
                min(100, floor(fieldSize.y / 2))
            )
        );

        this.fieldSize = createVector(
            floor(fieldSize.x / this.cellSize.x) * this.cellSize.x,
            floor(fieldSize.y / this.cellSize.y) * this.cellSize.y
        );

        this.numDimensions = createVector(
            this.fieldSize.x / this.cellSize.x,
            this.fieldSize.y / this.cellSize.y
        );

        this.offset = createVector(
            (width - this.fieldSize.x) / 2,
            (height - this.fieldSize.y) / 2
        );

        this.grid = true;
        this.border = true;
        this.cellsColor = color(100);
        this.gridColor = color(30);
        this.borderColor = color(100);
        this.setInitialState();
    }

    setInitialState() {
        const cells = [];
        const numCellsPercentage = 0.5;
        const numCells = floor(this.numDimensions.x * this.numDimensions.y * numCellsPercentage);

        for (let i = 0; i < numCells; i++) {
            while (true) {
                const newCell = createVector(
                    floor(random(this.numDimensions.x)),
                    floor(random(this.numDimensions.y)),
                );

                if (!this.isCellAlive(newCell, cells)) {
                    cells.push(newCell);
                    break;
                }
            }
        }

        this.cells = cells;
    }

    setNextGeneration() {
        const newCells = []

        for (let y = 0; y < this.numDimensions.y; y++) {
            for (let x = 0; x < this.numDimensions.x; x++) {
                const currentCell = createVector(x, y);
                const aliveNeighbors = this.getAliveNeighbors(currentCell, this.cells);

                if (this.isCellAlive(currentCell, this.cells)) {
                    if (aliveNeighbors.length == 2 || aliveNeighbors.length == 3) {
                        newCells.push(currentCell);
                    }
                }
                else {
                    if (aliveNeighbors.length == 3) {
                        newCells.push(currentCell);
                    }
                }
            }
        }

        this.cells = newCells;
    }

    isCellAlive(cell, cells) {
        return cells.flat().find(c => c.x === cell.x && c.y === cell.y) !== undefined;
    }

    getAliveNeighbors(cell, cells) {
        const aliveNeighbors = [];
        const neighbors = [
            createVector(cell.x - 1, cell.y - 1),
            createVector(cell.x, cell.y - 1),
            createVector(cell.x + 1, cell.y - 1),
            createVector(cell.x - 1, cell.y),
            createVector(cell.x + 1, cell.y),
            createVector(cell.x - 1, cell.y + 1),
            createVector(cell.x, cell.y + 1),
            createVector(cell.x + 1, cell.y + 1),
        ]

        neighbors.forEach(neighbor => {
            if (this.isCellAlive(neighbor, cells)) {
                aliveNeighbors.push(neighbor);
            }
        });

        return aliveNeighbors;
    }

    renderCells() {
        noStroke();
        fill(this.cellsColor);

        this.cells.forEach(cell => {
            rect(
                this.offset.x + cell.x * this.cellSize.x,
                this.offset.y + cell.y * this.cellSize.y,
                this.cellSize.x,
                this.cellSize.y
            );
        })
    }

    renderGrid() {
        if (this.grid) {
            stroke(this.gridColor);
            strokeWeight(1);
            noFill();

            //vertical
            for (let i = 1; i < this.numDimensions.x; i++) {
                line(
                    this.offset.x + i * this.cellSize.x,
                    this.offset.y,
                    this.offset.x + i * this.cellSize.x,
                    this.offset.y + this.fieldSize.y
                );
            }

            //horizontal
            for (let i = 1; i < this.numDimensions.y; i++) {
                line(
                    this.offset.x,
                    this.offset.y + i * this.cellSize.y,
                    this.offset.x + this.fieldSize.x,
                    this.offset.y + i * this.cellSize.y,
                );
            }
        }
    }

    renderBorder() {
        if (this.border) {
            stroke(this.borderColor);
            strokeWeight(2);
            noFill();
            rect(this.offset.x, this.offset.y, this.fieldSize.x, this.fieldSize.y);
        }
    }

    render() {
        this.renderCells();
        this.renderGrid();
        this.renderBorder();
    }
}