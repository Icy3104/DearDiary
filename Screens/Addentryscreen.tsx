import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { useThemeContext } from '../Context/Themecontext';
import Togglethemebutton from '../Components/Togglethemebutton';
import { saveEntry } from '../Utils/Storage';

// Set up notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Addentryscreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Request permissions when component mounts
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Camera Permission Required', 'Enable camera access in settings.');
      }

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus !== 'granted') {
        Alert.alert('Location Permission Required', 'Enable location access in settings.');
      }

      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        Alert.alert('Notification Permission Required', 'Enable notifications in settings.');
      }
    })();
  }, []);

  const handleTakePhoto = async () => {
    try {
      setLoading(true);

      // Check camera permission again before launch
      const { status } = await ImagePicker.getCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Access Denied', 'Please allow camera access in settings.');
        setLoading(false);
        return;
      }

      const cameraResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      console.log('Camera Result:', cameraResult);

      if (cameraResult.canceled || !cameraResult.assets || cameraResult.assets.length === 0) {
        setLoading(false);
        Alert.alert('Error', 'No image was captured. Please try again.');
        return;
      }

      const capturedImageUri = cameraResult.assets[0].uri;
      setImageUri(capturedImageUri);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 10000,
      });

      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      try {
        const addressResponse = await Location.reverseGeocodeAsync({ latitude, longitude });

        if (addressResponse && addressResponse.length > 0) {
          const addr = addressResponse[0];
          const formatted = [
            addr.name, addr.street, addr.district, addr.city, addr.region, addr.country,
          ].filter(Boolean).join(', ');

          setAddress(formatted || `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        } else {
          setAddress(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
        setAddress(`Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Camera/location error:', error);
      Alert.alert('Error', 'Failed to capture photo or fetch location. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Travel Entry Saved!',
          body: `Your travel memory at ${address} has been saved.`,
          data: { screen: 'Home' },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleSave = async () => {
    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please take a photo first');
      return;
    }

    try {
      setLoading(true);

      const newEntry = {
        id: uuidv4(),
        imageUri,
        address,
        location: location || { latitude: 0, longitude: 0 },
        date: new Date().toISOString(),
        caption,
      };

      await saveEntry(newEntry);
      await sendNotification();
      navigation.navigate('Home');
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Togglethemebutton />

      <View style={styles.photoButtonContainer}>
        <TouchableOpacity
          style={[
            styles.photoButton,
            { backgroundColor: theme === 'dark' ? '#333' : '#2196F3' },
          ]}
          onPress={handleTakePhoto}
          disabled={loading}
        >
          <Text style={styles.photoButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
          <Text style={{ color: theme === 'dark' ? '#fff' : '#000', marginTop: 10 }}>
            Processing...
          </Text>
        </View>
      )}

      {imageUri && (
        <View style={styles.resultContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />

          <View style={styles.infoContainer}>
            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000' }]}>
              Location:
            </Text>
            <Text style={[styles.addressText, { color: theme === 'dark' ? '#ddd' : '#333' }]}>
              {address || 'Unknown location'}
            </Text>

            {location && (
              <Text style={[styles.coordinatesText, { color: theme === 'dark' ? '#bbb' : '#666' }]}>
                Lat: {location.latitude.toFixed(6)}, Long: {location.longitude.toFixed(6)}
              </Text>
            )}

            <Text style={[styles.label, { color: theme === 'dark' ? '#fff' : '#000', marginTop: 16 }]}>
              Caption:
            </Text>
            <TextInput
              style={[
                styles.captionInput,
                {
                  backgroundColor: theme === 'dark' ? '#333' : '#fff',
                  color: theme === 'dark' ? '#fff' : '#000',
                }
              ]}
              placeholder="Add a caption..."
              placeholderTextColor={theme === 'dark' ? '#aaa' : '#999'}
              value={caption}
              onChangeText={setCaption}
              multiline
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: theme === 'dark' ? '#4caf50' : '#4caf50' }
              ]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  photoButtonContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photoButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
  },
  photoButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  resultContainer: {
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 14,
  },
  captionInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginTop: 8,
    marginBottom: 16,
  },
  saveButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Addentryscreen;
