import {NativeModules} from 'react-native';

const {PhoneLockStatus} = NativeModules;

const checkIfPhoneIsLocked = () => {
  return new Promise((resolve, reject) => {
    PhoneLockStatus.isPhoneLocked(isScreenOn => {
      resolve(!isScreenOn); // Resolve true if the phone is locked, false otherwise
    });
  });
};

export default checkIfPhoneIsLocked;
