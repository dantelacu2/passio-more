import { trips } from "../static_data/trips";
import { Shape, shapes } from "../static_data/shapes";
import { BusStop, stops } from "../static_data/stops";
import { findClosestStopIdToCoordinates, findIndexClosestCoordinateToShapes, kClosestStops, StopTimeUpdate } from "./parsePassio";
import { TripUpdate } from "./parsePassio";

interface FullTrip {
    tripUpdate: TripUpdate;
    startStop: string;
    endStop: string;
}

/** Lookup location using the Mapbox API */
const lookupQuery = (query: string): [number, number] => {
    // SEC Coordinates hardcoded
    return [-71.126115, 42.363483];
}

/** This could be adapted to allow for mulitiple end points */
const findActiveTripsThatHaveStopId = (stopId: string, tripUpdates: TripUpdate[]): TripUpdate[] => {
    return tripUpdates.filter(trip => trip.trip_update.stop_time_update.some(time_update => time_update.stop_id === stopId));
}

const findAllPotentialTrips = (potentialStarts: BusStop[], endStop: string, tripUpdates: TripUpdate[]): FullTrip[] => {
    const newTripUpdates: FullTrip[] = [];
    potentialStarts.forEach((potentialStart: BusStop) => {
        findActiveTripsThatHaveStopId(potentialStart.stop_id, tripUpdates).forEach((matchingActiveTrip) => {
            newTripUpdates.push({ startStop: potentialStart.stop_id, endStop, tripUpdate: matchingActiveTrip });
        })
    });
    return newTripUpdates;
}

interface Dictionary<T> {
    [Key: string]: T;
}

const filterTripsOnSameRoute = (trips: FullTrip[]): FullTrip[] => {
    const newTripUpdates: FullTrip[] = [];
    const endStopDict: Dictionary<string> = {}
    trips.forEach((trip) => {
        if (!(trip.endStop in endStopDict)) {
            newTripUpdates.push(trip);
            endStopDict[trip.endStop] = trip.endStop;
        }
    });
    return newTripUpdates;
}

const mapShapesToListOfCoordinates = (shapes: Shape[]): [number, number][] => {
    const coords: [number, number][] = [];
    shapes.forEach((shape) => {
       coords.push([shape.shape_pt_lon, shape.shape_pt_lat]);
    });
    return coords;
}

const trimShapesByStartAndEndStop = (shapes: Shape[], startStopId: string, endStopId: string): Shape[] => {
    const startStop: BusStop | undefined = stops.find(stop => stop.stop_id === startStopId);
    const endStop: BusStop | undefined = stops.find(stop => stop.stop_id === endStopId);

    const startStopCoords: [number, number] = [startStop ? startStop.stop_lon: 0, startStop ? startStop.stop_lat: 0];
    const endStopCoords: [number, number] = [endStop ? endStop.stop_lon: 0, endStop ? endStop.stop_lat: 0];

    const startIndex = findIndexClosestCoordinateToShapes(startStopCoords, shapes);
    const endIndex = findIndexClosestCoordinateToShapes(endStopCoords, shapes);
    return shapes.slice(startIndex, shapes.length - 1);
}


export const findRoutes = (query: string, startCoords: [number, number], tripUpdates: TripUpdate[]) => {
    const coordsOfDestination = lookupQuery(query);
    const destinationStop = findClosestStopIdToCoordinates(coordsOfDestination);
    const allTripsWithDestinationStop = findActiveTripsThatHaveStopId(destinationStop, tripUpdates);
    const potentialStarts = kClosestStops(startCoords, 8);
    console.log(potentialStarts.map((start) => start.stop_id))
    const allTripsWithStartAndStop = findAllPotentialTrips(potentialStarts, destinationStop, allTripsWithDestinationStop);
    const allTripsWithStartAndStopFilteredForDuplicates = filterTripsOnSameRoute(allTripsWithStartAndStop);
    const tripId: string = allTripsWithStartAndStopFilteredForDuplicates[0].tripUpdate.trip_update.trip.trip_id;
    const shapeId = trips.find((trip) => trip.trip_id.toString() === tripId.toString())?.shape_id;
    const allShapesForTrip = shapes.filter((shape) => shape.shape_id === shapeId);
    const shapesForRoute = trimShapesByStartAndEndStop(allShapesForTrip, allTripsWithStartAndStopFilteredForDuplicates[0].startStop, allTripsWithStartAndStopFilteredForDuplicates[0].endStop);
    return mapShapesToListOfCoordinates(shapesForRoute);
}
