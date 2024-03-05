import { BusStop, stops } from '../static_data/stops';

export interface StopTimeUpdate {
    stop_id: string;
    arrival: {
        time: number;
    }
}

export interface TripUpdate {
    id: string;
    tripUpdate: {
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
