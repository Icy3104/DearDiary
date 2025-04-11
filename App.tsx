import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Appnavigator from './Navigator/Appnavigator'; // now handles AddEntry + Home

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Appnavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
