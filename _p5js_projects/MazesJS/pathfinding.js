//
// Builds a distance matrix using Dijkstra's Algorithm
//
function buildDistanceMatrix(startCoord = undefined) {
  //showMazeLines = false;
      
  let startCellIndex = !startCoord 
    ? grid.calculateIndex(0, 0) 
    : grid.calculateIndex(startCoord.column, startCoord.row);
  
  dijkstra(false, startCellIndex);  
      
  //drawSimpleGrid('buildDistanceMatrix');  
  drawGrid();
}

//
// Implementation of Dijkstra's Algorithm
//
function dijkstra(randomStart = true, startCellIndex) {
  
  // initialize the distance matrix with -1's
  distanceMatrix = [];
  for(let i = 0; i < grid.cells.length; i++) {
    distanceMatrix.push(-1);
  }
  
  // pick a random start  
  let startCell = randomStart 
    ? grid.randomCell()
    : grid.cells[startCellIndex];
      
  let frontier = [];  
  distanceMatrix[startCell.index] = 0;
  frontier.push(startCell.index);

  while(frontier.length > 0) {      
    let newFrontier = [];

    // process each cell in the frontier
    for(let i = 0; i < frontier.length; i++) {                        
      
      let cellIndex = frontier[i];              
      let cell = grid.cells[cellIndex];
      
      // check each link for the current cell
      for(let j = 0; j < cell.links.length; j++) {          
        
        // check if we've already gotten the distance for this link
        let linkedCellIndex = cell.links[j];
        if(distanceMatrix[linkedCellIndex] > -1) 
          continue;

        // calculate the distance for this cell
        distanceMatrix[linkedCellIndex] = distanceMatrix[cellIndex] + 1;        
        newFrontier.push(linkedCellIndex);
      }
    }

    frontier = newFrontier;
  }
  
  //maxDistance = Math.max(...distanceMatrix);  
  
  maxDistance = -1;
  for(let i = 0; i < distanceMatrix.length; i++) {
    if(distanceMatrix[i] > maxDistance) maxDistance = distanceMatrix[i];
  }
  
}