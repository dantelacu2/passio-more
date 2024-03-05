import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { findClosestStopIdToCoordinates, getTripUpdatesFromPassioJSON } from './utils/parsePassio';
import { findRoutes } from './utils/createTrip';

MapboxGL.setAccessToken("sk.eyJ1IjoiZGxhY3VhZHJhIiwiYSI6ImNsdDR2aGVuNTA3dnUyc28wZTR6eHNvYWsifQ.fHJ54tKzq4-qSViPzvR5cA");

const styles = {
  matchParent: {
    flex: 1,
  },
  lineLayer: {
    lineColor: 'red',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 5,
  },
};

const createLineString = (coords: [number, number][] = []): GeoJSON.Feature => {
  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: coords,
    },
  }
};

const App = () => {
    const [route, setRoute] = useState<GeoJSON.Feature>(createLineString());
    const [userCoordinates, setUserCoordinates] = useState<[number, number]>([0, 0]);

    useEffect(() => {
      // console.log(getTripUpdatesFromPassioJSON(getTripUpdates()));
      console.log("start", userCoordinates);
      const allCoords = findRoutes("", userCoordinates, getTripUpdatesFromPassioJSON(getTripUpdates()));
      setRoute(createLineString(allCoords));
    }, [userCoordinates]);

    const closestStopId: string = findClosestStopIdToCoordinates(userCoordinates);

    return (
      <>
        <MapView style={styles.matchParent}>
          <Camera followZoomLevel={14} followUserLocation animationMode={'flyTo'} />
          <UserLocation onUpdate={(loc: MapboxGL.Location) => setUserCoordinates([loc.coords.longitude, loc.coords.latitude])} />
          <ShapeSource id="line-source" lineMetrics shape={route}>
            <LineLayer id="line-layer" style={styles.lineLayer} />
          </ShapeSource>
          {stops.map((value: BusStop) => {
            return (
              <Stop isColored={false} key={value.stop_id} id={value.stop_id} />
            )
          })}
          <Stop isColored={true} key={closestStopId} id={closestStopId} />
        </MapView>
      </>
    );
}

export default App;
