import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { findClosestStopIdToCoordinates, getTripUpdatesFromPassioJSON } from './utils/parsePassio';
import { findRoutes } from './utils/createTrip';
import { SearchBar } from 'react-native-elements';

MapboxGL.setAccessToken("sk.eyJ1IjoiZGxhY3VhZHJhIiwiYSI6ImNsdDR2aGVuNTA3dnUyc28wZTR6eHNvYWsifQ.fHJ54tKzq4-qSViPzvR5cA");

const styles = {
  matchParent: {
    flex: 1,
  },
  lineLayer: {
    lineColor: 'red',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 3,
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

const createLineString = (coords: [number, number][] = [[0, 0]]): GeoJSON.Feature => {
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
    const [destinationQuery, setDestinationQuery] = useState<string>("");

    useEffect(() => {
      if (destinationQuery !== "") {
        const allPotentialTrips = findRoutes(destinationQuery, userCoordinates, getTripUpdatesFromPassioJSON(getTripUpdates()));
        setRoute(createLineString(allPotentialTrips[0].shapes));
      }
    }, [destinationQuery]);

    const closestStopId: string = findClosestStopIdToCoordinates(userCoordinates);

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
          <ShapeSource id="line-source" shape={route}>
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
