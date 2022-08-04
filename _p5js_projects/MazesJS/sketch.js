// watch this for changing an image for generating an image mask
//https://www.youtube.com/watch?v=0L2n8Tg2FwI

p5.disableFriendlyErrors = true;

let colors;
let colorPalette = ['black', 'red', 'yellow', 'orange', 'white'];
//let colorPalette = ['black', '#193B1A', '#337634', '#48A94A', 'white'];
let colorCache = [];

let isFullscreen = true;
let screenScale = 0.9;
let cellSize = 25;
let gridDim = { 
  columns: 65, 
  rows: 65
};
let grid;

let gfxLines;
let linesNeedRefresh = true;

let distanceMatrix;
let maxDistance;
let showDie = false;
let showMazeLines = true;
let isMouseMoveEnabled = false;

let mazeColor = '#ffffff';
let isAnimate = false;
let isAnimateDone = true;
let mazeAnimate;
let skipAmount = 1;

let selectedMazeType;

function reloadMazeApp() {
  setupTheCanvas();
  doGenerateMaze();
}

function setupTheCanvas() {
  cellSize = !ddlCellSize ? 25 : +ddlCellSize.value();
  
  if (isFullscreen) {
    let cw = Math.floor(windowWidth * screenScale);
    let ch = Math.floor(windowHeight * screenScale);
  
    createCanvas(cw, ch);
    gfxLines = createGraphics(cw, ch);
        
    gridDim.columns = Math.floor(cw / cellSize);
    gridDim.rows = Math.floor(ch / cellSize);
    //console.log(`cw ${cw} - ch ${ch} - cellSize ${cellSize} - grid => Columns: ${gridDim.columns}, Rows: ${gridDim.rows}`);

  } else {
    let dim = gridDim.columns * cellSize;
    createCanvas(dim, dim);      
    gfxLines = createGraphics(dim, dim);
  }  
}

function setup() {
  //frameRate(1);
  setupTheCanvas();
  
  setupGUI();

  colors = chroma.scale(colorPalette)
    .mode('lab')
    .correctLightness();
    
  doGenerateMaze();
}

function windowResized() {
  reloadMazeApp();
}

function draw() {
  //return;
  
  if (!isAnimate) return;

  for (let skip = 0; skip < skipAmount; skip++) {
    let updateResult = mazeAnimate.next();
    if (updateResult.done) {
      console.log('\nDONE\n');
      doShowGrid();
      isAnimateDone = true;
      break;
    }
  }

  //drawSimpleGrid('draw');
  drawGrid();
}

function drawGrid() {  
  //blendMode(BLEND);
  background(0);
  //blendMode(LIGHTEST);
  
  
      
  if(isAnimate) {
    drawAnimateGrid();
  } else {      
    drawLines();    
    drawDistanceMatrix();
  }
  
  redraw();
}

function buildColorCache() {
  // build color cache
  colorCache = [];
  for (let i = 0; i <= maxDistance; i++) {
    let ci = i / maxDistance;
    let c = colors(ci).toString();
    colorCache.push(c);
  }
}

function drawAnimateGrid() {
  for (let i = 0; i < grid.cells.length; i++) {
    let cell = grid.cells[i];

    let x1 = cell.column * cellSize;
    let y1 = cell.row * cellSize;
    
    if (isAnimate) {
      if (cell.info && cell.info.isActive) {
        stroke('#00b834');
        fill('#00b834');
        square(x1, y1, cellSize);
      } else if (cell.info && cell.info.isVisited) {
        stroke('#2e3b31');
        fill('#2e3b31');
        square(x1, y1, cellSize);
      } else if (cell.info && cell.info.isPending) {
        stroke(94, 123, 171);
        fill(94, 123, 171);
        square(x1, y1, cellSize);
      }
    }
  } // end for cells
}

