import React, { useState, useRef } from 'react';
import { View, Image } from 'react-native'
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
    isColored: boolean,
}

const Stop = (props: Props) => {
    const { id, isColored } = props;
    const pointAnnotation = useRef<PointAnnotation>(null);
    const stopObject = stops.find(stop => stop.stop_id === id);
    const coord: [number, number] = [stopObject.stop_lon, stopObject.stop_lat]

    const uri = isColored ? 'https://www.clipartmax.com/png/small/46-463589_google-map-pin-yellow-google-map-pin.png' : 'https://www.clipartmax.com/png/middle/5-51442_white-map-pin-png.png'
    return (
        <PointAnnotation
            id={id}
            coordinate={coord}
            ref={pointAnnotation}
         >
        <View>
            <Image
            source={{ uri: uri }}
            style={{ height: 30, width: 20 }}
            onLoad={() => pointAnnotation.current?.refresh()}
            fadeDuration={0}
            />
        </View>
    </PointAnnotation>
    );
}

export default Stop;
