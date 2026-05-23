'use client';

import { useState, useEffect } from 'react';

export interface CostCenter {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export function useCostCenters() {
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCenters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cost-centers');
      if (!response.ok) throw new Error('Failed to fetch cost centers');
      const data = await response.json();
      setCostCenters(data);
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

  return { costCenters, isLoading, error, refetch: fetchCenters };
}
