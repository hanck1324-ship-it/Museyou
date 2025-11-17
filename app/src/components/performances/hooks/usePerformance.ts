import { useState, useEffect, useMemo } from 'react';
import { Performance } from '../PerformanceCard';
import { performanceApi, seedData } from '../../../../lib/api/api';
import { toast } from 'sonner';

interface UsePerformanceProps {
  isDataSeeded: boolean;
  setIsDataSeeded: (value: boolean) => void;
  samplePerformances: Performance[];
}

export function usePerformance({ isDataSeeded, setIsDataSeeded, samplePerformances }: UsePerformanceProps) {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [selectedPerformance, setSelectedPerformance] = useState<Performance | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  // Load performances data
  const loadPerformances = async () => {
    try {
      const perfData = await performanceApi.getAll();
      if (perfData.performances && perfData.performances.length > 0) {
        setPerformances(perfData.performances);
        setIsDataSeeded(true);
      } else {
        await handleSeedData();
      }
    } catch (error) {
      console.error('Error loading performances:', error);
      setPerformances(samplePerformances);
    }
  };

  const handleSeedData = async () => {
    if (isDataSeeded) return;
    
    try {
      const result = await seedData({
        performances: samplePerformances,
        promotions: [],
        coupleSpots: [],
      });

      if (result.success) {
        setPerformances(samplePerformances);
        setIsDataSeeded(true);
        toast.success('데이터가 로드되었습니다!');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setPerformances(samplePerformances);
    }
  };

  // Filter performances
  const filteredPerformances = useMemo(() => {
    return performances.filter((perf) => {
      // Search query filter
      if (searchQuery && !perf.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !perf.venue.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // District filter
      if (selectedDistrict !== 'all' && perf.district !== selectedDistrict) {
        return false;
      }
      
      // Category filter
      if (selectedCategory !== 'all' && perf.category !== selectedCategory) {
        return false;
      }
      
      // Price range filter
      if (selectedPriceRange !== 'all') {
        // TODO: Implement price range filtering logic
      }
      
      // Date filter
      if (selectedDateFilter !== 'all') {
        // TODO: Implement date filtering logic
      }
      
      return true;
    });
  }, [performances, searchQuery, selectedDistrict, selectedCategory, selectedPriceRange, selectedDateFilter]);

  // Open performance detail
  const openDetail = (performance: Performance) => {
    setSelectedPerformance(performance);
    setDetailOpen(true);
  };

  // Close performance detail
  const closeDetail = () => {
    setDetailOpen(false);
    setSelectedPerformance(null);
  };

  return {
    // State
    performances,
    filteredPerformances,
    selectedPerformance,
    detailOpen,
    searchQuery,
    selectedDistrict,
    selectedCategory,
    selectedPriceRange,
    selectedDateFilter,
    
    // Actions
    setPerformances,
    setSearchQuery,
    setSelectedDistrict,
    setSelectedCategory,
    setSelectedPriceRange,
    setSelectedDateFilter,
    openDetail,
    closeDetail,
    loadPerformances,
  };
}

