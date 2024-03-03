/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapboxGL, { PointAnnotation } from "@rnmapbox/maps";

MapboxGL.setAccessToken("sk.eyJ1IjoiZGxhY3VhZHJhIiwiYSI6ImNsdDR2aGVuNTA3dnUyc28wZTR6eHNvYWsifQ.fHJ54tKzq4-qSViPzvR5cA");

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1
  }
});

export default class App extends Component {
  constructor(props: any) {
    super(props);
    this.state = { markerRef: null };
  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  render() {
    return (
      <View style={styles.page}>
        <MapboxGL.MapView  style={styles.map}>
          {/* <MapboxGL.UserLocation/> */}
          <MapboxGL.Camera followUserLocation followZoomLevel={12} />
          <MapboxGL.PointAnnotation
            id="pin"
            coordinate={[42.374012, -71.114692]}
          >
            <View
              style={{
                height: 1000,
                width: 1000,
              }}>
                <Image
                  source={require("../assets/red-pin.png")}
                  style={{ height: 54, width: 43.5 }}
                />
              </View>
          </MapboxGL.PointAnnotation>
        </MapboxGL.MapView>
      </View>
    );
  }
}
