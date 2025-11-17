import { useState, useEffect } from 'react';
import { Performance } from '../components/PerformanceCard';

export function usePerformanceList() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: API 호출 로직 구현
    setLoading(false);
  }, []);

  return { performances, loading, error };
}


