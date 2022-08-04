/*

[] move all

*/


let hashGrid;
let clients = [];
//let nearbys = [];
let nearbyKeys = [];

let specialClientId = 0;
let numClients = 10;

let gridBounds = 100; // width/height of the grid in pixels
let gridDims = 2; // size of grid cells
let clientDim = 10; // num cells around client

let scale = 10;
let defaultSpeed = 0.2;

let drawGridPositions = false;
let drawSpatialBorder = true;
let updateSpecialClientOnly = false;
let drawGridLines = false;

let msg1 = '';
let msg2 = '';
let msg3 = '';

function setup() {
  const cdim = gridBounds * scale;
  createCanvas(cdim, cdim);

  setupHashGrid();
}

function draw() {
  //doKeyboard();

  update();
  render();

  fill('#ffffff');
  textSize(24);
  text(frameRate().toFixed(0), 15, 25);  
  text(msg1, 15, 55);
  text(msg2, 15, 85);
  text(msg3, 15, 115);
  //noLoop();
}

function update() {
  let client = clients[specialClientId];
  let nearbys = hashGrid.FindNearby(client);
  nearbyKeys = nearbys.map(x => x.key);

  updateClients();
}

function render() {
  background(0);

  if (drawGridLines) drawGrid();
  drawClients();
}

function setupHashGrid() {

  const bounds = {
    left: 0,
    top: 0,
    right: gridBounds,
    bottom: gridBounds,
  };

  const dimensions = {
    width: gridDims,
    height: gridDims
  };

  hashGrid = new SpatialHashGrid(bounds, dimensions);

  for (let i = 0; i < numClients; i++) {
    const client = hashGrid.NewClient({
      x: Math.floor(Math.random() * gridBounds),
      y: Math.floor(Math.random() * gridBounds),
    }, {
      width: clientDim,
      height: clientDim
    });

    // add some "special" properties to client  
    
    let speedX = Math.random() * 0.15 + defaultSpeed;
    let speedY = Math.random() * 0.15 + defaultSpeed;
    client.xDir = speedX * (Math.floor(Math.random() * 2) === 0 ? -1 : 1);
    client.yDir = speedY * (Math.floor(Math.random() * 2) === 0 ? -1 : 1);
        
    clients.push(client);
  }

  //console.log('clients', clients);

}

function updateClients() {
  if(updateSpecialClientOnly) {
    bounceClient(specialClientId);
    return;
  }
  
  for(let i = 0; i < clients.length; i++) {
    bounceClient(i);
  }
}

function bounceClient(index) {
  const client = clients[index];
  let x = client.screenPosition.x + client.xDir;
  let y = client.screenPosition.y + client.yDir;
  let xDir = client.xDir;
  let yDir = client.yDir;

  let dim = gridDims * 0.75;    
  let halfDim = dim / 2;
  
  let right = gridBounds - halfDim;
  let left = halfDim;
  let top = halfDim;
  let bottom = gridBounds - halfDim;
      
  if (x > right) {
    x = right;
    xDir *= -1;
  } else if (x < left) {
    x = left;
    xDir *= -1;
  }

  if (y > bottom) {
    y = bottom;
    yDir *= -1;
  } else if (y < top) {
    y = top;
    yDir *= -1;
  }

  let newClient = hashGrid.NewClient({
    x: x,
    y: y
  }, {
    width: clientDim,
    height: clientDim
  });

  newClient.xDir = xDir;
  newClient.yDir = yDir;

  clients[index] = newClient;
}