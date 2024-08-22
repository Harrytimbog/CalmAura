import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Button,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserEngagementDetectorTest from '../components/UserEngagementDetectorTest';
import CallStatusComponentTest from '../components/CallStatusComponentTest';
import BackgroundMusicComponentTest from '../components/BackgroundMusicComponentTest';
import MovementComponentTest from '../components/MovementComponentTest';
import SoundComponentTest from '../components/SoundComponentTest';
import Svg, {Rect, Text as SVGText, G} from 'react-native-svg';
import HapticFeedback from 'react-native-haptic-feedback';
import uuid from 'react-native-uuid';
import axios from 'axios';
import AnalogueClock from '../components/Clock';
import DigitalClock from '../components/DigitalClock';

const screenWidth = Dimensions.get('window').width;

const maxWeights = {
  userEngagement: 0.3,
  backgroundMusic: 0.1,
  callStatus: 0.25,
  movement: 0.15,
  sound: 0.2,
};

const MonitoringScreen = () => {
  const [userEngagement, setUserEngagement] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [callStatus, setCallStatus] = useState(false);
  const [movement, setMovement] = useState(0);
  const [soundLevel, setSoundLevel] = useState(0);
  const [dangerLevel, setDangerLevel] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null); // State for userId

  // Generate a unique user ID or retrieve the existing one
  const getUserId = async () => {
    let id = await AsyncStorage.getItem('userId');
    if (!id) {
      id = uuid.v4();
      await AsyncStorage.setItem('userId', id);
    }
    setUserId(id);
  };

  useEffect(() => {
    getUserId(); // Retrieve or generate userId when the app starts
  }, []);

  // Function to play haptic feedback

  const playHapticFeedback = useCallback(() => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger('notificationWarning', options);
  }, []);

  const updateDangerLevel = useCallback(() => {
    let level = 0;

    level += userEngagement ? maxWeights.userEngagement : 0;
    level += backgroundMusic ? maxWeights.backgroundMusic : 0;
    level += callStatus ? maxWeights.callStatus : 0;
    level += movement * maxWeights.movement;
    level += soundLevel * maxWeights.sound;

    setDangerLevel(level);
    console.log('Updated Danger Level:', level);
  }, [userEngagement, backgroundMusic, callStatus, movement, soundLevel]);

  const startMonitoring = () => {
    setSessionId(uuid.v4()); // Generate a new session ID
  };

  const stopMonitoring = () => {
    setSessionId(null);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateDangerLevel();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [updateDangerLevel]);

  useEffect(() => {
    const saveActivity = async () => {
      if (!sessionId || !userId) return; // Don't save if session hasn't started or userId is not available

      const activity = {
        userId,
        sessionId,
        startTime: new Date().toISOString(),
        userEngagement,
        backgroundMusic,
        callStatus,
        movement,
        soundLevel,
        dangerLevel,
      };
      try {
        // await axios.post('http://192.168.1.35:3000/activities', activity);
        await axios.post('http://172.20.10.2:3000/activities', activity);

        console.log('Activity saved to MongoDB');
      } catch (error) {
        console.error('Error saving activity:', error);
      }
    };

    if (dangerLevel > 0) {
      saveActivity();
    }
  }, [
    sessionId,
    userId,
    dangerLevel,
    userEngagement,
    backgroundMusic,
    callStatus,
    movement,
    soundLevel,
  ]);

  useEffect(() => {
    if (dangerLevel >= 0.5) {
      playHapticFeedback();
      Alert.alert('Danger!', 'Too many tasks at the same time!');
    }
  }, [dangerLevel, playHapticFeedback]);

  useEffect(() => {
    updateDangerLevel();
  }, [
    userEngagement,
    backgroundMusic,
    callStatus,
    movement,
    soundLevel,
    updateDangerLevel,
  ]);

  const data = [
    {
      label: 'Engagement',
      value: userEngagement ? maxWeights.userEngagement : 0,
      color: 'rgba(255, 0, 0, 1)',
    },
    {
      label: 'Music',
      value: backgroundMusic ? maxWeights.backgroundMusic : 0,
      color: 'rgba(54, 162, 235, 1)',
    },
    {
      label: 'Call',
      value: callStatus ? maxWeights.callStatus : 0,
      color: 'rgba(75, 192, 192, 1)',
    },
    {
      label: 'Movement',
      value: movement * maxWeights.movement,
      color: 'rgba(255, 206, 86, 1)',
    },
    {
      label: 'Sound',
      value: soundLevel * maxWeights.sound,
      color: 'rgba(153, 102, 255, 1)',
    },
  ];

  const barWidth = (screenWidth - 40) / data.length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monitoring</Text>
      <View style={styles.clocks}>
        <AnalogueClock />
        <DigitalClock />
      </View>
      <TouchableOpacity style={styles.startMontoringBtn}>
        <Text style={styles.btnText} onPress={startMonitoring}>
          Start Recording
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.stopMontoringBtn}>
        <Text style={styles.btnText} onPress={stopMonitoring}>
          Stop Recording
        </Text>
      </TouchableOpacity>
      <View style={styles.displayCard}>
        <UserEngagementDetectorTest setUserEngagement={setUserEngagement} />
        <BackgroundMusicComponentTest setBackgroundMusic={setBackgroundMusic} />
        <View style={styles.twinCard}>
          <CallStatusComponentTest setCallStatus={setCallStatus} />
          <SoundComponentTest setSound={setSoundLevel} />
        </View>
        <MovementComponentTest setMovement={setMovement} />
      </View>
      <Text style={[styles.dangerText, {marginBottom: 20}]}>
        Hazard Level: {(dangerLevel * 100).toFixed(2)}%
      </Text>
      <View style={styles.chartContainer}>
        <Svg height="320" width={screenWidth - 20}>
          {data.map((item, index) => (
            <G key={index}>
              <Rect
                x={index * barWidth + 20}
                y={320 - item.value * 300}
                width={barWidth - 20}
                height={item.value * 300}
                fill={item.color}
              />
              <SVGText
                x={index * barWidth + (barWidth - 20) / 2 + 20}
                y={320 - item.value * 300 - 10}
                fill="#d3d3d3"
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle">
                {(item.value * 100).toFixed(1)}%
              </SVGText>
              <SVGText
                x={index * barWidth + (barWidth - 20) / 2 + 20}
                y={335}
                fill="black"
                fontSize="12"
                textAnchor="middle">
                {item.label}
              </SVGText>
            </G>
          ))}
        </Svg>
      </View>
      <View style={[styles.legendContainer, {marginBottom: 20}]}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, {backgroundColor: item.color}]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    height: '100%',
    // backgroundColor: '#f0f0f0',
    // backgroundColor: '#121212',
    backgroundColor: '#1c1c1c',
  },
  displayCard: {
    padding: 16,
  },
  twinCard: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 16,
    marginBottom: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  dangerText: {
    fontSize: 24,
    color: '#ff4136',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  chart: {
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: 'white',
    // color: '#333',
  },
  startMontoringBtn: {
    backgroundColor: '#28a745',
    marginBottom: 10,
    borderRadius: 24,
  },
  stopMontoringBtn: {
    backgroundColor: '#dc3545',
    borderRadius: 24,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 5,
  },
  clocks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default MonitoringScreen;
