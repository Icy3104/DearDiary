import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TravelEntry } from '../Utils/Storage';

interface Props {
  entry: TravelEntry;
}

const Entrycard: React.FC<Props> = ({ entry }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: entry.imageUri }} style={styles.image} />
      <Text style={styles.address}>{entry.address}</Text>
      <Text style={styles.date}>{new Date(entry.date).toLocaleString()}</Text>
    </View>
  );
};

export default Entrycard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
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
  date: {
    fontSize: 14,
    color: '#555',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
