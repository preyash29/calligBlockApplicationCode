import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import CallDetectorManager from 'react-native-call-detection';
import { check, PERMISSIONS, request } from 'react-native-permissions';

const CallBlockingApp = () => {
  const [blockedNumbers, setBlockedNumbers] = useState(['+919106864831']);
  
  useEffect(() => {
    requestCallPermission();
    startCallDetection();
    
    return () => {
      stopCallDetection();
    };
  }, []);

  const requestCallPermission = async () => {
    const permissionStatus = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);
    if (permissionStatus !== 'granted') {
      const result = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
      if (result !== 'granted') {
        // Handle permission denial
        ToastAndroid.show('Read phone state permission denied', ToastAndroid.SHORT);
      }
    }
  };

  const startCallDetection = () => {
    const callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        if (event === 'Incoming' && isNumberBlocked(phoneNumber)) {
          ToastAndroid.show(`Blocked call from ${phoneNumber}`, ToastAndroid.SHORT);
        }
      },
      true, // Enable call detection
      () => {}, // Callback when the service is connected
      () => {}  // Callback when the service is disconnected
    );
  };

  const stopCallDetection = () => {
    // Dispose the call detector when the component is unmounted
    callDetector && callDetector.dispose();
  };

  const isNumberBlocked = (phoneNumber) => {
    return blockedNumbers.includes(phoneNumber);
  };

  const toggleBlockNumber = (phoneNumber) => {
    if (isNumberBlocked(phoneNumber)) {
      setBlockedNumbers(blockedNumbers.filter(num => num !== phoneNumber));
      ToastAndroid.show(`Unblocked ${phoneNumber}`, ToastAndroid.SHORT);
    } else {
      setBlockedNumbers([...blockedNumbers, phoneNumber]);
      ToastAndroid.show(`Blocked ${phoneNumber}`, ToastAndroid.SHORT);
    }
  };

  return (
    <View>
      <Text>Blocked Numbers: {blockedNumbers.join(', ')}</Text>
      <TouchableOpacity onPress={() => toggleBlockNumber('+919106864831')}>
        <Text>Block Number</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallBlockingApp;