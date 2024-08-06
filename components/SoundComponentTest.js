import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import Sound from 'react-native-sound-level';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {faMicrophone} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

const SoundComponentTest = ({setSound}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [soundLevel, setSoundLevel] = useState(-100); // Default to a very low value
  const soundThreshold = -30; // Define a threshold for significant sound detection
  const maxSoundLevel = 0; // Max sound level observed
  const minSoundLevel = -100; // Min sound level observed

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

  const normalizeSoundLevel = useCallback(
    level => {
      if (level < minSoundLevel) level = minSoundLevel;
      if (level > maxSoundLevel) level = maxSoundLevel;
      return (level - minSoundLevel) / (maxSoundLevel - minSoundLevel);
    },
    [minSoundLevel, maxSoundLevel],
  );

  const startRecording = useCallback(async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsRecording(true);
    Sound.start();
    Sound.onNewFrame = data => {
      if (data && data.value !== undefined) {
        const normalizedLevel = normalizeSoundLevel(data.value);
        setSoundLevel(data.value); // Use the actual sound level
        setSound(normalizedLevel);
      }
    };
  }, [setSound, normalizeSoundLevel]);

  useEffect(() => {
    startRecording(); // Start recording on mount

    return () => {
      setIsRecording(false);
      Sound.stop();
      setSound(0);
    };
  }, [startRecording, setSound]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={faMicrophone} size={16} color="#900" />
      </View>
      <View>
        <Text style={styles.secondaryText}>
          Sound Detected: {soundLevel > soundThreshold ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.primaryText}>
          Sound Level: {soundLevel.toFixed(2)} dB
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
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default SoundComponentTest;
