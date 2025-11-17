import { useState, useEffect } from 'react';
import { Promotion } from '../PromotionCard';
import { promotionApi, seedData } from '../../../../lib/api/api';
import { toast } from 'sonner';

interface UsePromotionsProps {
  isDataSeeded: boolean;
  setIsDataSeeded: (value: boolean) => void;
  samplePromotions: Promotion[];
}

export function usePromotions({ isDataSeeded, setIsDataSeeded, samplePromotions }: UsePromotionsProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  // Load promotions
  const loadPromotions = async () => {
    try {
      const promoData = await promotionApi.getAll();
      if (promoData.promotions) {
        setPromotions(promoData.promotions);
      } else {
        await handleSeedData();
      }
    } catch (error) {
      console.error('Error loading promotions:', error);
      setPromotions(samplePromotions);
    }
  };

  const handleSeedData = async () => {
    if (isDataSeeded) return;
    
    try {
      const result = await seedData({
        performances: [],
        promotions: samplePromotions,
        coupleSpots: [],
      });

      if (result.success) {
        setPromotions(samplePromotions);
        setIsDataSeeded(true);
        toast.success('데이터가 로드되었습니다!');
      }
    } catch (error) {
      console.error('Error seeding data:', error);
      setPromotions(samplePromotions);
    }
  };

  return {
    // State
    promotions,
    
    // Actions
    setPromotions,
    loadPromotions,
  };
}


