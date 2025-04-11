import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TravelEntry {
  id: string;
  imageUri: string;
  address: string;
  location: { latitude: number; longitude: number };
  date: string;
  caption: string;
}

// Simplified storage with minimal operations
export const saveEntry = async (entry: TravelEntry): Promise<void> => {
  try {
    // Get current entries
    const currentEntriesStr = await AsyncStorage.getItem('travelEntries');
    let entries = [];
    
    // Parse if exists
    if (currentEntriesStr) {
      entries = JSON.parse(currentEntriesStr);
    }
    
    // Add new entry
    entries.push(entry);
    
    // Save back to storage
    const entriesStr = JSON.stringify(entries);
    await AsyncStorage.setItem('travelEntries', entriesStr);
    
    console.log('Entry saved successfully:', entry.id);
  } catch (error) {
    console.error('STORAGE ERROR:', error);
    throw error;
  }
};

export const getEntries = async (): Promise<TravelEntry[]> => {
  try {
    const entriesStr = await AsyncStorage.getItem('travelEntries');
    if (!entriesStr) return [];
    return JSON.parse(entriesStr);
  } catch (error) {
    console.error('Error retrieving entries:', error);
    return [];
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const entriesStr = await AsyncStorage.getItem('travelEntries');
    if (!entriesStr) return;
    
    const entries = JSON.parse(entriesStr);
    const filteredEntries = entries.filter((entry: TravelEntry) => entry.id !== id);
    
    await AsyncStorage.setItem('travelEntries', JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting entry:', error);
  }
};

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