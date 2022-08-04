//https://www.youtube.com/watch?v=sx4IIQL0x7c

const clamp = (num, min = 0.0, max = 1.0) => Math.min(Math.max(num, min), max);

class SpatialHashGrid {
  constructor(bounds, dimensions) {
    // min and max of the area grid will be operating on    
    this._bounds = {
      left: bounds.left,
      top: bounds.top,
      right: bounds.right,
      bottom: bounds.bottom,
    };

    // how many cells along each dimensional axis
    // 100 units wide, 5 cells, each cell 20 units
    this._dimensions = {
      width: dimensions.width,
      height: dimensions.height
    };

    this._cells = new Map();
  }

  //
  // position => x,y of client
  // dimensions = w,h of client
  //
  NewClient(position, dimensions) {
    const gridPosition = this._GetCellIndex({
      x: position.x,
      y: position.y
    });
    
    const client = {
      screenPosition: {
        x: position.x,
        y: position.y
      },
      position: {
        x: gridPosition.xIndex,
        y: gridPosition.yIndex,
      },
      dimensions: {
        width: dimensions.width,
        height: dimensions.height,
      },
      indices: null,
      key: this._Key(gridPosition.xIndex, gridPosition.yIndex)
    };

    this._Insert(client);

    //console.log('client.key', client.key);
    
    return client;
  }

  //
  // inserts a client 
  //
  _Insert(client) {
    const x = client.screenPosition.x;
    const y = client.screenPosition.y;
    const w = client.dimensions.width;
    const h = client.dimensions.height;

    // determine the min/max range of the cells (GetCellIndex...index from position)       
    const mins = this._GetCellIndex({
      x: x - ((w / 2) * this._dimensions.width),
      y: y - ((h / 2) * this._dimensions.height)
    });    
    const maxes = this._GetCellIndex({
      x: x + ((w / 2) * this._dimensions.width),
      y: y + ((h / 2) * this._dimensions.height)
    });

    client.indices = [mins, maxes];
    //console.log('mins', mins);
    //console.log('maxes', maxes);
    for (let x = mins.xIndex, xn = maxes.xIndex; x <= xn; x++) {
      for (let y = mins.yIndex, yn = maxes.yIndex; y <= yn; y++) {
        const k = this._Key(x, y);
        if (!(k in this._cells)) {
//          console.log('new cell set for ', client.key, k);
          this._cells[k] = new Set();
        }
  //      console.log('adding client to ', client.key, k);
        this._cells[k].add(client);
      }
    }
  }

  _Key(x, y) {
    return x + '.' + y;
  }

  _GetCellIndex(position) {
    const x = clamp(
      (position.x - this._bounds.left) / (this._bounds.right - this._bounds.left)
    );
    const y = clamp(
      (position.y - this._bounds.top) / (this._bounds.bottom - this._bounds.top)
    );
    
    let w = this._bounds.right - this._bounds.left;
    let h = this._bounds.bottom - this._bounds.top;
    const xIndex = Math.floor(x * (w / this._dimensions.width));
    const yIndex = Math.floor(y * (h / this._dimensions.height));

    //console.log('xIndex', xIndex);
    //console.log('yIndex', yIndex);
    
    return {
      xIndex: xIndex,
      yIndex: yIndex
    };
  }

  FindNearby(client) {
    const x = client.screenPosition.x;
    const y = client.screenPosition.y;
    const w = client.dimensions.width;
    const h = client.dimensions.height;

    // determine the min/max range of the cells (GetCellIndex...index from position)
    const mins = this._GetCellIndex({
      x: x - ((w / 2) * this._dimensions.width),
      y: y - ((h / 2) * this._dimensions.height)
    });    
    const maxes = this._GetCellIndex({
      x: x + ((w / 2) * this._dimensions.width),
      y: y + ((h / 2) * this._dimensions.height)
    });

    //console.log('mins', mins);
    //console.log('maxes', maxes);
    
    const clients = new Set();

    for (let x = mins.xIndex, xn = maxes.xIndex; x <= xn; x++) {
      for (let y = mins.yIndex, yn = maxes.yIndex; y <= yn; y++) {
        
        const k = this._Key(x, y);        
        if (!(k in this._cells)) continue;
            
        for (let v of this._cells[client.key]) {
          if(v.key === client.key) continue; // don't count yourself as nearby
          
          clients.add(v);
        }        
      }
    }

    return Array.from(clients);
  }

  UpdateClient(client) {
    this.RemoveClient(client);
    this._Insert(client);
  }

  RemoveClient(client) {
    const [mins, maxes] = client.indices;

    for (let x = mins[0], xn = maxes[0]; x <= xn; x++) {
      for (let y = mins[1], yn = maxes[1]; y <= yn; y++) {
        const k = this._Key(x, y);
        this._cells[k].delete(client);
      }
    }
  }
}