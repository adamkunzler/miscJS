
// TODO
// [] figure out how top of sun is at horizon for sunrise/sunset instead of middle of sun
// [] slider that spans 24 hours
// [] time in center with background for readability
// [] add moving clouds for day

// images
let imgSun;
let imgMoon;

// SIM properties
let isSim = false;
let isSimInitialized = false;
let simDate = {};

// APP properties
let sunData = {};
let isLoaded = false;

let diameter = 0;
let radius = 0;
let middle = {};

let sunSize = 0;
let showSunPath = false;
let stars = [];

// UI Controls
let sliderSimSpeed;
let checkboxSimEnabled;
let checkboxSunPath;

let pgDay;
let pgNight;

function setup() {
  createCanvas(windowWidth, windowHeight);

  loadSunData();
  
  loadUIControls();  
  
  pgDay = createGraphics(width, height / 2);
  pgNight = createGraphics(width, height);
}

function loadSunData() {
  let service = new SunDataService();
  service.getSunData(postSetup);
}

function loadUIControls() {
  sliderSimSpeed = createSlider(0, 60, 60, 5);
  sliderSimSpeed.position(25, 25);
  sliderSimSpeed.style('width', '250px');

  checkboxSimEnabled = createCheckbox('Simulate', false);
  checkboxSimEnabled.position(25, 50);
  checkboxSimEnabled.changed(() => {
    isSim = checkboxSimEnabled.checked();
    isSimInitialized = false;
  });
  
  checkboxSunPath = createCheckbox('Show Sun Path', false);
  checkboxSunPath.position(25, 75);
  checkboxSunPath.changed(() => {
    showSunPath = checkboxSunPath.checked();
  });
}

function postSetup(result) {
  sunData = result;
  
  // calculate scene values  
  diameter = min(width, height) * .9;
  radius = diameter / 2;
  sunSize = radius / 4;

  middle = {
    x: width / 2,
    y: height / 2
  };
  
  loadStars(100);

  // load images
  imgSun = loadImage('assets/sun_sprite.png');
  imgMoon = loadImage('assets/moon_sprite.png');
  
  // must be called last...once this is true...draw() will run.
  isLoaded = true;
}

function getNow() {
  let now = new Date();

  if (isSim) {
    if (!isSimInitialized) {
      simDate = {
        second: sunData.today.sunrise.getSeconds(),
        minute: sunData.today.sunrise.getMinutes(),
        hour: sunData.today.sunrise.getHours(),
        day: sunData.today.sunrise.getDate(),
        month: sunData.today.sunrise.getMonth(),
        year: sunData.today.sunrise.getFullYear(),
      };

      isSimInitialized = true;
    }

    now = new Date(simDate.year, simDate.month, simDate.day, simDate.hour, simDate.minute, simDate.second);
  }

  return now;
}

function doSim() {    
  simDate.second += sliderSimSpeed.value();
  if (simDate.second >= 60) {
    simDate.minute += 1;
    simDate.second = 0;
  }

  if (simDate.minute >= 60) {
    simDate.hour += 1;
    simDate.minute = 0;
  }
  
  if (simDate.hour >= 24) {
    simDate.day += 1;
    simDate.hour = 0;

    // TODO finish sim for day, month, year
  }
}

function getSunPosition(time) {
  let sunrise1 = Date.parse(sunData.today.sunrise);
  let sunset1 = Date.parse(sunData.today.sunset);
  let sunrise2 = Date.parse(sunData.tomorrow.sunrise);

  let now = getNow();

  // TODO - right now, just resets the sim to the current day
  //        ideally, we'd fetch the next day's data and keep
  //        it going.
  if (now >= sunrise2) {
    isSimInitialized = false;
    now = getNow();
  }

  let nowVal = Date.parse(now);

  //console.log(`sr1: ${sunrise1}, ss1: ${sunset1}, sr2: ${sunrise2}, now: ${nowVal}`);

  let isSunUp = (now >= sunrise1 && now <= sunset1);
  let value = isSunUp ?
    map(nowVal, sunrise1, sunset1, 0, PI) :
    map(nowVal, sunset1, sunrise2, PI, TWO_PI);

  // calculate actual position
  let angle = TWO_PI - value;
  let position = {
    x: radius * cos(angle) + middle.x,
    y: radius * sin(angle) + middle.y,
    isSunUp: isSunUp
  };

  return position;
}

function loadStars(numStars) {
  for (let i = 0; i < numStars; i++) {
    var star = {
      x: random(width),
      y: random(height / 2, height)
    };
    stars.push(star);
  }
}

function draw() {
  //background(220);

  if (!isLoaded) return;
    
  let position = getSunPosition(sunData.sunrise);  
  drawNight(position);  
  drawDay(position);
  
    
  //
  // draw sun path
  //
  if(showSunPath) {
        
    stroke(252, 248, 3, 100);
    strokeWeight(1);
    noFill();
    circle(middle.x, middle.y, diameter);
    
    stroke(255, 255, 255, 50);
    strokeWeight(2);
    noFill();
    circle(middle.x, middle.y, diameter);
  }
  
  //
  // draw time
  //
  drawTime();

  //
  // update simulation
  //
  doSim();
}


function drawDay(position) {
  let middle = height / 2;
  
  // draw sky
  pgDay.noStroke();
  pgDay.fill(135, 206, 250);
  pgDay.rect(0, 0, width, middle);
  
  // draw sun  
  drawSun(position);

  image(pgDay, 0, 0);
}

function drawNight(position) {
  let middle = height / 2;
  
  // draw negative sky
  pgNight.noStroke();
  pgNight.fill(0);
  pgNight.rect(0, middle, width, height);
    
  // draw stars
  pgNight.noStroke();  
  pgNight.fill(255);
  for (let i = 0; i < stars.length; i++) {        
    pgNight.circle(stars[i].x, stars[i].y, 2);
  }  
    
  // draw moon  
  drawMoon(position);  
  
  image(pgNight, 0, 0);
}

function drawTime() {
  let labelSize = 32;
  let label = getNow().toLocaleString();

  rectMode(CENTER);
  textAlign(CENTER);
  textSize(labelSize);
  fill(0);
  stroke(0);
  text(label, middle.x, middle.y - labelSize, label.length * labelSize, labelSize);
  rectMode(CORNER);
}


function drawMoon(position) {
  pgNight.imageMode(CENTER);  
  pgNight.image(imgMoon, position.x, position.y, sunSize * 2.5, sunSize * 2.5);      
}

function drawSun(position) {
  pgDay.imageMode(CENTER);      
  pgDay.image(imgSun, position.x, position.y, sunSize * 2, sunSize * 2);    
}

function drawSky() {
  
}