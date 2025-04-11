import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import Appnavigator from './Navigator/Appnavigator';
import { ThemeProvider, useThemeContext } from './Context/ThemeContext';

const ThemedApp = () => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer>
        <Appnavigator />
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
