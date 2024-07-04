import React, {useEffect, useState} from 'react';
import {View, Text, AppState, PermissionsAndroid, Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {NativeModules} from 'react-native';

const {UsageStats} = NativeModules;

const CameraUsageTestComponent = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [cameraInUse, setCameraInUse] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.PACKAGE_USAGE_STATS,
          {
            title: 'Usage Stats Permission',
            message:
              'App needs access to your usage stats to detect camera usage.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else if (Platform.OS === 'ios') {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        setCameraPermission(result === RESULTS.GRANTED);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    const checkCameraUsage = async () => {
      try {
        const inUse = await UsageStats.isCameraInUse();
        console.log(`Camera in use: ${inUse}`);
        setCameraInUse(inUse);
      } catch (error) {
        console.error('Error checking camera usage:', error);
      }
    };

    const handleAppStateChange = async nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
      } else if (nextAppState === 'inactive') {
        console.log('App is inactive');
      } else if (nextAppState === 'background') {
        console.log('App has gone to the background!');
      }
      setAppState(nextAppState);
      checkCameraUsage(); // Check device info whenever app state changes
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (appState === 'active') {
        checkCameraUsage();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [appState]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>
        Camera Usage Status:{' '}
        {cameraInUse ? 'Camera is in use' : 'Camera is not in use'}
      </Text>
    </View>
  );
};

export default CameraUsageTestComponent;
