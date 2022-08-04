//
// Get the selected maze algorithm
//
function getMazeAlgorithm() {
  let selected = ddlMazes.value();
  switch(selected) {
    case 'aldous-broder':
      return aldousBroderMaze;
    case 'wilsons':
      return wilsonsMaze;
    case 'binary-tree':
      return binaryTreeMaze;    
    case 'hunt-and-kill':
      return huntAndKillMaze;
    case 'recursive-backtracker':
      return recursiveBacktrackerMaze;
    default:      
      return aldousBroderMaze;
  }
}

//
// Generate the specified maze.
// maze: assumed to be a generator function
//
function generateMaze(maze) {   
  let start = performance.now();
  
  let r = maze();
  let result = {
    done: false
  };

  while (!result.done) {
    result = r.next();    
  }
  
  let end = performance.now();
  //console.log(`generateMaze(${maze.name}) took ${(end - start).toFixed(2)}ms`);
}

//
// Aldous-Broder Maze Algorithm
//
function* aldousBroderMaze() {
  this.name = 'Aldous-Broder Maze';
  
  let cell = grid.randomCell();
  cell.info.isActive = true;
  cell.info.isVisited = true;

  // first cell already visited...unvisited is total cells - 1
  let unvisited = grid.cells.length - 1;
  let visits = 0;
  
  while (unvisited > 0) {
    // get a random neighbor    
    let neighbor = grid.randomNeighbor(cell.index);
    
    // if the neighbor hasn't been linked to another cell...link it and decrement our counter
    if (neighbor.links.length === 0) {
      grid.linkCells(cell, neighbor);      
      unvisited--;
    }

    cell.info.isActive = false;
    neighbor.info.isActive = true;
    neighbor.info.isVisited = true;

    cell = neighbor;
    visits++;

    yield;
  }
  
  grid.clearCellInfo();
  //console.log(`Aldous-Broder => Possible Cells: ${grid.cells.length} \t Visits: ${visits}`);
}

//
// Binary Tree Maze Algorithm
//
function* binaryTreeMaze() {
  this.name = 'Binary Tree Maze';
  
  for(let i = 0; i < grid.cells.length; i++) {
    let cell = grid.cells[i];
    cell.info.isActive = true;
    cell.info.isVisited = true;
    
    // get TOP and RIGHT neighbors
    let neighbors = [];
    if(cell.top >= 0) neighbors.push(cell.top);
    if(cell.right >= 0) neighbors.push(cell.right);
    if(neighbors.length === 0) {
      cell.info.isActive = false;
      continue;
    }
    
    // pick a random neighbor and link it with cell
    let ri = Math.floor(Math.random() * neighbors.length);
    let randomNeighbor = grid.cells[neighbors[ri]];
    grid.linkCells(cell, randomNeighbor);
    
    yield;
    
    cell.info.isActive = false;
  } 
  
  grid.clearCellInfo();      
}

//
// Hunt and Kill Maze Algorithm
//
function* huntAndKillMaze() {
  this.name = 'Hunt and Kill Maze';
  
  let cell = grid.randomCell();
  cell.info.isActive = true;
  cell.info.isVisited = true;
      
  while (cell) {        
    
    // get unvisited neighbors
    let unvisitedNeighbors = getUnvisitedNeighbors(cell);
        
    // if we have unvisited neighbors...visit a random one
    if(unvisitedNeighbors.length > 0) {
      let ri = Math.floor(Math.random() * unvisitedNeighbors.length);
      let neighbor = grid.cells[unvisitedNeighbors[ri]];      
      grid.linkCells(cell, neighbor);
      
      cell.info.isActive = false;
      neighbor.info.isVisited = true;
      neighbor.info.isActive = true;
      
      cell = neighbor;
    } else {
      cell.info.isActive = false;
      
      // no unvisited neighbors...time to hunt
      cell = undefined;
      
      // loop through each cell until we find one that is unvisited and 
      // has at least 1 visited neighbor
      for(let i = 0; i < grid.cells.length; i++) {
        // already visited or no visited neighbors
        let visitedNeighbors = getVisitedNeighbors(grid.cells[i]);
        if(grid.cells[i].info.isVisited || visitedNeighbors.length === 0) continue;
                
        // got a cell that hasn't been visited and has at least one visited neighbor
        cell = grid.cells[i];
        cell.info.isActive = true;
        cell.info.isVisited = true;
        
        // link the cell to a random visited neighbor and leave the loop
        let visitedNeighborIndex = visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
        let visitedNeighbor = grid.cells[visitedNeighborIndex];
        grid.linkCells(cell, visitedNeighbor);
        break;
      } // end for grid.cells
    }

    yield;
  } // end while
  
  grid.clearCellInfo();  
}

