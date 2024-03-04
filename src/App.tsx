import React, { useState } from 'react';
import { View } from 'react-native'
import { MapView, Camera, ShapeSource, LineLayer, PointAnnotation } from '@rnmapbox/maps';

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
          <Camera
            defaultSettings={{
              centerCoordinate: [-71.11847760632813, 42.37044385919086],
              zoomLevel: 14
              ,
            }}
          />
          <ShapeSource id="line-source" lineMetrics={true} shape={route}>
            <LineLayer id="line-layer" style={styles.lineLayer} />
          </ShapeSource>
          <PointAnnotation
          id="pin"
          coordinate={[-71.114692, 42.374012]}
        >
          <View
            style={{
              height: 15,
              width: 15,
              backgroundColor: 'red',
            }}>
            </View>
        </PointAnnotation>
        </MapView>
      </>
    );
}

export default App;
