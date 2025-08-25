import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useCargoStore } from '../store/cargoStore';

export default function CreateScreen() {
  const { createData, cleanData, reset, cargos, cleanCargos } = useCargoStore();
  const [count, setCount] = useState('1000');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Cargo Data Generator</Text>

      {/* Input alanı */}
      <Text style={styles.label}>How many records?</Text>
      <TextInput
        value={count}
        onChangeText={setCount}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Enter count (e.g. 1000)"
        placeholderTextColor="#aaa"
      />

      {/* Butonlar */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.createBtn]}
          onPress={() => createData(Number(count))}
        >
          <Text style={styles.btnText}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.cleanBtn]}
          onPress={cleanData}
        >
          <Text style={styles.btnText}>Clean</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, styles.resetBtn]} onPress={reset}>
          <Text style={styles.btnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* İstatistik kutuları */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Raw</Text>
          <Text style={styles.statValue}>{cargos.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Clean Data</Text>
          <Text style={styles.statValue}>{cleanCargos.length}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6fa' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007bff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#333',
  },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createBtn: { backgroundColor: '#28a745' }, // yeşil
  cleanBtn: { backgroundColor: '#17a2b8' }, // mavi
  resetBtn: { backgroundColor: '#dc3545' }, // kırmızı
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  statBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
  },
  statLabel: { fontSize: 14, color: '#666' },
  statValue: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 4 },
});
