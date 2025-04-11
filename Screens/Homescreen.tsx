import React, { useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TravelEntry, getEntries, deleteEntry } from '../Utils/Storage';
import Entrycard from '../Components/Entrycard';
import { useThemeContext } from '../Context/Themecontext';
import Togglethemebutton from '../Components/Togglethemebutton';

const Homescreen: React.FC = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const loadEntries = async () => {
    try {
      const storedEntries = await getEntries();
      setEntries(storedEntries.reverse());
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [])
  );

  const handleRemoveEntry = async (id: string) => {
    try {
      await deleteEntry(id);
      loadEntries();
    } catch (error) {
      console.error('Error removing entry:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Togglethemebutton />
      <Button title="Add New Entry" onPress={() => navigation.navigate('AddEntry' as never)} />
      {entries.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#888' }]}>
          No entries yet!
        </Text>
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
  },
  list: {
    paddingVertical: 8,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});