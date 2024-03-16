import React, { useState, useEffect } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { getTripUpdatesFromPassioJSON } from './utils/parsePassio';
import { findRoutes, FullTrip } from './utils/createTrip';
import { SearchBar } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import RouteSelector from './components/RouteSelector';


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
    const [walkFromRoute, setWalkFromRoute] = useState<GeoJSON.Feature>(createLineString());
    const [activeTripIndex, setActiveTripIndex] = useState<string>("0");
    const [allTrips, setAllTrips] = useState<FullTrip[]>([]);
    const [userCoordinates, setUserCoordinates] = useState<[number, number]>([0, 0]);
    const [searchText, setSearchText] = useState<string>("");
    const [destinationQuery, setDestinationQuery] = useState<string>("");

    // Update the route options when a user selects a new one.
    useEffect(() => {
      if (destinationQuery !== "" && allTrips.length >= 1) {
        const trip = allTrips[Number(activeTripIndex)];
        setRoute(createLineString(trip.shapes));
        if (trip?.directionsToStartStop) {
          setWalkToRoute(createLineString(trip.directionsToStartStop?.routes[0]?.geometry.coordinates));
          setWalkFromRoute(createLineString(trip.directionsFromEndStop?.routes[0]?.geometry.coordinates));
        }
      }
    }, [activeTripIndex, destinationQuery]);

    // Fetch data from Passio + Mapbox Walking Directions API when a user submits a new query
    useEffect(() => {
      if (destinationQuery !== "") {
        findRoutes(destinationQuery, userCoordinates, getTripUpdatesFromPassioJSON(getTripUpdates())).then((potentialTrips) => {
          setAllTrips(potentialTrips);
          setRoute(createLineString(potentialTrips[0].shapes));
          if (potentialTrips[0]?.directionsToStartStop) {
            setWalkToRoute(createLineString(potentialTrips[0].directionsToStartStop?.routes[0]?.geometry.coordinates));
            setWalkFromRoute(createLineString(potentialTrips[0].directionsFromEndStop?.routes[0]?.geometry.coordinates));
          }
        });
      }
    }, [destinationQuery]);

    return (
      <>
        <MapView style={styles.matchParent}>
          <SearchBar
            onChangeText={setSearchText}
            onSubmitEditing={setDestinationQuery}
            value={searchText}
            searchIcon={false}
            clearIcon={false}
            inputStyle={styles.searchBarInput}
            containerStyle={styles.searchBarContainer}
            placeholder={'Enter Destination'} 
          />
          <Camera followZoomLevel={14} followUserLocation animationMode={'flyTo'} />
          <UserLocation showsUserHeadingIndicator onUpdate={(loc: MapboxGL.Location) => setUserCoordinates([loc.coords.longitude, loc.coords.latitude])} />
          <ShapeSource id="route-source" shape={route}>
            <LineLayer id="route-layer" style={styles.routeLineLayer} />
          </ShapeSource>
          <ShapeSource id="walk-to-source" shape={walkToRoute}>
            <LineLayer id="walk-to-layer" style={styles.walkLineLayer} />
          </ShapeSource>
          <ShapeSource id="walk-from-source" shape={walkFromRoute}>
            <LineLayer id="walk-from-layer" style={styles.walkLineLayer} />
          </ShapeSource>
          {stops.map((value: BusStop) => {
            return (
              <Stop isColored={false} key={value.stop_id} id={value.stop_id} />
            )
          })}
          {allTrips.length >= 1 && (
            <RouteSelector 
              setActiveTripIndex={setActiveTripIndex}
              activeTripIndex={activeTripIndex.toString()}
              fullTrips={allTrips}
            />
          )}
        </MapView>
      </>
    );
}

export default App;
