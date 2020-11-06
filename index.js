const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  for (let pair of passTimes) {
    let date = new Date(pair.risetime * 1000).toString();
    console.log(`Next pass at ${date} for ${pair.duration} seconds!`);
  }
});

// OLD CODE:
// run main fetch function here
// const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   // console.log("type of output: ", typeof ip);
//   console.log('It worked! Returned IP:' , ip);
// });

// my IP 99.229.217.54

// fetchCoordsByIP("99.229.217.54", (error, data) => {
//   console.log(error);
//   console.log("Data: ", data);
// });

// my coords { latitude: 43.6547, longitude: -79.3623 }
// fetchISSFlyOverTimes({ latitude: 43.6547, longitude: -79.3623 }, (error, data) => {
//   console.log(error);
//   console.log("Data: ", data);
// });
