import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const MovementComponentTest = ({setMovement}) => {
  const [data, setData] = useState({x: 0, y: 0, z: 0});
  const [previousData, setPreviousData] = useState({x: 0, y: 0, z: 0});
  const movementThreshold = 2; // Adjust the threshold for significant movement
  const rateThreshold = 0.5; // Adjust the rate of change threshold

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100); // set update interval to 100ms
    const subscription = accelerometer.subscribe(
      ({x, y, z}) => {
        setData({x, y, z});

        // Calculate the rate of change in acceleration
        const dx = Math.abs(x - previousData.x);
        const dy = Math.abs(y - previousData.y);
        const dz = Math.abs(z - previousData.z);

        // Update previous data
        setPreviousData({x, y, z});

        // Check for significant movement
        const isMoving =
          dx > rateThreshold || dy > rateThreshold || dz > rateThreshold;
        setMovement(isMoving);
      },
      error => console.error('The sensor is not available', error),
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [previousData, setMovement]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Acceleration Data:</Text>
      <Text style={styles.text}>X: {data.x.toFixed(2)}</Text>
      <Text style={styles.text}>Y: {data.y.toFixed(2)}</Text>
      <Text style={styles.text}>Z: {data.z.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#333', // Dark color for better visibility
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MovementComponentTest;
