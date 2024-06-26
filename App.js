// App.js
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import MovementComponentTest from './components/MovementComponentTest';
import SoundComponentTest from './components/SoundComponentTest';
import CallStatusComponentTest from './components/CallStatusComponentTest';
import BackgroundMusicComponentTest from './components/BackgroundMusicComponentTest';
import UserEngagementDetectorTest from './components/UserEngagementDetectorTest';
// import BackgroundMusicComponentTest from './components/BackgroundMusicComponentTest';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <UserEngagementDetectorTest />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
