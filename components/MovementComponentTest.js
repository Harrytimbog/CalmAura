import {
  faBicycle,
  faCar,
  faRunning,
  faTachometerAlt,
  faWalking,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

const MovementComponentTest = ({setMovement}) => {
  const [data, setData] = useState({x: 0, y: 0, z: 0});
  const [previousData, setPreviousData] = useState({x: 0, y: 0, z: 0});

  const rateThresholds = useMemo(
    () => ({
      low: 0.5,
      medium: 1.5,
      high: 2.5,
    }),
    [],
  );

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

        // Check for significant movement and normalize the value
        let movementIntensity = 0;

        if (
          dx > rateThresholds.high ||
          dy > rateThresholds.high ||
          dz > rateThresholds.high
        ) {
          movementIntensity = 1; // High intensity
        } else if (
          dx > rateThresholds.medium ||
          dy > rateThresholds.medium ||
          dz > rateThresholds.medium
        ) {
          movementIntensity = 0.7; // Medium intensity
        } else if (
          dx > rateThresholds.low ||
          dy > rateThresholds.low ||
          dz > rateThresholds.low
        ) {
          movementIntensity = 0.4; // Low intensity
        }

        setMovement(movementIntensity);
      },
      error => console.error('The sensor is not available', error),
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [previousData, setMovement, rateThresholds]);

  return (
    <View style={styles.container}>
      <View style={styles.iconsWrapper}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={faTachometerAlt} size={16} color="#900" />
        </View>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={faRunning} size={16} color="#900" />
        </View>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={faBicycle} size={16} color="#900" />
        </View>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={faWalking} size={16} color="#900" />
        </View>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={faCar} size={16} color="#900" />
        </View>
      </View>

      <Text style={styles.primaryText}>Motion detected:</Text>
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
    // flexDirection: 'row',
    // borderWidth: 2,
    // borderColor: '#000',
    backgroundColor: '#d3d3d3',
    opacity: 0.5,
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
  },
  iconsWrapper: {
    flexDirection: 'row',
    gap: 8,
  },
  iconWrapper: {
    backgroundColor: '#a9a9a9',
    padding: 5,
    borderRadius: 3,
  },
  primaryText: {
    color: '#900', // Dark color for better visibility
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  text: {
    color: '#333', // Dark color for better visibility
    fontSize: 16,
    // fontWeight: 'bold',
  },
});

export default MovementComponentTest;
