import React, { useState, useCallback } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { requestCameraPermission, requestLocationPermission, requestNotificationPermission } from '../Utils/Permissions';
import { getCurrentLocation, getAddressFromCoordinates } from '../Utils/Location';
import { saveEntry, TravelEntry } from '../Utils/Storage';
import * as Notifications from 'expo-notifications';
import { useThemeContext } from '../Context/ThemeContext';
import Togglethemebutton from '../Components/Togglethemebutton';

const Addentryscreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('Fetching address...');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [caption, setCaption] = useState<string>('');

  useFocusEffect(
    useCallback(() => {
      setImageUri(null);
      setAddress('Fetching address...');
      setLocation(null);
      setCaption('');
    }, [])
  );

  const handleTakePhoto = async () => {
    const hasCameraPermission = await requestCameraPermission();
    const hasLocationPermission = await requestLocationPermission();

    if (!hasCameraPermission || !hasLocationPermission) {
      Alert.alert('Permissions required', 'Please enable camera and location permissions.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);

      const loc = await getCurrentLocation();
      if (loc) {
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });

        const addr = await getAddressFromCoordinates(loc.coords.latitude, loc.coords.longitude);
        setAddress(addr);
      } else {
        setAddress('Unable to get location');
      }
    }
  };

  const handleSave = async () => {
    if (!imageUri || !location) {
      Alert.alert('Missing data', 'Please take a photo first.');
      return;
    }

    const hasNotificationPermission = await requestNotificationPermission();
    if (!hasNotificationPermission) {
      Alert.alert('Permission required', 'Notification permission is required to proceed.');
      return;
    }

    const newEntry: TravelEntry = {
      id: uuidv4(),
      imageUri,
      address,
      location,
      date: new Date().toISOString(),
      caption,
    };

    await saveEntry(newEntry);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Entry Saved!',
        body: 'Your travel entry has been added successfully.',
      },
      trigger: null,
    });

    navigation.navigate('Homescreen');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Togglethemebutton />
      <Button title="Take Photo" onPress={handleTakePhoto} />

      {imageUri && (
        <>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={[styles.address, { color: theme === 'dark' ? '#ccc' : '#000' }]}>{address}</Text>
          <TextInput
            placeholder="Add a caption..."
            placeholderTextColor={theme === 'dark' ? '#888' : '#888'}
            value={caption}
            onChangeText={setCaption}
            style={[
              styles.input,
              {
                color: theme === 'dark' ? '#fff' : '#000',
                backgroundColor: theme === 'dark' ? '#222' : '#fff',
                borderColor: theme === 'dark' ? '#555' : '#ccc',
              },
            ]}
          />
          <Button title="Save Entry" onPress={handleSave} />
        </>
      )}
    </View>
  );
};

export default Addentryscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  image: {
    width: '100%',
    height: 250,
    marginVertical: 16,
    borderRadius: 10,
  },
  address: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginBottom: 16,
  },
});
