const request = require('request-promise-native');

const fetchMyIP = function() {
  // use request to fetch IP address from JSON API
  return request('https://api.ipify.org/?format=json');
};

const fetchCoordsByIP = function(body) {
  // used diferent service to get coordinates because vigilante's certificate has expired.
  const data = JSON.parse(body);
  return request('http://ip-api.com/json/' + data.ip);
};

const fetchISSFlyOverTimes = function(body) {
  const data = JSON.parse(body);
  const lat = data.lat;
  const lon = data.lon;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`)
};

const nextISSTimesForMyLocation = function() {
  fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then( body => {
    const response = JSON.parse(body).response;
    for (let pair of response) {
      let date = new Date(pair.risetime * 1000).toString();
      console.log(`Next pass at ${date} for ${pair.duration} seconds!`);
    }
  })
  .catch( error => console.log("It didn't work: ", error.message));
};

module.exports = { nextISSTimesForMyLocation }