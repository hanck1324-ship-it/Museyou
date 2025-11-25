import { create } from 'zustand';
import { Performance } from '@/components/performances/PerformanceCard';

interface PerformanceState {
  performances: Performance[];
  selectedPerformance: Performance | null;
  setPerformances: (performances: Performance[]) => void;
  setSelectedPerformance: (performance: Performance | null) => void;
  filters: {
    searchQuery: string;
    district: string;
    category: string;
    priceRange: string;
    dateFilter: string;
  };
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
}

export const usePerformanceStore = create<PerformanceState>((set) => ({
  performances: [],
  selectedPerformance: null,
  setPerformances: (performances) => set({ performances }),
  setSelectedPerformance: (performance) => set({ selectedPerformance: performance }),
  filters: {
    searchQuery: '',
    district: 'all',
    category: 'all',
    priceRange: 'all',
    dateFilter: 'all',
  },
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () =>
    set({
      filters: {
        searchQuery: '',
        district: 'all',
        category: 'all',
        priceRange: 'all',
        dateFilter: 'all',
      },
    }),
}));


