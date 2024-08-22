import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, AppState, StyleSheet} from 'react-native';
import checkIfPhoneIsLocked from './PhoneLockStatus';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMobileAlt} from '@fortawesome/free-solid-svg-icons';

const UserEngagementDetectorTest = ({setUserEngagement}) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);

  const handleAppStateChange = useCallback(
    async nextAppState => {
      if (nextAppState === 'active') {
        setUserEngagement(false);
        setIsPhoneLocked(false);
      } else if (nextAppState === 'inactive') {
        setUserEngagement(true);
      } else if (nextAppState === 'background') {
        const locked = await checkIfPhoneIsLocked();
        setIsPhoneLocked(locked);
        setUserEngagement(!locked);
      }
      setAppState(nextAppState);
    },
    [setUserEngagement],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={faMobileAlt} size={16} color="#900" />
      </View>

      <Text style={styles.text}>
        USER INTERACTION STATUS:{' '}
        {isPhoneLocked ? 'Phone is locked' : 'User is focused on the app'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
    // borderWidth: 2,
    // borderColor: '#000',
    backgroundColor: '#d3d3d3',
    opacity: 0.5,
    borderRadius: 10,
    padding: 20,
    marginVertical: 8,
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
    color: 'black', // Dark color for better visibility
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  text: {
    // color: '#900',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserEngagementDetectorTest;
