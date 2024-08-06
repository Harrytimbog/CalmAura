import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import UserEngagementDetectorTest from '../components/UserEngagementDetectorTest';
import CallStatusComponentTest from '../components/CallStatusComponentTest';
import BackgroundMusicComponentTest from '../components/BackgroundMusicComponentTest';
import MovementComponentTest from '../components/MovementComponentTest';
import SoundComponentTest from '../components/SoundComponentTest';
import {Svg, Rect, Text as SVGText, G} from 'react-native-svg';
import HapticFeedback from 'react-native-haptic-feedback';

const screenWidth = Dimensions.get('window').width;

const maxWeights = {
  userEngagement: 0.3, // 30%
  backgroundMusic: 0.1, // 10%
  callStatus: 0.25, // 25%
  movement: 0.15, // 15%
  sound: 0.2, // 20%
};

const MonitoringScreen = () => {
  const [userEngagement, setUserEngagement] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [callStatus, setCallStatus] = useState(false);
  const [movement, setMovement] = useState(0); // Changed to normalized value
  const [soundLevel, setSoundLevel] = useState(0); // Normalized sound level
  const [dangerLevel, setDangerLevel] = useState(0);

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
    console.log('Updated Danger Level:', level); // Log the danger level
  }, [userEngagement, backgroundMusic, callStatus, movement, soundLevel]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateDangerLevel();
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [updateDangerLevel]);

  useEffect(() => {
    if (dangerLevel >= 0.5) {
      playHapticFeedback();
    }
    if (dangerLevel >= 0.5) {
      Alert.alert('Danger!', 'Too many tasks at the same time!');
    }
    console.log('Current Danger Level:', dangerLevel); // Log the current danger level
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
      color: 'rgba(255, 0, 0, 1)', // Distinct red
    },
    {
      label: 'Music',
      value: backgroundMusic ? maxWeights.backgroundMusic : 0,
      color: 'rgba(54, 162, 235, 1)', // Distinct blue
    },
    {
      label: 'Call',
      value: callStatus ? maxWeights.callStatus : 0,
      color: 'rgba(75, 192, 192, 1)', // Distinct green
    },
    {
      label: 'Movement',
      value: movement * maxWeights.movement,
      color: 'rgba(255, 206, 86, 1)', // Distinct yellow
    },
    {
      label: 'Sound',
      value: soundLevel * maxWeights.sound,
      color: 'rgba(153, 102, 255, 1)', // Distinct purple
    },
  ];

  const barWidth = (screenWidth - 40) / data.length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monitoring</Text>
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
        Danger Level: {(dangerLevel * 100).toFixed(2)}%
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
                fill="black"
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
    backgroundColor: '#f0f0f0', // Added background color for better readability
  },
  displayCard: {
    // borderWidth: 2,
    // borderColor: '#000',
    // borderRadius: 10,
    padding: 16,
  },
  twinCard: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 24,
    textAlign: 'left',
    marginLeft: 16,
    marginBottom: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  dangerText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 8, // Added padding to the container
  },
  chart: {
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow legend items to wrap to multiple lines
    justifyContent: 'center',
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5, // Added vertical margin for better spacing
  },
  legendColor: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12, // Smaller font size for better fit
    color: '#333',
  },
});

export default MonitoringScreen;
