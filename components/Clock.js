import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Svg, {Circle, Line} from 'react-native-svg';

const AnalogueClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const secondsDegrees = time.getSeconds() * 6;
  const minutesDegrees = time.getMinutes() * 6;
  const hoursDegrees = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <View style={styles.container}>
      <Svg height="100" width="100" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="48"
          stroke="black"
          strokeWidth="2"
          fill="white"
        />
        {/* Hour Hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="30"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          transform={`rotate(${hoursDegrees}, 50, 50)`}
        />
        {/* Minute Hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="20"
          stroke="black"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${minutesDegrees}, 50, 50)`}
        />
        {/* Second Hand */}
        <Line
          x1="50"
          y1="50"
          x2="50"
          y2="10"
          stroke="red"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${secondsDegrees}, 50, 50)`}
        />
        <Circle cx="50" cy="50" r="3" fill="black" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
});

export default AnalogueClock;
