import React, { useState } from 'react';
import { View } from 'react-native'
import MapboxGL, { MapView, Camera, ShapeSource, LineLayer, PointAnnotation, UserLocation } from '@rnmapbox/maps';

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
    coordinate: [number, number],
    id: string,
}

const Stop = (props: Props) => {
    const { coordinate, id } = props;
    return (
        <PointAnnotation
            id={id}
            coordinate={coordinate}
         >
        <View
            style={{
                height: 15,
                width: 15,
                backgroundColor: 'red',
            }}>
        </View>
    </PointAnnotation>
    );
}

export default Stop;