function drawDistanceMatrix() {
  noStroke();
  
  if (!(distanceMatrix && distanceMatrix.length > 0)) return;
  
  buildColorCache();
      
  for (let i = 0; i < grid.cells.length; i++) {
    let cell = grid.cells[i];
    
    let sx = cell.column * cellSize;
    let sy = cell.row * cellSize;
    let sw = cellSize;
    let sh = cellSize;

    if(showMazeLines) {            
      let hasLeft = cell.left && cell.links.indexOf(cell.left) >= 0;
      let hasRight = cell.right && cell.links.indexOf(cell.right) >= 0;
      let hasTop = cell.top && cell.links.indexOf(cell.top) >= 0;
      let hasBottom = cell.bottom && cell.links.indexOf(cell.bottom) >= 0;
      
      if(!hasLeft && hasRight) {
        // open on the right
        // wall on the left...draw it a bit over
        sx += 1;
      } else if (hasLeft && !hasRight) {
        // open of the left
        // has a wall on the right...shrink it
        sw -= 1;
      } else if (!hasLeft && !hasRight) {
        // wall on the left and right
        // move over a bit and shrink for both walls
        sx += 1;
        sw -= 2;
      } else if (hasLeft && hasRight) {
        // open on either side...don't change anything
      }
      
      if(!hasTop && hasBottom) {
        // open on the bottom
        // wall on the top...draw it a bit over
        sy += 1;
      } else if (hasTop && !hasBottom) {
        // open of the top
        // has a wall on the bottom...shrink it
        sh -= 1;
      } else if (!hasTop && !hasBottom) {
        // wall on the top and bottom
        // move over a bit and shrink for both walls
        sy += 1;
        sh -= 2;
      } else if (hasTop && hasBottom) {
        // open on either side...don't change anything
      }
    }
    
    // color based on distance matrix    
    let color = colorCache[distanceMatrix[i]];      
    fill(color);
    rect(sx, sy, sw, sh);      
    
  }
}

function drawLines() {    
  if (!showMazeLines) return;
  
  if(linesNeedRefresh) {              
    refreshTheLines();        
  }    
  
  image(gfxLines, 0,0);
}

function refreshTheLines() {  
  gfxLines.background(0);  
  
  let fifthCellSize = cellSize / 3;
  let tenthCellSize = cellSize / 6;
  let halfCellSize = cellSize / 2;
    
  gfxLines.stroke(mazeColor);
  gfxLines.strokeWeight(2);
  gfxLines.fill(0);
  
  // draw every cell
  for (let i = 0; i < grid.cells.length; i++) {
    let cell = grid.cells[i];

    let x1 = cell.column * cellSize;
    let y1 = cell.row * cellSize;
    let x2 = x1 + cellSize;
    let y2 = y1 + cellSize;           

    // for each neighbor check if it is linked to the cell,
    // if it's not, draw a wall
    for (let j = 0; j < cell.neighbors.length; j++) {
      let neighborIndex = cell.neighbors[j];
      let neighborIsLinked = cell.links.indexOf(neighborIndex);
      if (neighborIsLinked >= 0) continue;

      if (cell.top === neighborIndex) {
        gfxLines.line(x1, y1, x2, y1); // top        
      } else if (cell.bottom === neighborIndex) {
        gfxLines.line(x1, y2, x2, y2); // bottom
      } else if (cell.left === neighborIndex) {
        gfxLines.line(x1, y1, x1, y2); // left
      } else if (cell.right === neighborIndex) {
        gfxLines.line(x2, y1, x2, y2); // right
      }
    } // end for neighbor walls

    // draw maze borders
    if (cell.row === 0) {
      gfxLines.line(x1, y1, x2, y1); // top        
    }
    if (cell.row === grid.rows - 1) {
      gfxLines.line(x1, y2, x2, y2); // bottom
    }
    if (cell.column === 0) {
      gfxLines.line(x1, y1, x1, y2); // left
    }
    if (cell.column === grid.columns - 1) {
      gfxLines.line(x2, y1, x2, y2); // right
    }    
  } // end for grid cells  
      
  linesNeedRefresh = false;  
}
