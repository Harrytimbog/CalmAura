// components/CallStatusTest.js
import React, {useEffect, useState} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const CallStatusTest = () => {
  const [callStatus, setCallStatus] = useState('No call detected');
  const [callDetector, setCallDetector] = useState(null);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (callDetector) {
        callDetector.dispose();
        console.log('Call detector disposed');
      }
    };
  }, [callDetector]);

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          {
            title: 'Phone State Permission',
            message:
              'App needs access to your phone state to detect call status.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log('Android permission granted:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.PHONE);
        console.log('iOS permission check result:', result);
        if (result !== RESULTS.GRANTED) {
          const res = await request(PERMISSIONS.IOS.PHONE);
          console.log('iOS permission request result:', res);
          return res === RESULTS.GRANTED;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };

  const startCallDetection = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log('Permission denied by user');
      return;
    }

    console.log('Starting call detection...');
    const detector = new CallDetectorManager((event, number) => {
      console.log('Call event:', event, 'Phone number:', number);
      let statusMessage = 'No call detected';
      switch (event) {
        case 'Incoming':
          statusMessage = 'Incoming call from ' + number;
          break;
        case 'Offhook':
          statusMessage = 'Call active (Offhook)';
          break;
        case 'Missed':
          statusMessage = 'Missed call from ' + number;
          break;
        case 'Disconnected':
          statusMessage = 'Call disconnected';
          break;
        default:
          statusMessage = 'Unknown call event';
      }
      setCallStatus(statusMessage);
    }, true);

    setCallDetector(detector);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Call Status: {callStatus}</Text>
      <Button title="Start Call Detection" onPress={startCallDetection} />
    </View>
  );
};

export default CallStatusTest;
