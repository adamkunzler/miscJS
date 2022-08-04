var started = false;



async function setup() {
  createCanvas(400, 400);
    
  await loadAllData();
  console.log('done');

  started = true;
}

function draw() {
  if (!started) return;

  background(50, 155, 50);

}

async function loadAllData() {
  
  await loadAstronomyData();
  await loadWeatherData();    
}

async function loadAstronomyData() {
  let p = new Promise(function(resolve, reject) {
    
    let uri = 'https://api.weatherapi.com/v1/astronomy.json?key=6d4be7d094e84288baa215643210304&q=52556&dt=2021-04-03';
    httpGet(uri, 'json', false, function(response) {
      console.log('Astronomy Data');
      console.log(response);
      
      resolve();
    });
    
  });

  return p;
}

async function loadWeatherData() {
  let p = new Promise(function(resolve, reject) {
    
    let uri = 'https://api.weatherapi.com/v1/current.json?key=6d4be7d094e84288baa215643210304&q=52556&aqi=no'
    httpGet(uri, 'json', false, function(response) {
      console.log('Weather Data');
      console.log(response);
      
      resolve();
    });
    
  });
  
  return p;
}