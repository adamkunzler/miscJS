let btnGenerate;
let btnAnimate;
let btnDistancsex;
let btnMaze;
let ddlMazes;
let btnToggleLines;
let chkFollowMouse;
let ddlCellSize;

function setupGUI() {
  ddlMazes = select('#ddlMazes');
  
  btnGenerate = select('#btnGenerate');
  btnGenerate.mousePressed(doGenerateMaze);
  
  btnAnimate = select('#btnAnimate');
  btnAnimate.mousePressed(doAnimateMaze);
  
  btnMaze = select('#btnMaze');
  btnMaze.mousePressed(doShowGrid);
  
  btnDistanceMatrix = select('#btnDistanceMatrix');
  btnDistanceMatrix.mousePressed(buildDistanceMatrix);
  
  btnToggleLines = select('#btnToggleLines');
  btnToggleLines.mousePressed(doToggleLines);
  
  chkFollowMouse = select('#chkFollowMouse');
  chkFollowMouse.changed(doToggleFollowMouse);
  
  ddlCellSize = select('#ddlCellSize');
  ddlCellSize.changed(doCellSizeChanged);
}

function mouseClicked() {  
  if(mouseX > width || mouseY > height || mouseX < 0 || mouseY < 0) return;
  if(!isAnimateDone) return;
    
  let col = Math.floor(mouseX / cellSize);
  let row = Math.floor(mouseY / cellSize);
      
  buildDistanceMatrix({ column: col, row: row });
}

function mouseMoved() {
  if(!isMouseMoveEnabled) return;
  
  mouseClicked();
}

function doCellSizeChanged() {
  reloadMazeApp();
}

function doToggleLines() {
  showMazeLines = !showMazeLines;
  //drawSimpleGrid('doToggleLines');
  drawGrid();
}

function doToggleFollowMouse() {
  isMouseMoveEnabled = chkFollowMouse.checked();
}

function doShowGrid() {  
  isAnimate = false;  
  showDistance = false;
  distanceMatrix = undefined;
  maxDistance = undefined;
  //drawSimpleGrid('doShowGrid');
  drawGrid();
}

function doAnimateMaze() {
  gfxLines.background(0);
  linesNeedRefresh = true;
  
  isAnimate = true;
  isAnimateDone = false;  
  doGenerateMaze(true);  
}

function doGenerateMaze(withAnimation = false) {            
  console.log(`Maze ${gridDim.columns} X ${gridDim.rows} | total cells: ${gridDim.columns * gridDim.rows}`);
  
  gfxLines.background(0);
  linesNeedRefresh = true;
  
  isAnimate = withAnimation;
  isAnimateDone = true;
  // reset everything
  //showMazeLines = true;
  distanceMatrix = [];
  maxDistance = -1;
  grid = getGrid(gridDim.columns, gridDim.rows);
    
  let theMaze = getMazeAlgorithm();
  
  if(isAnimate) {
    mazeAnimate = theMaze();
    loop();
  } else {    
    generateMaze(theMaze);        
    //drawSimpleGrid('doGenerateMaze');    
    drawGrid();
    noLoop();
  }
}
