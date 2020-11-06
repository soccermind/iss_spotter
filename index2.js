const { nextISSTimesForMyLocation } = require('./iss_promised');

// fetchMyIP()
//   .then(fetchCoordsByIP)
//   .then(fetchISSFlyOverTimes)
//   .then( body => {
//     const response = JSON.parse(body).response;
//     for (let pair of response) {
//       let date = new Date(pair.risetime * 1000).toString();
//       console.log(`Next pass at ${date} for ${pair.duration} seconds!`);
//     }
//   });

nextISSTimesForMyLocation();