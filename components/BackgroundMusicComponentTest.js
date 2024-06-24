// components/BackgroundMusicComponentTest.js
import React, {useState} from 'react';
import {View, Text, Button, NativeModules} from 'react-native';

const {AudioFocusModule} = NativeModules;

const BackgroundMusicComponentTest = () => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const checkIfMusicPlaying = () => {
    AudioFocusModule.isAudioPlaying(isPlaying => {
      setIsMusicPlaying(isPlaying);
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Is Music Playing: {isMusicPlaying ? 'Yes' : 'No'}</Text>
      <Button title="Check Music Status" onPress={checkIfMusicPlaying} />
    </View>
  );
};

export default BackgroundMusicComponentTest;
