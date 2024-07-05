import React, {useState, useEffect} from 'react';
import {View, Text, PermissionsAndroid, Platform} from 'react-native';
import Sound from 'react-native-sound-level';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const SoundComponentTest = ({setSound}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'App needs access to your microphone to detect sound levels.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        const result = await check(PERMISSIONS.IOS.MICROPHONE);
        if (result !== RESULTS.GRANTED) {
          const res = await request(PERMISSIONS.IOS.MICROPHONE);
          return res === RESULTS.GRANTED;
        }
        return true;
      }
      return false;
    };

    const startRecording = async () => {
      const hasPermission = await requestPermission();
      if (!hasPermission) return;

      setIsRecording(true);
      Sound.start();
      Sound.onNewFrame = data => {
        if (data && data.value !== undefined) {
          setSoundLevel(data.value); // Use the actual sound level
          setSound(true);
        }
      };
    };

    startRecording(); // Start recording on mount

    return () => {
      setIsRecording(false);
      Sound.stop();
      setSound(false);
    };
  }, [setSound]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Sound Level: {soundLevel.toFixed(2)} dB</Text>
    </View>
  );
};

export default SoundComponentTest;
