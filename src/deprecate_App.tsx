/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapboxGL, { PointAnnotation, LineLayer } from "@rnmapbox/maps";

MapboxGL.setAccessToken("sk.eyJ1IjoiZGxhY3VhZHJhIiwiYSI6ImNsdDR2aGVuNTA3dnUyc28wZTR6eHNvYWsifQ.fHJ54tKzq4-qSViPzvR5cA");

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1
  }
});

const App = () => {
  const [route, setRoute] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates:[
          [
            -71.0868951733463,
            42.37272818982612
          ],
          [
            -71.07887789434356,
            42.37160365328563
          ],
          [
            -71.06807032964188,
            42.36545563762894
          ]
        ],
        },
      },
    ],
  });

  return (
    <View style={styles.page}>
      <MapboxGL.MapView  style={styles.map}>
        <MapboxGL.UserLocation/>
        <MapboxGL.Camera followUserLocation followZoomLevel={12} />
        <MapboxGL.ShapeSource shape={route.features[0]}>
          <LineLayer
            id="layer"
            />
        </MapboxGL.ShapeSource>
        <MapboxGL.PointAnnotation
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
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>
    </View>
  );
};

export default App;
