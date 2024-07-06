import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, AppState, StyleSheet} from 'react-native';
import checkIfPhoneIsLocked from './PhoneLockStatus';

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
      <Text style={styles.text}>
        User Engagement Status:{' '}
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
  },
  text: {
    color: '#333', // Dark color for better visibility
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UserEngagementDetectorTest;
