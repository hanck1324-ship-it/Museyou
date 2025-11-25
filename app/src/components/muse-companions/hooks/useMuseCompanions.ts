import { useState } from 'react';
import { MuseCompanion } from '../MuseCompanionCard';
import { museCompanionApi, seedData } from '../../../../lib/api/api';
import { toast } from 'sonner';

interface UseMuseCompanionsProps {
  isDataSeeded: boolean;
  setIsDataSeeded: (value: boolean) => void;
  sampleCompanionSpots: MuseCompanion[];
}

export function useMuseCompanions({ isDataSeeded, setIsDataSeeded, sampleCompanionSpots }: UseMuseCompanionsProps) {
  const [companionSpots, setCompanionSpots] = useState<MuseCompanion[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<MuseCompanion | null>(null);
  const [spotDetailOpen, setSpotDetailOpen] = useState(false);

  // Load Muse companion spots
  const loadCompanionSpots = async () => {
    try {
      const spotData = await museCompanionApi.getAll();
      if (spotData.spots) {
        setCompanionSpots(spotData.spots);
      } else {
        await handleSeedData();
      }
    } catch (error) {
      console.error('Error loading Muse companion spots:', error);
      setCompanionSpots(sampleCompanionSpots);
    }
  };

  const handleSeedData = async () => {
    if (isDataSeeded) return;
    
    try {
      const result = await seedData({
        performances: [],
        promotions: [],
        companionSpots: sampleCompanionSpots,
      });

      if (result.success) {
        setCompanionSpots(sampleCompanionSpots);
        setIsDataSeeded(true);
        toast.success('데이터가 로드되었습니다!');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setCompanionSpots(sampleCompanionSpots);
    }
  };

  // Open spot detail
  const openSpotDetail = (spot: MuseCompanion) => {
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
    companionSpots,
    selectedSpot,
    spotDetailOpen,
    
    // Actions
    setCompanionSpots,
    openSpotDetail,
    closeSpotDetail,
    loadCompanionSpots,
  };
}


