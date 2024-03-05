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
            tripId: string;
        }
        stop_time_update: StopTimeUpdate[]
    }
}

export const getTripUpdatesFromPassioJSON = (responseJson: any): TripUpdate[] => {
    return <TripUpdate[]> responseJson;
}

export const computeDistanceBetweenCoordinates = (a: [number, number], b: [number, number]) => Math.hypot(b[0]-a[0], b[1]-a[1]);

export const kClosestStops = (coord: [number, number], K: number) => {
    const sqDist = (pointa: [number, number], pointb: [number, number]) => (pointa[0] - pointb[0]) ** 2 + (pointa[1] - pointb[1]) ** 2;
    return stops.sort((a: BusStop, b: BusStop) => sqDist(coord, [a.stop_lat, a.stop_lon]) - sqDist(coord, [b.stop_lat, b.stop_lon])).slice(0, K);
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
