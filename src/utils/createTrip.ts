import { Trip, trips } from "../static_data/trips";
import { Shape, shapes } from "../static_data/shapes";
import { BusStop, stops } from "../static_data/stops";
import { findClosestStopIdToCoordinates, findIndexClosestCoordinateToShapes, kClosestStops, StopTimeUpdate } from "./parsePassio";
import { TripUpdate } from "./parsePassio";
import { WalkingDirections } from "../types/mapbox";
import { getWalkingDirections } from "../apis/MapboxDirectionsAPI";

interface FullTrip {
    tripUpdate: TripUpdate;
    startStop: string;
    endStop: string;
    shapes?: [number, number][]
    directionsToStartStop?: WalkingDirections;
    directionsFromEndStop?: WalkingDirections;
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

const getCoordinatesFromBusStopId = (stopId: string): [number, number] => {
    const stop: BusStop | undefined = stops.find(stop => stop.stop_id === stopId);
    return [stop ? stop.stop_lon: 0, stop ? stop.stop_lat: 0]
}

const trimShapesByStartAndEndStopId = (shapes: Shape[], startStopId: string, endStopId: string): Shape[] => {
    const startStopCoords = getCoordinatesFromBusStopId(startStopId);
    const endStopCoords = getCoordinatesFromBusStopId(endStopId);

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

const attachWalkingDirectionsToTrips = async (trips: FullTrip[], userCoords: [number, number]): Promise<FullTrip[]> => {
    return Promise.all(trips.map(async (trip) => {
        const busStopCoords = getCoordinatesFromBusStopId(trip.startStop);
        const walkingDirections = await getWalkingDirections(userCoords, busStopCoords);
        return { ...trip, directionsToStartStop: walkingDirections }
    }));
}

export const findRoutes = async (destinationQuery: string, startCoords: [number, number], tripUpdates: TripUpdate[]): Promise<FullTrip[]> => {
    const coordsOfDestination = lookupQuery(destinationQuery);
    const destinationStop = findClosestStopIdToCoordinates(coordsOfDestination);
    const allTripsWithDestinationStop = findActiveTripsThatHaveStopId(destinationStop, tripUpdates);
    const potentialStarts = kClosestStops(startCoords, 8);

    const allTripsWithStartAndStop = findAllPotentialTrips(potentialStarts, destinationStop, allTripsWithDestinationStop);
    const allTripsWithStartAndStopFilteredForDuplicates = filterTripsOnSameRoute(allTripsWithStartAndStop);

    const allTripsWithShapes = addShapesToTrips(allTripsWithStartAndStopFilteredForDuplicates);

    return attachWalkingDirectionsToTrips(allTripsWithShapes, startCoords);
}
