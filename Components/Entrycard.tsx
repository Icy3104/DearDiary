import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { TravelEntry } from '../Utils/Storage';
import { useThemeContext } from '../Context/Themecontext';

interface Props {
  entry: TravelEntry;
  onRemove: (id: string) => void;
}

const Entrycard: React.FC<Props> = ({ entry, onRemove }) => {
  const { theme } = useThemeContext();

  return (
    <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#1c1c1c' : '#f0f0f0' }]}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <Text style={[styles.address, { color: theme === 'dark' ? '#fff' : '#000' }]}>{entry.address}</Text>
      {entry.caption && (
        <Text style={[styles.caption, { color: theme === 'dark' ? '#ddd' : '#333' }]}>
          {entry.caption}
        </Text>
      )}
      <Text style={[styles.date, { color: theme === 'dark' ? '#ccc' : '#555' }]}>
        {new Date(entry.date).toLocaleString()}
      </Text>
      <Button title="Remove" onPress={() => onRemove(entry.id)} />
    </View>
  );
};

export default Entrycard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
  },
  caption: {
    fontSize: 15,
    paddingHorizontal: 8,
  },
  date: {
    fontSize: 14,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});