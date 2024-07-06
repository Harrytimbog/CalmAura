import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, NativeModules, StyleSheet} from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.text}>
        Is Music Playing: {isMusicPlaying ? 'Yes' : 'No'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#333', // Dark color for better visibility
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BackgroundMusicComponentTest;
