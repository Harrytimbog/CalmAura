import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, NativeModules} from 'react-native';

const {AudioFocusModule} = NativeModules;

const BackgroundMusicComponentTest = ({setBackgroundMusic}) => {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const checkIfMusicPlaying = useCallback(() => {
    AudioFocusModule.isAudioPlaying(isPlaying => {
      setIsMusicPlaying(isPlaying);
      setBackgroundMusic(isPlaying);
    });
  }, [setBackgroundMusic]);

  useEffect(() => {
    checkIfMusicPlaying(); // Trigger detection on mount
  }, [checkIfMusicPlaying]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Is Music Playing: {isMusicPlaying ? 'Yes' : 'No'}</Text>
    </View>
  );
};

export default BackgroundMusicComponentTest;
