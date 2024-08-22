import React, {useEffect, useState} from 'react';
import {Text, StyleSheet} from 'react-native';

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = date => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return <Text style={styles.clockText}>{formatTime(time)}</Text>;
};

const styles = StyleSheet.create({
  clockText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bfbfbf',
    textAlign: 'center',
    padding: 10,
  },
});

export default DigitalClock;
