import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { getWalkingDirections } from './apis/MapboxDirectionsAPI';
import { findClosestStopIdToCoordinates, getTripUpdatesFromPassioJSON } from './utils/parsePassio';
import { findRoutes } from './utils/createTrip';
import { SearchBar } from 'react-native-elements';

MapboxGL.setAccessToken(process.env.MAPBOX_API_KEY || "");

const styles = {
  matchParent: {
    flex: 1,
  },
  routeLineLayer: {
    lineColor: 'red',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 3,
  },
  walkLineLayer: {
    lineColor: 'blue',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 2,
    lineDasharray: [2, 1],
  },
  searchBarContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 40,
  },
  searchBarInput: {
    backgroundColor: 'white',
    paddingLeft: 10,
  }
};

const createLineString = (coords = [[0, 0]]): GeoJSON.Feature => {
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
    const [walkToRoute, setWalkToRoute] = useState<GeoJSON.Feature>(createLineString());
    const [userCoordinates, setUserCoordinates] = useState<[number, number]>([0, 0]);
    const [destinationQuery, setDestinationQuery] = useState<string>("");

    useEffect(() => {
      if (destinationQuery !== "") {
        findRoutes(destinationQuery, userCoordinates, getTripUpdatesFromPassioJSON(getTripUpdates())).then((potentialTrips) => {
          setRoute(createLineString(potentialTrips[0].shapes));
          setWalkToRoute(createLineString(potentialTrips[0].directionsToStartStop?.routes[0]?.geometry.coordinates));
        });
      }
    }, [destinationQuery]);

    return (
      <>
        <MapView style={styles.matchParent}>
          <SearchBar
            onChangeText={setDestinationQuery}
            value={destinationQuery}
            searchIcon={false}
            showCancel={false}
            cancelButtonTitle="cancel"
            cancelIcon={false}
            inputStyle={styles.searchBarInput}
            containerStyle={styles.searchBarContainer}
            placeholder={'Enter Destination'} 
          />
          <Camera followZoomLevel={14} followUserLocation animationMode={'flyTo'} />
          <UserLocation showsUserHeadingIndicator onUpdate={(loc: MapboxGL.Location) => setUserCoordinates([loc.coords.longitude, loc.coords.latitude])} />
          <ShapeSource id="route-source" shape={route}>
            <LineLayer id="route-layer" style={styles.routeLineLayer} />
          </ShapeSource>
          <ShapeSource id="walk-source" shape={walkToRoute}>
            <LineLayer id="walk-layer" style={styles.walkLineLayer} />
          </ShapeSource>
          {stops.map((value: BusStop) => {
            return (
              <Stop isColored={false} key={value.stop_id} id={value.stop_id} />
            )
          })}
        </MapView>
      </>
    );
}

export default App;
