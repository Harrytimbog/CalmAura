import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import UserEngagementDetectorTest from '../components/UserEngagementDetectorTest';
import CameraUsageTestComponent from '../components/CameraUsageTestComponent';
import CallStatusComponentTest from '../components/CallStatusComponentTest';
import BackgroundMusicComponentTest from '../components/BackgroundMusicComponentTest';
import MovementComponentTest from '../components/MovementComponentTest';
import SoundComponentTest from '../components/SoundComponentTest';

const MonitoringScreen = () => {
  const [userEngagement, setUserEngagement] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [callStatus, setCallStatus] = useState(false);
  const [movement, setMovement] = useState(false);
  const [sound, setSound] = useState(false);
  const [dangerLevel, setDangerLevel] = useState(0);

  useEffect(() => {
    const updateDangerLevel = () => {
      let level = 0;
      if (userEngagement) level += 1;
      if (backgroundMusic) level += 1;
      if (callStatus) level += 1;
      if (movement) level += 1;
      if (sound) level += 1;
      setDangerLevel(level);
    };

    updateDangerLevel();
  }, [userEngagement, backgroundMusic, callStatus, movement, sound]);

  useEffect(() => {
    if (dangerLevel >= 3) {
      alert('Danger! Too many tasks at the same time!');
    }
  }, [dangerLevel]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monitoring</Text>
      <UserEngagementDetectorTest setUserEngagement={setUserEngagement} />
      <BackgroundMusicComponentTest setBackgroundMusic={setBackgroundMusic} />
      <CallStatusComponentTest setCallStatus={setCallStatus} />
      <MovementComponentTest setMovement={setMovement} />
      <SoundComponentTest setSound={setSound} />
      <Text style={styles.dangerText}>Danger Level: {dangerLevel}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  dangerText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MonitoringScreen;
