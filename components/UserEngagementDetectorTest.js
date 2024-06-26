import React, {useState, useEffect} from 'react';
import {View, Text, AppState} from 'react-native';

const UserEngagementDetectorTest = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [userEngaged, setUserEngaged] = useState(false);
  const [isPhoneLocked, setIsPhoneLocked] = useState(false);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');
        setUserEngaged(false);
        setIsPhoneLocked(false);
      } else if (nextAppState === 'inactive') {
        console.log(
          'App is inactive (possibly during phone call or other transient state)',
        );
        setUserEngaged(true);
      } else if (nextAppState === 'background') {
        console.log('App has gone to the background!');
        setIsPhoneLocked(checkIfPhoneIsLocked());
        setUserEngaged(!checkIfPhoneIsLocked());
      }
      setAppState(nextAppState);
    };

    const checkIfPhoneIsLocked = () => {
      // This is a placeholder for the actual implementation to detect phone lock
      // The actual implementation depends on the capabilities of the libraries you are using
      return false; // Return true if phone is locked, false otherwise
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>
        User Engagement Status:{' '}
        {userEngaged
          ? 'User is Engaged in other activities'
          : 'User is focused on the app'}
      </Text>
      {isPhoneLocked && <Text>Phone is locked</Text>}
    </View>
  );
};

export default UserEngagementDetectorTest;
