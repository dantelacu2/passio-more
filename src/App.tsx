import React, { useState } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, PointAnnotation, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';

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
    return (
      <>
        <MapView style={styles.matchParent}>
          <Camera followZoomLevel={14} followUserLocation animationMode={'flyTo'} />
          <UserLocation/>
          <ShapeSource id="line-source" lineMetrics={true} shape={route}>
            <LineLayer id="line-layer" style={styles.lineLayer} />
          </ShapeSource>
          {stops.map((value: BusStop) => {
            return (
              <Stop key={value.stop_id} id={value.stop_id} coordinate={[value.stop_lon, value.stop_lat]} />
            )
          })}
        </MapView>
      </>
    );
}

export default App;
