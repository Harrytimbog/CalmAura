import {faPhone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
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
      if (!hasPermission) {
        console.log('Permission denied for phone state');
        return;
      }

      try {
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
      } catch (error) {
        console.error('Error starting call detection:', error);
      }
    };

    startCallDetection(); // Start detection on mount

    return () => {
      if (callDetector) {
        try {
          callDetector.dispose();
        } catch (error) {
          console.error('Error disposing call detector:', error);
        }
      }
    };
  }, [setCallStatus, callDetector]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={faPhone} size={16} color="#900" />
      </View>
      <View>
        <Text style={styles.secondaryText}>Call Status</Text>
        <Text style={styles.primaryText}>{callStatus}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#d3d3d3',
    opacity: 0.5,
    padding: 20,
  },
  iconWrapper: {
    backgroundColor: '#a9a9a9',
    padding: 5,
    borderRadius: 3,
  },
  secondaryText: {
    color: '#900', // Dark color for better visibility
    fontSize: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  primaryText: {
    color: '#900', // Dark color for better visibility
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default CallStatusComponentTest;
