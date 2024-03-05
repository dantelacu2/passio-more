import { Shape } from '../static_data/shapes';
import { BusStop, stops } from '../static_data/stops';

export interface StopTimeUpdate {
    stop_id: string;
    arrival: {
        time: number;
    }
}

export interface TripUpdate {
    id: string;
    trip_update: {
        trip: {
            trip_id: string;
        }
        stop_time_update: StopTimeUpdate[]
    }
}

export const getTripUpdatesFromPassioJSON = (responseJson: any): TripUpdate[] => {
    return <TripUpdate[]> responseJson;
}

export const computeDistanceBetweenCoordinates = (a: [number, number], b: [number, number]) => Math.hypot(b[0]-a[0], b[1]-a[1]);

export const kClosestStops = (coord: [number, number], K: number) => {
    return stops.sort((a: BusStop, b: BusStop) => computeDistanceBetweenCoordinates(coord, [a.stop_lon, a.stop_lat]) - computeDistanceBetweenCoordinates(coord, [b.stop_lon, b.stop_lat,])).slice(0, K);
};

/** Making the assumption that we want the closest stop */
export const findClosestStopIdToCoordinates = (coordinates: [number, number]): string => {
    let closestStopId: string = "";
    let smallestDistance: number = Infinity;
    stops.forEach((stop: BusStop) => {
        const stopCoords: [number, number] = [stop.stop_lon, stop.stop_lat];
        const distance = computeDistanceBetweenCoordinates(coordinates, stopCoords);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestStopId = stop.stop_id;
        }
    });
    return closestStopId;
}

export const findIndexClosestCoordinateToShapes = (coordinates: [number, number], shapes: Shape[]): number => {
    let closestIndex: number = 0;
    let smallestDistance: number = Infinity;
    shapes.forEach((shape: Shape, index: number) => {
        const stopCoords: [number, number] = [shape.shape_pt_lon, shape.shape_pt_lat];
        const distance = computeDistanceBetweenCoordinates(coordinates, stopCoords);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestIndex = index;
        }
    });
    return closestIndex;
}
