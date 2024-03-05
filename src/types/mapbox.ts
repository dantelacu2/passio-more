export interface Annotation {
    distance: number[];
    duration: number[];
}

export interface Admin {
    iso_3166_1_alpha3: string;
    iso_3166_1: string;
}

export interface Geometry {
    coordinates: number[][];
    type: string;
}

export interface Leg {
    via_waypoints: any[];
    annotation: Annotation;
    admins: Admin[];
    weight: number;
    duration: number;
    steps: any;
    distance: number;
    summary: string;
}

export interface Route {
    weight_name: string;
    weight: number;
    duration: number;
    distance: number;
    legs: Leg[];
    geometry: Geometry;
}

export interface Waypoint {
    distance: number;
    name: string;
    location: number[];
}

export interface WalkingDirections {
    routes: Route[];
    waypoints: Waypoint[];
    code: string;
    uuid: string;
}