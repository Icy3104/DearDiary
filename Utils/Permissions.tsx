import React from 'react';
import { Platform } from 'react-native';
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';

export const requestCameraPermission = async (): Promise<boolean> => {
  const { status } = await Camera.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
};

export const requestNotificationPermission = async (): Promise<boolean> => {

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === 'granted';
};


export const checkAllPermissions = async (): Promise<{
  camera: boolean;
  location: boolean;
  notification: boolean;
  mediaLibrary: boolean;
}> => {
  const camera = await requestCameraPermission();
  const location = await requestLocationPermission();
  const notification = await requestNotificationPermission();
  const mediaLibrary = await requestMediaLibraryPermission();
  
  return {
    camera,
    location,
    notification,
    mediaLibrary
  };
};

const Permissions: React.FC = () => {
  return null; 
};

export default Permissions;