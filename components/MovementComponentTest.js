import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const MovementComponentTest = ({setMovement}) => {
  const [data, setData] = useState({x: 0, y: 0, z: 0});

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // set update interval to 100ms
    const subscription = accelerometer.subscribe(
      ({x, y, z}) => {
        setData({x, y, z});
        // Assuming that significant movement is when any of the values exceed a threshold
        const isMoving = Math.abs(x) > 1 || Math.abs(y) > 1 || Math.abs(z) > 1;
        setMovement(isMoving);
      },
      error => console.error('The sensor is not available', error),
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setMovement]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Acceleration Data:</Text>
      <Text>X: {data.x.toFixed(2)}</Text>
      <Text>Y: {data.y.toFixed(2)}</Text>
      <Text>Z: {data.z.toFixed(2)}</Text>
    </View>
  );
};

export default MovementComponentTest;
