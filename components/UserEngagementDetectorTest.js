import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, AppState} from 'react-native';
import checkIfPhoneIsLocked from './PhoneLockStatus';

const UserEngagementDetectorTest = ({setUserEngagement}) => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);

  const handleAppStateChange = useCallback(
    async nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
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
    [appState, setUserEngagement],
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
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>
        User Engagement Status:{' '}
        {isPhoneLocked ? 'Phone is locked' : 'User is focused on the app'}
      </Text>
    </View>
  );
};

export default UserEngagementDetectorTest;
