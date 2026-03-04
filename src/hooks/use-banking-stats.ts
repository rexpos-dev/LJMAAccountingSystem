'use client';

import { useState, useEffect } from 'react';

export function useBankingStats() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/dashboard/banking-stats');
            if (!response.ok) {
                throw new Error('Failed to fetch banking stats');
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { data, isLoading, error, refetch: fetchStats };
}
