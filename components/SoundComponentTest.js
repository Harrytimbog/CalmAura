// components/SoundComponentTest.js
import React, {useState, useEffect} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
import Sound from 'react-native-sound-level';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const SoundComponentTest = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      Sound.stop();
    };
  }, []);

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
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Microphone permission denied');
        return false;
      }
    } else if (Platform.OS === 'ios') {
      const result = await check(PERMISSIONS.IOS.MICROPHONE);
      if (result !== RESULTS.GRANTED) {
        const res = await request(PERMISSIONS.IOS.MICROPHONE);
        if (res !== RESULTS.GRANTED) {
          console.log('Microphone permission denied');
          return false;
        }
      }
    }
    return true;
  };

  const startRecording = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsRecording(true);
    Sound.start();
    Sound.onNewFrame = data => {
      console.log('Sound level data: ', data);
      if (data && data.value !== undefined) {
        setSoundLevel(data.value); // Use the actual sound level
      }
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    Sound.stop();
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Sound Level: {soundLevel.toFixed(2)} dB</Text>
      <Button
        title={isRecording ? 'Stop Recording' : 'Start Recording'}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

export default SoundComponentTest;
