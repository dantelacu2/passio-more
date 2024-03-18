import React, { useState, useEffect } from 'react';
import { View, Modal, Text, StyleSheet, TouchableOpacity, Touchable, ScrollView } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, UserLocation } from '@rnmapbox/maps';
import Stop from './components/Stop';
import { stops, BusStop } from './static_data/stops';
import { getTripUpdates } from './apis/PassioAPI';
import { getTripUpdatesFromPassioJSON } from './utils/parsePassio';
import { findRoutes, FullTrip } from './utils/createTrip';
import { SearchBar } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import RouteSelector from './components/RouteSelector';
import { VisibilityOff } from '@mui/icons-material';
import { fontSize } from '@mui/system';

// process.env.MAPBOX_API_KEY
MapboxGL.setAccessToken('sk.eyJ1Ijoibm90bHVja3ljaGFybSIsImEiOiJjbHR2Z20xc24xZjhnMmpvYmg0cjJ1a2s3In0.Pn8n4Ex5s85fYt-hJ55H9Q' || "");

const styles = {
  matchParent: {
    flex: 1,
  },

  popupContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  popupText: {
    fontSize: 24,
  },

  routeText: {
    fontSize: 18,
  },

  routeContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'left',
    backgroundColor: 'gray',
    height: 24,
  },

  heading: {
    fontSize: 24,
    fontWeight: 'bold'
  },

  popUp: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 20,
    alignItems: 'left',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  closeButton: {
    marginTop: 20,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
  },

  goButton: {
    marginLeft: 100,
    backgroundColor: '#cfc',
    padding: 10,
    borderRadius: 10,
  },

  button: {
    padding: 10,
    borderRadius: 10,
  },

  routePoint: {
    marginTop: 3,
    marginLeft: 0,
    marginRight: 10,
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    width: "100%"
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
  },
  // Styles for Stop View
  scrollView: {
    maxHeight: 200,
  },
  departureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'left',
    paddingVertical: 8,
  },
  departureTime: {
    fontSize: 16,
    color: '#666',
    marginLeft: 25,
  },
  departureName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  disclaimerText: {
    color: 'red',
    fontSize: 12,
  },
  disclaimer: {
    marginLeft: 35
  },
  boxItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    const [source, setSource] = useState<[number, number]>([0, 0]);
    const [destination, setDestination] = useState<BusStop>();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [suggestions, setSuggestions] = useState<BusStop[]>([]);
    const [stopVisible, setStopVisible] = useState<boolean>(false);
    const [currStop, setCurrStop] = useState<BusStop>();
    const [innerText, setInnerText] = useState<string>("See More");
    const [stopAvailabilityIsVisible, setStopAvailabilityIsVisible] = useState<boolean>(false);

    const updateSuggestions = (text: string) => {
      if (text.trim() === '') {
        setSuggestions([]);
      } else {
        const filtered = stops.filter((stop) =>
          stop.stop_name.toLowerCase().includes(text.toLowerCase())
        );
        setSuggestions(filtered);
      }
    };

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
            onChangeText={(text) => {
              setSearchText(text);
              updateSuggestions(text);
            }}
            onSubmitEditing={setDestinationQuery}
            value={searchText}
            searchIcon={false}
            clearIcon={false}
            inputStyle={styles.searchBarInput}
            containerStyle={styles.searchBarContainer}
            placeholder={'Enter Destination'} 
          />
          <View style={styles.popUp}>
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <Text 
                  style={styles.popupText}
                  key={index} 
                  onPress={() => {
                    setSearchText(suggestion.stop_name);
                    setDestination(suggestion);
                    setDestinationQuery(suggestion.stop_name)
                    setIsPopupVisible(true);
                    setSuggestions([]);
                  }}>
                  {suggestion.stop_name}
                </Text>
              ))}
          </View>
          <Camera followZoomLevel={14} followUserLocation animationMode={'flyTo'} />
          <UserLocation showsUserHeadingIndicator onUpdate={(loc: MapboxGL.Location) => {setUserCoordinates([loc.coords.longitude, loc.coords.latitude]); setSource(userCoordinates)}} />
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
              <Stop 
                isColored={false} 
                key={value.stop_id} 
                id={value.stop_id} 
                name={value.stop_name} 
                onPress={() => {setStopVisible(true); setCurrStop(value)}}
              />
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
        {/* Route Preview */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isPopupVisible}
          onRequestClose={() => setIsPopupVisible(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popUp}>
              <Text style={styles.popupText}>Directions</Text>
              <View style={styles.routePoint}>
                <TouchableOpacity>
                  <Text>From: My Location</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.routePoint}>
                <TouchableOpacity>
                  <Text>To: {destination?.stop_name}</Text>
                </TouchableOpacity>
              </View>
              <View style={{...styles.routePoint, marginTop: 25, flexDirection: 'row', backgroundColor: "#fff"}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', marginRight: 5}}>15 </Text>
                <Text style={{fontSize: 24}}>min</Text>
                <Text style={{...styles.goButton, fontSize: 24}}>Go!</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsPopupVisible(false)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Stop Information */}
        <Modal
          animationType=""
          transparent={true}
          visible={stopVisible}
          onRequestClose={() => setStopVisible(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popUp}>
              <Text style={styles.popupText}>{currStop?.stop_name}</Text>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <TouchableOpacity 
                  style={{...styles.button, backgroundColor: '#0F4BFE'}}
                  onPress={() => {setStopVisible(false); setIsPopupVisible(true); setDestination(currStop)} }>
                    <Text  style={{color:'white'}}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={{...styles.button, backgroundColor: '#ddd', marginLeft: 5}}
                  onPress={() => {if (!stopAvailabilityIsVisible) {setInnerText("See Less")} else {setInnerText("See More")}; setStopAvailabilityIsVisible(!stopAvailabilityIsVisible)} }>
                    <Text>{innerText}</Text>
                </TouchableOpacity>
              </View>
              { stopAvailabilityIsVisible &&
              <View style={{width: "100%"}}>
                <Text style={styles.popupText}>Scheduled Arrivals at {currStop?.stop_name}</Text>
                <View style={{...styles.routePoint, backgroundColor: '#fff'}}>
                  <ScrollView style={styles.scrollView}>
                    <View style={styles.boxItem}>
                      <View style={styles.departureItem}>
                        <Text style={styles.departureName}>Allston Loop</Text>
                        <Text style={styles.departureTime}>5:05 PM</Text>
                      </View>
                      <View style={styles.disclaimer}>
                        <Text style={styles.disclaimerText}>Now Arriving at 5:08 PM</Text>
                      </View>
                    </View>
                    <View style={styles.boxItem}>
                      <View style={styles.departureItem}>
                        <Text style={styles.departureName}>Quad SEC Express</Text>
                        <Text style={styles.departureTime}>5:15 PM</Text>
                      </View>
                    </View>
                    <View style={styles.boxItem}>
                      <View style={styles.departureItem}>
                        <Text style={styles.departureName}>Allston Loop</Text>
                        <Text style={styles.departureTime}>5:35 PM</Text>
                      </View>
                      <View style={styles.disclaimer}>
                        <Text style={{...styles.disclaimerText, color: 'green'}}>
                          Now Arriving at 5:34 PM
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>
              }
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setStopVisible(false)}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
}

export default App;
