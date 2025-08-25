import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ListStackParamList } from '../types/navigation';

type DetailRouteProp = RouteProp<ListStackParamList, 'Detail'>;

export default function DetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const { cargo } = route.params;

  const isDirty = (key: string, value: any) => {
    if (value === null) return true;
    if (key === 'price' && value < 0) return true;
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📦 Cargo Detail</Text>

        {Object.entries(cargo).map(([key, value]) => (
          <View key={key} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Text
              style={[styles.value, isDirty(key, value) && styles.dirtyValue]}
            >
              {String(value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#444',
  },
  value: {
    fontSize: 15,
    color: '#333',
  },
  dirtyValue: {
    color: 'red',
    fontWeight: '700',
  },
});
