import React, {useEffect, useState} from 'react';
import {View, Text, PermissionsAndroid, Platform} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const CallStatusComponentTest = ({setCallStatus}) => {
  const [callStatus, setLocalCallStatus] = useState('No call detected');
  const [callDetector, setCallDetector] = useState(null);

  useEffect(() => {
    const requestPermission = async () => {
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
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.PHONE);
        if (result !== RESULTS.GRANTED) {
          const res = await request(PERMISSIONS.IOS.PHONE);
          return res === RESULTS.GRANTED;
        }
        return true;
      }
      return false;
    };

    const startCallDetection = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      const detector = new CallDetectorManager((event, number) => {
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
        setLocalCallStatus(statusMessage);
        setCallStatus(statusMessage !== 'No call detected');
      }, true);

      setCallDetector(detector);
    };

    startCallDetection(); // Start detection on mount

    return () => {
      if (callDetector) {
        callDetector.dispose();
      }
    };
  }, [callDetector, setCallStatus]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Call Status: {callStatus}</Text>
    </View>
  );
};

export default CallStatusComponentTest;
