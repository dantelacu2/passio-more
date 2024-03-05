import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { findClosestStopIdToCoordinates, getTripUpdatesFromPassioJSON } from './utils/parsePassio';

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

const lineString: GeoJSON.Feature = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
        [
            -71.11592630237446,
            42.371424005380476
        ],
        [
            -71.11670870225363,
            42.370150650093876
        ],
        [
            -71.11700351959949,
            42.36965638023139
        ],
        [
            -71.11718494565804,
            42.369262637049786
        ],
        [
            -71.11692414569862,
            42.368759982592934
        ]
    ],
  },
};

const App = () => {
    const [route, setRoute] = useState<GeoJSON.Feature>(lineString);
    const [userCoordinates, setUserCoordinates] = useState<[number, number]>([0, 0]);

    useEffect(() => {
      console.log(getTripUpdatesFromPassioJSON(getTripUpdates()));
    }, []);

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
