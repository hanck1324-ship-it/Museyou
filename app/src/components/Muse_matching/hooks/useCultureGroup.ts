import { useState, useEffect } from 'react';
import { CoupleSpot } from '../MuseSpotCard';
import { coupleSpotApi, seedData } from '../../../../lib/api/api';
import { toast } from 'sonner';

interface UseCultureGroupProps {
  isDataSeeded: boolean;
  setIsDataSeeded: (value: boolean) => void;
  sampleCoupleSpots: CoupleSpot[];
}

export function useCultureGroup({ isDataSeeded, setIsDataSeeded, sampleCoupleSpots }: UseCultureGroupProps) {
  const [coupleSpots, setCoupleSpots] = useState<CoupleSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<CoupleSpot | null>(null);
  const [spotDetailOpen, setSpotDetailOpen] = useState(false);

  // Load couple spots
  const loadCoupleSpots = async () => {
    try {
      const spotData = await coupleSpotApi.getAll();
      if (spotData.spots) {
        setCoupleSpots(spotData.spots);
      } else {
        await handleSeedData();
      }
    } catch (error) {
      console.error('Error loading couple spots:', error);
      setCoupleSpots(sampleCoupleSpots);
    }
  };

  const handleSeedData = async () => {
    if (isDataSeeded) return;
    
    try {
      const result = await seedData({
        performances: [],
        promotions: [],
        coupleSpots: sampleCoupleSpots,
      });

      if (result.success) {
        setCoupleSpots(sampleCoupleSpots);
        setIsDataSeeded(true);
        toast.success('데이터가 로드되었습니다!');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setCoupleSpots(sampleCoupleSpots);
    }
  };

  // Open spot detail
  const openSpotDetail = (spot: CoupleSpot) => {
    setSelectedSpot(spot);
    setSpotDetailOpen(true);
  };

  // Close spot detail
  const closeSpotDetail = () => {
    setSpotDetailOpen(false);
    setSelectedSpot(null);
  };

  return {
    // State
    coupleSpots,
    selectedSpot,
    spotDetailOpen,
    
    // Actions
    setCoupleSpots,
    openSpotDetail,
    closeSpotDetail,
    loadCoupleSpots,
  };
}


