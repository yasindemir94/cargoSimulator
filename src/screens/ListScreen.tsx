import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ListStackParamList } from '../types/navigation';
import { useCargoStore, categories, weightBuckets } from '../store/cargoStore';
import { FlashList } from '@shopify/flash-list';

export default function ListScreen() {
  const { cargos, cleanCargos } = useCargoStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<ListStackParamList, 'List'>>();
  const data = cleanCargos.length > 0 ? cleanCargos : cargos;

  // Çoklu seçim ve price range state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchText, setSearchText] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sortOption, setSortOption] = useState<
    'price_asc' | 'price_desc' | 'kg_asc' | 'kg_desc' | null
  >(null);

  // Render süresi ölçümü
  const [renderStart, setRenderStart] = useState<number | null>(null);

  // Ölçüm için state
  const [measuredHeights, setMeasuredHeights] = useState<number[]>([]);
  const measuredCount = useRef(0);

  const avgItemHeight = useMemo(() => {
    if (measuredHeights.length === 0) return 120; // fallback
    const sum = measuredHeights.reduce((a, b) => a + b, 0);
    return Math.round(sum / measuredHeights.length);
  }, [measuredHeights]);

  // Toggle fonksiyonları
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat],
    );
  };

  const toggleWeight = (bucket: string) => {
    setSelectedWeights(prev =>
      prev.includes(bucket)
        ? prev.filter(b => b !== bucket)
        : [...prev, bucket],
    );
  };

  // Price input handler
  const handlePriceChange = (index: 0 | 1, value: string) => {
    const num = parseInt(value) || 0;
    const newRange: [number, number] = [...priceRange] as [number, number];
    newRange[index] = num;
    setPriceRange(newRange);
  };

  // Filtreleme ve sıralama
  const filteredData = useMemo(() => {
    setRenderStart(Date.now());

    let filtered = data.filter(item => {
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.category)
      )
        return false;

      if (selectedWeights.length > 0) {
        const kg = item.kg;
        if (kg == null) return false;
        const matched = selectedWeights.some(bucket => {
          const [min, max] = bucket.split('-').map(Number);
          return kg >= min && kg <= max;
        });
        if (!matched) return false;
      }

      if (item.price < priceRange[0] || item.price > priceRange[1])
        return false;
      if (searchText && !item.name.includes(searchText)) return false;

      return true;
    });

    if (sortOption) {
      filtered.sort((a, b) => {
        switch (sortOption) {
          case 'price_asc':
            return (a.price ?? 0) - (b.price ?? 0);
          case 'price_desc':
            return (b.price ?? 0) - (a.price ?? 0);
          case 'kg_asc':
            return (a.kg ?? 0) - (b.kg ?? 0);
          case 'kg_desc':
            return (b.kg ?? 0) - (a.kg ?? 0);
        }
        return 0;
      });
    }

    return filtered;
  }, [
    data,
    selectedCategories,
    selectedWeights,
    priceRange,
    searchText,
    sortOption,
  ]);

  return (
    <View style={styles.container}>
      {/* 🔍 Arama */}
      <TextInput
        placeholder="Search by name (case-sensitive)"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchBox}
      />

      {/* Filtre toggle */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setFiltersVisible(!filtersVisible)}
      >
        <Text style={styles.toggleBtnText}>
          {filtersVisible ? '▲ Hide Filters' : '▼ Show Filters'}
        </Text>
      </TouchableOpacity>

      {/* Filtre alanı */}
      {filtersVisible && (
        <View style={styles.filterContainer}>
          {/* Kategori filtre */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.filterRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => toggleCategory(cat)}
                style={[
                  styles.filterBtn,
                  selectedCategories.includes(cat) && styles.filterBtnActive,
                ]}
              >
                <Text
                  style={{
                    color: selectedCategories.includes(cat) ? '#fff' : '#333',
                    fontWeight: selectedCategories.includes(cat)
                      ? '600'
                      : '400',
                  }}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Kilo bucket filtre */}
          <Text style={styles.sectionTitle}>Weight Buckets</Text>
          <View style={styles.filterRow}>
            {weightBuckets.map(bucket => (
              <TouchableOpacity
                key={bucket}
                onPress={() => toggleWeight(bucket)}
                style={[
                  styles.filterBtn,
                  selectedWeights.includes(bucket) && styles.filterBtnActive,
                ]}
              >
                <Text
                  style={{
                    color: selectedWeights.includes(bucket) ? '#fff' : '#333',
                    fontWeight: selectedWeights.includes(bucket)
                      ? '600'
                      : '400',
                  }}
                >
                  {bucket} kg
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Fiyat aralığı input */}
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TextInput
              style={[styles.searchBox, { flex: 1 }]}
              keyboardType="numeric"
              value={priceRange[0].toString()}
              onChangeText={val => handlePriceChange(0, val)}
              placeholder="Min"
            />
            <TextInput
              style={[styles.searchBox, { flex: 1 }]}
              keyboardType="numeric"
              value={priceRange[1].toString()}
              onChangeText={val => handlePriceChange(1, val)}
              placeholder="Max"
            />
          </View>

          {/* Sıralama */}
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.filterRow}>
            <TouchableOpacity
              onPress={() =>
                setSortOption(
                  sortOption === 'price_asc' ? 'price_desc' : 'price_asc',
                )
              }
              style={[
                styles.filterBtn,
                sortOption?.includes('price') && styles.filterBtnActive,
              ]}
            >
              <Text
                style={{
                  color: sortOption?.includes('price') ? '#fff' : '#333',
                }}
              >
                Price{' '}
                {sortOption === 'price_asc'
                  ? '↑'
                  : sortOption === 'price_desc'
                  ? '↓'
                  : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                setSortOption(sortOption === 'kg_asc' ? 'kg_desc' : 'kg_asc')
              }
              style={[
                styles.filterBtn,
                sortOption?.includes('kg') && styles.filterBtnActive,
              ]}
            >
              <Text
                style={{ color: sortOption?.includes('kg') ? '#fff' : '#333' }}
              >
                Weight{' '}
                {sortOption === 'kg_asc'
                  ? '↑'
                  : sortOption === 'kg_desc'
                  ? '↓'
                  : ''}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reset Filters */}
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: '#dc3545' }]}
            onPress={() => {
              setSelectedCategories([]);
              setSelectedWeights([]);
              setPriceRange([0, 1000]);
              setSearchText('');
              setSortOption(null);
            }}
          >
            <Text style={styles.toggleBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ⚡ FlashList */}
      <FlashList
        data={filteredData}
        keyExtractor={(item, index) => item.id ?? String(index)}
        contentContainerStyle={{ paddingVertical: 10 }}
        estimatedItemSize={avgItemHeight}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail', { cargo: item })}
            style={[
              styles.card,
              item.status === null || item.kg === null || item.price < 0
                ? styles.cardDirty
                : {},
            ]}
            onLayout={e => {
              if (measuredCount.current < 10) {
                const { height } = e.nativeEvent.layout;
                setMeasuredHeights(prev => [...prev, height]);
                measuredCount.current += 1;
              }
            }}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>
              {item.category} • {item.price}₺ • {item.kg ?? 'null'}kg
            </Text>
            <Text style={styles.cardStatus}>
              Status: {item.status ?? 'null'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No results found
          </Text>
        }
        onLoad={() => {
          if (renderStart) {
            const duration = Date.now() - renderStart;
            console.log(`⚡ FlashList render süresi: ${duration} ms`);
          }
        }}
      />

      {/* Sayaç */}
      <Text style={styles.counter}>
        Total: {data.length} | Filtered: {filteredData.length} | AvgItem:{' '}
        {avgItemHeight}px
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f9f9f9' },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  toggleBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#007bff',
    alignItems: 'center',
    marginBottom: 10,
  },
  toggleBtnText: { color: '#fff', fontWeight: '600' },
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: '600', marginVertical: 6, fontSize: 15 },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterBtnActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  card: {
    backgroundColor: '#fff',
    marginVertical: 6,
    marginHorizontal: 2,
    padding: 12,
    borderRadius: 12,
  },
  cardDirty: { backgroundColor: '#ffe5e5' },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#666' },
  cardStatus: { fontSize: 13, color: '#444', marginTop: 4 },
  counter: { textAlign: 'center', marginTop: 10, fontWeight: '600' },
});
