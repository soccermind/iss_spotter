// contain most of the logic for fetching the data from each API endpoint.
const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    // error for invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP.  Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // all good from here.
    const data = JSON.parse(body);
    callback(null, data.ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  // used diferent service to get coordinates because vigilante's certificate has expired.
  request('http://ip-api.com/json/' + ip, (error, response, body) => {
    // error for invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates by IP.  Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const fullData = JSON.parse(body);
    // if no statusCode error but body comes with a status of 'fail'
    if (fullData.status === 'fail') {
      const msg = `Query failed when fetching Coordinates for IP ${fullData.query}. Message: ${fullData.message}.`;
      callback(msg, null);
      return;
    }
    // all good from here.
    const data = { "latitude": fullData.lat, "longitude": fullData.lon };
    callback(null, data);
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  const lat = coords.latitude;
  const lon = coords.longitude;
  request(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`, (error, response, body) => {
    // error for invalid domain, user is offline, etc.
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS fly-over times.  Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    // all good from here.
    const data = JSON.parse(body);
    callback(null, data.response);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    // callback(null, ip);
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
        return;
      }
      // callback(null, coords);
      fetchISSFlyOverTimes(coords , (error, data) => {
        if (error) {
          callback(error, null);
          return;
        }
        callback(null, data);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };