'use client';

import { useState, useEffect } from 'react';

export interface ProfitCenter {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export function useProfitCenters() {
  const [profitCenters, setProfitCenters] = useState<ProfitCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCenters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profit-centers');
      if (!response.ok) throw new Error('Failed to fetch profit centers');
      const data = await response.json();
      setProfitCenters(data);
      setError(null);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return { profitCenters, isLoading, error, refetch: fetchCenters };
}
