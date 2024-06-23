// components/SoundComponentTest.js
import React, {useState, useEffect} from 'react';
import {View, Text, Button, PermissionsAndroid, Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const audioRecorderPlayer = new AudioRecorderPlayer();

const SoundComponentTest = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
    };
  }, []);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'App needs access to your microphone to record audio.',
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
    const result = await audioRecorderPlayer.startRecorder();
    console.log(result); // Log the recorder start result

    audioRecorderPlayer.addRecordBackListener(e => {
      console.log('Recording: ', e); // Log the entire event object

      // Using currentPosition as a placeholder for sound level
      setSoundLevel(Math.random() * 100); // Mock sound level for demonstration
      return;
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log(result); // Log the recorder stop result
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
