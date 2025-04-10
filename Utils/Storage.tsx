import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  date: string;
}

const STORAGE_KEY = 'travel_entries';

export const saveEntry = async (entry: TravelEntry): Promise<void> => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEY);
    let entries: TravelEntry[] = entriesJson ? JSON.parse(entriesJson) : [];
    
    entries.push(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entry', error);
    throw error;
  }
};

export const getEntries = async (): Promise<TravelEntry[]> => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (error) {
    console.error('Error getting entries', error);
    return [];
  }
};

export const removeEntry = async (id: string): Promise<void> => {
  try {
    const entriesJson = await AsyncStorage.getItem(STORAGE_KEY);
    let entries: TravelEntry[] = entriesJson ? JSON.parse(entriesJson) : [];
    
    entries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error removing entry', error);
    throw error;
  }
};

const Storage: React.FC = () => {
  return null; 
};

export default Storage;