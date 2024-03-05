import axios from 'axios';
import { WalkingDirections } from '../types/mapbox';

export async function getWalkingDirections(startCoords: [number, number], endCoords: [number, number]): Promise<WalkingDirections> {
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${encodeURIComponent(startCoords[0])}%2C${encodeURIComponent(startCoords[1])}%3B${encodeURIComponent(endCoords[0])}%2C${encodeURIComponent(endCoords[1])}`;
    console.log("Walking Directions API Called");
    const response = await axios.get(url, {
      params: {
        access_token: `${process.env.MAPBOX_API_KEY || ""}`,
        alternatives: `true`,
        geometries: `geojson`,
        language: `en`,
        overview: `simplified`,
        steps: `false`,
      },
    });
    return <WalkingDirections> response.data;
}
