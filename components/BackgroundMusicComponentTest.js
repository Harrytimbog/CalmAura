import {faMusic} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
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
    checkIfMusicPlaying();
    const intervalId = setInterval(() => {
      checkIfMusicPlaying();
    }, 1000); // Check every second

    return () => clearInterval(intervalId);
  }, [checkIfMusicPlaying]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={faMusic} size={16} color="#900" />
      </View>
      <View>
        <Text style={styles.primaryText}>
          Is Music Playing: {isMusicPlaying ? 'Yes' : 'No'}
        </Text>
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
    marginBottom: 8,
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

export default BackgroundMusicComponentTest;
