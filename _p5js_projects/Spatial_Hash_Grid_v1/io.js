function doKeyboard() {
  const client = clients[specialClientId];

  let x = client.screenPosition.x;
  let y = client.screenPosition.y;
  let speed = 0.5;

  if (keyIsDown(UP_ARROW)) {
    y -= speed;
  }

  if (keyIsDown(DOWN_ARROW)) {
    y += speed;
  }

  if (keyIsDown(LEFT_ARROW)) {
    x -= speed;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    x += speed;
  }

  if (x !== client.screenPosition.x || y !== client.screenPosition.y) {
    let newClient = hashGrid.NewClient({
      x: x,
      y: y
    }, {
      width: clientDim,
      height: clientDim
    });

    clients[specialClientId] = newClient;
  }

}