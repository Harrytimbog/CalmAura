import React, {useEffect, useState, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import UserEngagementDetectorTest from '../components/UserEngagementDetectorTest';
import CallStatusComponentTest from '../components/CallStatusComponentTest';
import BackgroundMusicComponentTest from '../components/BackgroundMusicComponentTest';
import MovementComponentTest from '../components/MovementComponentTest';
import SoundComponentTest from '../components/SoundComponentTest';
import {Svg, Rect, Text as SVGText, G} from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

const MonitoringScreen = () => {
  const [userEngagement, setUserEngagement] = useState(false);
  const [backgroundMusic, setBackgroundMusic] = useState(false);
  const [callStatus, setCallStatus] = useState(false);
  const [movement, setMovement] = useState(false);
  const [sound, setSound] = useState(false);
  const [dangerLevel, setDangerLevel] = useState(0);

  const updateDangerLevel = useCallback(() => {
    let level = 0;
    if (userEngagement) level += 1;
    if (backgroundMusic) level += 1;
    if (callStatus) level += 1;
    if (movement) level += 1;
    if (sound) level += 1;
    setDangerLevel(level);
    console.log('Updated Danger Level:', level); // Log the danger level
  }, [userEngagement, backgroundMusic, callStatus, movement, sound]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateDangerLevel();
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, [updateDangerLevel]);

  useEffect(() => {
    if (dangerLevel >= 3) {
      alert('Danger! Too many tasks at the same time!');
    }
    console.log('Current Danger Level:', dangerLevel); // Log the current danger level
  }, [dangerLevel]);

  useEffect(() => {
    updateDangerLevel();
  }, [
    userEngagement,
    backgroundMusic,
    callStatus,
    movement,
    sound,
    updateDangerLevel,
  ]);

  const data = [
    {
      label: 'Engagement',
      value: userEngagement ? 1 : 0,
      color: 'rgba(255, 0, 0, 1)',
    },
    {
      label: 'Music',
      value: backgroundMusic ? 1 : 0,
      color: 'rgba(0, 255, 0, 1)',
    },
    {label: 'Call', value: callStatus ? 1 : 0, color: 'rgba(0, 0, 255, 1)'},
    {label: 'Movement', value: movement ? 1 : 0, color: 'rgba(255, 255, 0, 1)'},
    {label: 'Sound', value: sound ? 1 : 0, color: 'rgba(255, 0, 255, 1)'},
  ];

  const barWidth = (screenWidth - 40) / data.length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monitoring</Text>
      <UserEngagementDetectorTest setUserEngagement={setUserEngagement} />
      <BackgroundMusicComponentTest setBackgroundMusic={setBackgroundMusic} />
      <CallStatusComponentTest setCallStatus={setCallStatus} />
      <MovementComponentTest setMovement={setMovement} />
      <SoundComponentTest setSound={setSound} />
      <Text style={[styles.dangerText, {marginBottom: 20}]}>
        Danger Level: {dangerLevel}
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
                {item.value}
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
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333', // Dark color for better visibility
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
