'use client';

import { useState, useEffect } from 'react';

export interface CustomerBalance {
    id: string;
    name: string;
    contactNumber: string;
    paymentTerms: string;
    invoiceCount: number;
    balance: string | number;
    totalAmount: string | number;
    amountPaid: string | number;
    address?: string;
}

export function useCustomerBalances() {
    const [balances, setBalances] = useState<CustomerBalance[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBalances = async (searchQuery?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const url = `/api/customers/balances${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await fetch(url).catch(() => null);

            if (!response || !response.ok) {
                console.warn('Silent fallback: Failed to fetch customer balances');
                setBalances([]);
                return;
            }

            const responseData = await response.json();

            let data: CustomerBalance[] = [];
            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
                data = responseData.data;
            }

            setBalances(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching customer balances:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshBalances = () => {
        fetchBalances();
    };

    useEffect(() => {
        fetchBalances();
    }, []);

    return {
        balances,
        isLoading,
        error,
        refreshBalances,
        fetchBalances,
    };
}
