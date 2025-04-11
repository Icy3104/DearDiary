import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  location: { latitude: number; longitude: number };
  date: string;
  caption: string;
}

// Function to save an entry
export const saveEntry = async (entry: TravelEntry): Promise<void> => {
  try {
    const storedEntries = await AsyncStorage.getItem('travelEntries');
    const entries = storedEntries ? JSON.parse(storedEntries) : [];

    entries.push(entry);

    await AsyncStorage.setItem('travelEntries', JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entry:', error);
  }
};

// Function to get all saved entries
export const getEntries = async (): Promise<TravelEntry[]> => {
  try {
    const storedEntries = await AsyncStorage.getItem('travelEntries');
    return storedEntries ? JSON.parse(storedEntries) : [];
  } catch (error) {
    console.error('Error retrieving entries:', error);
    return [];
  }
};

// Function to delete an entry by ID
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const storedEntries = await AsyncStorage.getItem('travelEntries');
    const entries = storedEntries ? JSON.parse(storedEntries) : [];

    const filteredEntries = entries.filter((entry: TravelEntry) => entry.id !== id);

    await AsyncStorage.setItem('travelEntries', JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};

// Function to clear all entries
export const clearAllEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('travelEntries');
  } catch (error) {
    console.error('Error clearing entries:', error);
  }
};

export default {
  saveEntry,
  getEntries,
  deleteEntry,
  clearAllEntries,
};
