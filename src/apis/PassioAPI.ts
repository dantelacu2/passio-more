const tripUpdates = require('../static_data/tripUpdates.json');

export function getTripUpdates() {
    try {
    //   let response = await fetch('https://passio3.com/harvard/passioTransit/gtfs/realtime/tripUpdates.json');
      let response = tripUpdates;
    //   let responseJson = await response.json();
      let responseJson = response;
      console.log("Passio API Called");
      return responseJson.entity;
     } catch(error) {
      console.error(error);
    }
}

