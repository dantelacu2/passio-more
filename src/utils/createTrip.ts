import { BusStop } from "src/static_data/stops";
import { findClosestStopIdToCoordinates, kClosestStops, StopTimeUpdate } from "./parsePassio";
import { TripUpdate } from "./parsePassio";

/** Lookup location using the Mapbox API */
const lookupQuery = (query: string): [number, number] => {
    // SEC Coordinates hardcoded
    return [-71.126115, 42.363483];
}

/** This could be adapted to allow for mulitiple end points */
const findActiveTripsThatHaveStopId = (stopId: string, tripUpdates: TripUpdate[]): TripUpdate[] => {
    return tripUpdates.filter(trip => trip.tripUpdate.stop_time_update.some(time_update => time_update.stop_id === stopId));
}

const findAllPotentialTrips = (potentialStarts: BusStop[], tripUpdates: TripUpdate[]) => {
    const newTripUpdates: TripUpdate[] = [];
    potentialStarts.forEach((potentialStart) => {
        newTripUpdates.push(...findActiveTripsThatHaveStopId(potentialStart, tripUpdates));
    })
}

export const findRoutes = (query: string, startCoords: [number, number], tripUpdates: TripUpdate[]) => {
    const coordsOfDestination = lookupQuery(query);
    const destinationStop = findClosestStopIdToCoordinates(coordsOfDestination);
    console.log(destinationStop, tripUpdates);
    const allTripsWithDestinationStop = findActiveTripsThatHaveStopId(destinationStop, tripUpdates);
    const potentialStarts = kClosestStops(startCoords, 3);
    const allTripsWithStartAndStop = findAllPotentialTrips(potentialStarts, allTripsWithDestinationStop)
    console.log(allTripsWithStartAndStop);
}
