import React from 'react';
import * as Location from 'expo-location';

export const getCurrentLocation = async (): Promise<Location.LocationObject | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.error('Location permission not granted');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    
    return location;
  } catch (error) {
    console.error('Error getting location', error);
    return null;
  }
};

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (reverseGeocode.length > 0) {
      const address = reverseGeocode[0];
      return [
        address.name,
        address.street,
        address.city,
        address.region,
        address.country
      ].filter(Boolean).join(', ');
    }
    
    return 'Unknown location';
  } catch (error) {
    console.error('Error getting address', error);
    return 'Address unavailable';
  }
};

const LocationService: React.FC = () => {
  return null; 
};

export default LocationService;