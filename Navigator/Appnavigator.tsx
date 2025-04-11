import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Addentryscreen from '../Screens/Addentryscreen';
import Homescreen from '../Screens/Homescreen';

const Stack = createStackNavigator();

const Appnavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Homescreen} options={{ headerTitle: 'Travel Diary' }} />
      <Stack.Screen name="AddEntry" component={Addentryscreen} options={{ headerTitle: 'Add Entry' }} />
    </Stack.Navigator>
  );
};

export default Appnavigator;
