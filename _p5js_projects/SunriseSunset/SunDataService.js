// https://sunrise-sunset.org/api

/*

{
  "results":
  {
    "sunrise":"7:27:02 AM",
    "sunset":"5:05:55 PM",
    "solar_noon":"12:16:28 PM",
    "day_length":"9:38:53",
    "civil_twilight_begin":"6:58:14 AM",
    "civil_twilight_end":"5:34:43 PM",
    "nautical_twilight_begin":"6:25:47 AM",
    "nautical_twilight_end":"6:07:10 PM",
    "astronomical_twilight_begin":"5:54:14 AM",
    "astronomical_twilight_end":"6:38:43 PM"
  },
   "status":"OK"
}

*/

class SunDataService {
  constructor() {

  }

  //
  // build uri for api call
  //
  buildUri(targetDate, latitude, longitude) {
    // do args? use these!  
    if (!latitude) latitude = 40.9947809332474;
    if (!longitude) longitude = -91.9367648576142;
    if (!targetDate) {
      let today = new Date();
      targetDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    }

    var uri = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${targetDate}&formatted=0`;
    return uri;
  }

  //
  // call api to get sun data for today and tomorrow
  //
  getSunData(callback, targeDate, latitude, longitude) {
    let sunData = {};

    let self = this;
    
    // API request to get data for TODAY
    let uriToday = self.buildUri(targeDate, latitude, longitude);
    httpGet(uriToday, 'json', false, function(response) {
      sunData = {
        today: {
          sunrise: new Date(response.results.sunrise),
          sunset: new Date(response.results.sunset),
          solar_noon: new Date(response.results.solar_noon),
          day_length: response.results.day_length
        }
      };

      // calculate tomorrow
      let tomorrow = new Date(
        sunData.today.sunrise.getFullYear(),
        sunData.today.sunrise.getMonth(),
        sunData.today.sunrise.getDate()
      );
      tomorrow.setDate(tomorrow.getDate() + 1);

      let tomorrowDate = `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
      let uriTomorrow = self.buildUri(tomorrowDate, latitude, longitude);

      // API request to get data for TOMORROW
      httpGet(uriTomorrow, 'json', false, function(response2) {
        sunData.tomorrow = {
          sunrise: new Date(response2.results.sunrise),
          sunset: new Date(response2.results.sunset),
          solar_noon: new Date(response2.results.solar_noon),
          day_length: response2.results.day_length
        };

        //console.log(sunData);

        callback(sunData);
      });
    });
  }
}