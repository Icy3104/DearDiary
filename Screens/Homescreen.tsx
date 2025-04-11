import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TravelEntry, getEntries, deleteEntry } from '../Utils/Storage'; // ✅ Corrected here
import Entrycard from '../Components/Entrycard';

const Homescreen: React.FC = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const navigation = useNavigation();

  const loadEntries = async () => {
    const storedEntries = await getEntries();
    setEntries(storedEntries.reverse());
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const handleRemoveEntry = async (id: string) => {
    await deleteEntry(id); // ✅ Updated to match Storage.tsx
    loadEntries(); // Refresh after deletion
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Entry" onPress={() => navigation.navigate('AddEntry' as never)} />
      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries yet. Start your travel diary!</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Entrycard entry={item} onRemove={handleRemoveEntry} />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  list: {
    paddingVertical: 8,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});