//
// Implementation of Wilson's Maze Algorithm
//
function* wilsonsMaze() {    
  this.name = 'Wilson\'s Maze';
  
  // add all cells to unvisited
  let unvisited = [...grid.cells.map(x => x.index)];
  
  // pick a random cell and remove it from unvisited
  let firstIndex = Math.floor(Math.random() * unvisited.length);  
  unvisited.splice(firstIndex, 1);
  grid.cells[firstIndex].info.isVisited = true;
      
  // loop while any cell has not been visited
  while (unvisited.length > 0) {      

    let path = [];

    // pick a random cell and add it to the path
    let cellIndex = unvisited[Math.floor(Math.random() * unvisited.length)];
    let cell = grid.cells[cellIndex];
    cell.info.isActive = true;

    path.push(cellIndex);

    // loop through all unvisited cells until
    // we get to a cell that has been visited
    while (unvisited.includes(cellIndex)) {                
      cell.info.isActive = false;
      cell.info.isPending = true;
      
      cell = grid.randomNeighbor(cellIndex);
      cellIndex = cell.index;      
      cell.info.isActive = true;
      
      // check if the active cell hit a cell in the path
      let position = path.indexOf(cellIndex);
      if (position > -1) {        
        
        // remove all the cells in the path from the intersection position
        // and the current position     
        let removedCells = path.splice(position + 1);        
        for(let i =0; i < removedCells.length; i++) {            
          let removedCellIndex = removedCells[i];                     
          grid.cells[removedCellIndex].info.isPending = false;                      
        }                    
        
        cell.info.isActive = true;        
        
      } else {
        // cell isn't in the path...add it
        path.push(cellIndex);
      }

      yield;
    } // end while unvisited.includes

    
    // set all cells in path as visited
    for(let j = 0; j < path.length; j++) {  
      let pathIndex = path[j];
      grid.cells[pathIndex].info.isVisited = true;
      grid.cells[pathIndex].info.isPending = false;
      grid.cells[pathIndex].info.isActive = false;
    }
    
    // process cells in the path            
    for(let j = 0; j < path.length - 1; j++) {        
      // link the path cells together
      let pathCell0 = grid.cells[path[j]];
      let pathCell1 = grid.cells[path[j + 1]];
      grid.linkCells(pathCell0, pathCell1);

      // remove the cell from unvisited
      let unvisitedIndex = unvisited.indexOf(path[j]);
      unvisited.splice(unvisitedIndex, 1);        
    }                  
    
    // reset cell state (for animation)
    for(let j = 0; j < unvisited.length; j++) {
      let unvisitedIndex = unvisited[j];
      grid.cells[unvisitedIndex].info.isVisited = false;
      grid.cells[unvisitedIndex].info.isPending = false;
      grid.cells[unvisitedIndex].info.isActive = false;
    }    
  } // end while unvisited > 0  
  
  grid.clearCellInfo();      
}

//
// Recursive Backtracker Maze Algorithm
//
function* recursiveBacktrackerMaze() {
  this.name = 'Recursive Backtracker Maze';
  
  let maxStackSize = -1;
  
  let stack = [];
    
  // pick a random cell and add it to the stack
  let cellIndex = Math.floor(Math.random() * grid.cells.length);
  stack.push(cellIndex);
      
  while(stack.length > 0) {
    
    // mark the last item in the stack the current cell
    let currentIndex = stack[stack.length - 1];    
    let current = grid.cells[currentIndex];    
    current.info.isActive = true;
    //current.info.isVisited = true;
    
    yield;
    
    // get all the unvisited neighbors for the current cell
    let unvisitedNeighbors = getUnvisitedNeighbors(current);
    if(unvisitedNeighbors.length === 0) {

      // no neighbors that are unvisited...get rid of that guy
      stack.pop();      
      
      current.info.isActive = false;
      current.info.isVisited = true;  
            
    } else {
      
      let ri = Math.floor(Math.random() * unvisitedNeighbors.length);
      let unvisitedNeighborIndex = unvisitedNeighbors[ri];
      let neighbor = grid.cells[unvisitedNeighborIndex];      
      
      grid.linkCells(current, neighbor);
      
      stack.push(neighbor.index);
      
      neighbor.info.isActive = true;
      current.info.isActive = false;
      current.info.isVisited = true;      
    } 
    
    if(stack.length > maxStackSize) maxStackSize = stack.length;
  }      
  
  grid.clearCellInfo();  
  
  console.log(`Recursive Backtracker => Possible Cells: ${grid.cells.length} \t Max Stack Size: ${maxStackSize}`);
}




































function getUnvisitedNeighbors(currentCell) {    
    let result = [];
    for(let i = 0; i < currentCell.neighbors.length; i++) {
      let neighbor = grid.cells[currentCell.neighbors[i]];
      if(!neighbor.info.isVisited) {
        result.push(neighbor.index);
      }
    }
    return result;
  }
  
  function getVisitedNeighbors(currentCell) {    
    let result = [];
    for(let i = 0; i < currentCell.neighbors.length; i++) {
      let neighbor = grid.cells[currentCell.neighbors[i]];
      if(neighbor.info.isVisited) {
        result.push(neighbor.index);
      }
    }
    return result;
  }



