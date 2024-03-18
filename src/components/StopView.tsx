import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, PointAnnotation, UserLocation } from '@rnmapbox/maps';
import { BusStop, stops } from '../static_data/stops';

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
  
  interface Props {
      id: string,
      name: string,
  }