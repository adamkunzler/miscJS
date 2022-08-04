function getGrid(columns, rows) {
  //
  // define initial grid structure
  //
  let grid = {
    columns: columns,
    rows: rows,
    cells: [],
    calculateIndex: function(column, row) {
      return column + row * this.columns;
    },
    getCoord: function(index) {
      let col = index % columns;
      let row = Math.floor(index / columns);
      return {
        column: col,
        row: row
      };
    },
    randomCell: function() {
      let index = Math.floor(Math.random() * this.cells.length);
      return this.cells[index];
    },
    randomNeighbor: function(cellIndex) {
      let cell = this.cells[cellIndex];
      let whichNeighborIndex = Math.floor(Math.random() * cell.neighbors.length);    
      let neighborIndex = cell.neighbors[whichNeighborIndex];
      let neighbor = grid.cells[neighborIndex];
      return neighbor;
    },
    linkCells: function(a, b, bidirectional=true) {
      a.links.push(b.index);
      
      if(bidirectional) {
        b.links.push(a.index);
      }
    },
    clearCellInfo: function() {
      for(let i = 0; i < this.cells.length; i++) {
        this.cells[i].info = undefined;
      }
    }
  };

  //
  // initialize grid with cells
  //
  let numCells = columns * rows;
  for (let i = 0; i < numCells; i++) {
    let col = i % columns;
    let row = Math.floor(i / columns);

    let cell = {
      column: col,
      row: row,
      index: i,
      info: {},
      links: [],
      neighbors: [],
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined
    };

    grid.cells.push(cell);
  }

  //
  // configure cells with neighbors (assumes rectangular grid)
  //
  for (let i = 0; i < grid.cells.length; i++) {
    let cell = grid.cells[i];
    
    let col = i % columns;
    let row = Math.floor(i / columns);
    
    //console.log(`${i} | ${col}, ${row}`);

    cell.top = row === 0 ? undefined : grid.calculateIndex(col, row - 1);
    cell.bottom = row === rows - 1 ? undefined : grid.calculateIndex(col, row + 1);
    cell.right = col === columns - 1 ? undefined : grid.calculateIndex(col + 1, row);
    cell.left = col === 0 ? undefined : grid.calculateIndex(col - 1, row);

    //console.log(`\ttop ${top}`);
    //console.log(`\tbottom ${bottom}`);    
    //console.log(`\tright ${right}`);
    //console.log(`\tleft ${left}`);

    let neighbors = [];
    if (cell.top >= 0) neighbors.push(cell.top);
    if (cell.bottom >= 0) neighbors.push(cell.bottom);
    if (cell.left >= 0) neighbors.push(cell.left);
    if (cell.right >= 0) neighbors.push(cell.right);

    cell.neighbors = neighbors;
  } // end configure cells

  //
  // return the initialized grid
  //
  return grid;
}