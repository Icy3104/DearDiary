import React, { useEffect, useState } from 'react';
import { View, FlatList, Button, StyleSheet, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { TravelEntry, getEntries, deleteEntry } from '../Utils/Storage';
import Entrycard from '../Components/Entrycard';
import { useThemeContext } from '../Context/ThemeContext';
import Togglethemebutton from '../Components/Togglethemebutton';

const Homescreen: React.FC = () => {
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const navigation = useNavigation();
  const { theme } = useThemeContext();

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
    await deleteEntry(id);
    loadEntries();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#fff' }]}>
      <Togglethemebutton />
      <Button title="Add New Entry" onPress={() => navigation.navigate('AddEntry' as never)} />
      {entries.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme === 'dark' ? '#ccc' : '#888' }]}>
          No entries yet. Start your travel diary!
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
