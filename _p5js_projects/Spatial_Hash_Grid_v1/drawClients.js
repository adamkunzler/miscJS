/*

[] fix the whole client dimensions thing
  -- dimensions for the client determine how many cells that client takes up
  -- what is currently implemented is the dimensions represent the "range" that the client is looking for for neighbors
  -- need to pass in the 'range' to the find nearby function and use that...not the client dimension
  -- need to decouple client dimensions from the rendering so
  -- maybe update the client grid rendering to highlight the cells the client 'touches' not just the point that's their center


*/

function drawClients() {
  if (drawSpatialBorder) drawClientSpatialPositions(specialClientId);
  if (drawGridPositions) drawClientsGridPosition();
  drawClientsScreenPosition();
}

function drawClientSpatialPositions(index) {
  noFill();
  strokeWeight(2);
  stroke('#0ca80c');
  let x = clients[index].indices[0].xIndex * gridDims * scale;
  let x2 = clients[index].indices[1].xIndex * gridDims * scale;
  let y = clients[index].indices[0].yIndex * gridDims * scale;
  let y2 = clients[index].indices[1].yIndex * gridDims * scale;
  
  line(x, y, x2, y); //top
  line(x, y2, x2, y2); //bottom
  line(x, y, x, y2); //left
  line(x2, y, x2, y2); //right
}

function drawGrid() {
  noFill();
  stroke(170);
  strokeWeight(1);
  
  let edge = gridBounds * scale;
  for (let i = 0; i < gridBounds; i += gridDims) {
    const sy = i * scale;
    const sx = i * scale;
    line(sx, 0, sx, edge);
    line(0, sy, edge, sy);
  }
}

function drawClientsGridPosition() {
  noStroke();
  for (let i = 0; i < clients.length; i++) {
    let x = clients[i].position.x;
    let y = clients[i].position.y;

    let sx = x * gridDims * scale;
    let sy = y * gridDims * scale;
    let radius = gridDims * scale;

    if (nearbyKeys.indexOf(clients[i].key) >= 0) {
      fill('#a7c2a9');
    } else {
      fill('#1e46bd');
    }

    rect(sx, sy, radius, radius);
  }
}

function drawClientsScreenPosition() {
  noStroke();
  for (let i = 0; i < clients.length; i++) {
    let x = clients[i].screenPosition.x;
    let y = clients[i].screenPosition.y;

    let sx = x * scale;
    let sy = y * scale;
    let radius = (gridDims * scale) * .75;

    if (i === 0) {
      fill('#de4c09');
    } else {
      if (nearbyKeys.indexOf(clients[i].key) >= 0) {
        fill('#a7c2a9');
      } else {
        fill('#f5b342');
      }

    }
    circle(sx, sy, radius);
  }
}