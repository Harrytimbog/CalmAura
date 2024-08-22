// App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import MonitoringScreen from './screens/MonitoringScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="CalmAura" component={HomeScreen} />
        <Stack.Screen name="Dashboard" component={MonitoringScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
