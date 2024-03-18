import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { routes } from '../static_data/routes';
import { trips } from '../static_data/trips';
import { FullTrip } from '../utils/createTrip';

interface Props {
    fullTrips: FullTrip[],
    activeTripIndex: string,
    setActiveTripIndex: React.Dispatch<React.SetStateAction<string>>,
}

const RouteSelector = (props: Props) => {

  const data = props.fullTrips.map((fullTrip, fullTripIndex) => {
    const routeId = trips.find((staticTrip) => staticTrip.trip_id.toString() === fullTrip.tripUpdate.trip_update.trip.trip_id)?.route_id || "";
    return {
        label: routes.find((route) => route.route_id === routeId)?.route_long_name + "  Arrives: " + fullTrip?.nextBusArrivalTime?.toString() + " min   Walking: " + fullTrip?.totalWalkingTime?.toString() + " min",
        value: fullTripIndex.toString(),
    };
  });

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Select item"
      value={props.activeTripIndex}
      onChange={item => {
        props.setActiveTripIndex(item.value);
      }}
    />
  );
};

export default RouteSelector;

const styles = StyleSheet.create({
  dropdown: {
    marginTop: 10,
    padding: 10,
    height: 50,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
