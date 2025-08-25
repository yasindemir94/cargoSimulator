import 'react-native-get-random-values';
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { RawCargo } from "../types/cargo";

interface Metrics {
  generationTime: number | null;
  cleaningTime: number | null;
}

interface CargoState {
  cargos: RawCargo[];
  cleanCargos: RawCargo[];
  metrics: Metrics;
  createData: (count: number) => void;
  cleanData: () => void;
  reset: () => void;
}

export const categories = [
  "electronics", "cleaning", "apparel", "food", "books",
  "cosmetics", "home-living", "toys", "sports",
];

export const weightBuckets = [
  "1-5","5-10","10-15","15-20","20-25","25-30","30-35","35-40"
];

const statuses = [
  "PREPARING", "AT_BRANCH", "OUT_FOR_DELIVERY",
  "DELIVERED", "DELIVERY_FAILED",
];

const randomName = () =>
  Math.random().toString(36).substring(2, 10) +
  Math.random().toString(36).substring(2, 6);

export const useCargoStore = create<CargoState>((set, get) => ({
  cargos: [],
  cleanCargos: [],
  metrics: { generationTime: null, cleaningTime: null },

  createData: (count: number) => {
    const start = Date.now();
    const data: RawCargo[] = [];

    for (let i = 0; i < count; i++) {
      let status = statuses[Math.floor(Math.random() * statuses.length)] as RawCargo["status"];
      let kg: number | null = Math.floor(Math.random() * 40) + 1;
      let price = Math.floor(Math.random() * 1000);

      if (Math.random() < 0.05) status = null;      // %5 status null
      if (Math.random() < 0.10) kg = null;          // %10 kg null
      if (Math.random() < 0.10) price = -Math.floor(Math.random() * 100); // %10 negatif fiyat

      data.push({
        id: uuidv4(), // 👈 burada UUID v4 üretiyoruz
        name: randomName(),
        category: categories[Math.floor(Math.random() * categories.length)],
        price,
        status,
        kg,
        createdAt: Date.now(),
      });
    }

    const duration = Date.now() - start;
    console.log("Generation took:", duration, "ms");

    set({ cargos: data, cleanCargos: [], metrics: { ...get().metrics, generationTime: duration } });
  },

  cleanData: () => {
    const start = Date.now();
    const filtered = get().cargos.filter(
      (c) => c.status !== null && c.kg !== null && c.price >= 0
    );
    const duration = Date.now() - start;
    console.log("Cleaning took:", duration, "ms");
    set({ cleanCargos: filtered, metrics: { ...get().metrics, cleaningTime: duration } });
  },

  reset: () => {
    set({ cargos: [], cleanCargos: [], metrics: { generationTime: null, cleaningTime: null } });
  },
}));
