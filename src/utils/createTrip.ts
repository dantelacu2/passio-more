import { Trip, trips } from "../static_data/trips";
import { Shape, shapes } from "../static_data/shapes";
import { BusStop, stops } from "../static_data/stops";
import { findClosestStopIdToCoordinates, findIndexClosestCoordinateToShapes, kClosestStops, StopTimeUpdate } from "./parsePassio";
import { TripUpdate } from "./parsePassio";

interface FullTrip {
    tripUpdate: TripUpdate;
    startStop: string;
    endStop: string;
    shapes?: [number, number][]
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

const filterTripsOnSameRoute = (allTripUpdates: FullTrip[]): FullTrip[] => {
    const newTripUpdates: FullTrip[] = [];
    const routeDict: Dictionary<number> = {}
    allTripUpdates.forEach((tripUpdate: FullTrip) => {
        const route_id = trips.find((trip: Trip) => trip.trip_id.toString() === tripUpdate.tripUpdate.trip_update.trip.trip_id)?.route_id;
        if (route_id && !(route_id in routeDict)) {
            newTripUpdates.push(tripUpdate);
            routeDict[route_id] = route_id;
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

const trimShapesByStartAndEndStopId = (shapes: Shape[], startStopId: string, endStopId: string): Shape[] => {
    const startStop: BusStop | undefined = stops.find(stop => stop.stop_id === startStopId);
    const endStop: BusStop | undefined = stops.find(stop => stop.stop_id === endStopId);

    const startStopCoords: [number, number] = [startStop ? startStop.stop_lon: 0, startStop ? startStop.stop_lat: 0];
    const endStopCoords: [number, number] = [endStop ? endStop.stop_lon: 0, endStop ? endStop.stop_lat: 0];

    const startIndex = findIndexClosestCoordinateToShapes(startStopCoords, shapes);
    const endIndex = findIndexClosestCoordinateToShapes(endStopCoords, shapes);
    
    if (endIndex >= startIndex) {
        return shapes.slice(startIndex, endIndex);
    }
    // Route wraps around sequence
    return shapes.slice(startIndex, shapes.length - 1).concat(shapes.slice(0, endIndex));
}

export const addShapesToTrips = (fullTrips: FullTrip[]): FullTrip[] => {
    const updatedFullTrips: FullTrip[] = [];
    fullTrips.forEach((fullTrip: FullTrip) => {
        const tripId = fullTrip.tripUpdate.trip_update.trip.trip_id;
        const shapeId = trips.find((trip) => trip.trip_id.toString() === tripId.toString())?.shape_id;
        const allShapesForTrip = shapes.filter((shape) => shape.shape_id === shapeId);
        const shapesForRoute = trimShapesByStartAndEndStopId(allShapesForTrip, fullTrip.startStop, fullTrip.endStop);
        updatedFullTrips.push({ ...fullTrip, shapes: mapShapesToListOfCoordinates(shapesForRoute) });
    });
    return updatedFullTrips;
}

export const findRoutes = (destinationQuery: string, startCoords: [number, number], tripUpdates: TripUpdate[]): FullTrip[] => {
    const coordsOfDestination = lookupQuery(destinationQuery);
    const destinationStop = findClosestStopIdToCoordinates(coordsOfDestination);
    const allTripsWithDestinationStop = findActiveTripsThatHaveStopId(destinationStop, tripUpdates);
    const potentialStarts = kClosestStops(startCoords, 8);

    const allTripsWithStartAndStop = findAllPotentialTrips(potentialStarts, destinationStop, allTripsWithDestinationStop);
    const allTripsWithStartAndStopFilteredForDuplicates = filterTripsOnSameRoute(allTripsWithStartAndStop);

    return addShapesToTrips(allTripsWithStartAndStopFilteredForDuplicates);
}
