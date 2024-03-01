/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL from "@rnmapbox/maps";

MapboxGL.setAccessToken(process.env.MAPBOX_API_KEY as string);

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  map: {
    flex: 1
  }
});

export default class App extends Component {
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
  }

  render() {
    return (
      <View style={styles.page}>
        <MapboxGL.MapView style={styles.map} />
      </View>
    );
  }
}
