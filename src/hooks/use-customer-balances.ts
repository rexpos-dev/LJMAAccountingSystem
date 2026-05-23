'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const fetchBalances = useCallback(async (searchQuery?: string | any, force?: boolean | any) => {
        try {
            if (mounted.current) {
                setIsLoading(true);
                setError(null);
            }

            const params = new URLSearchParams();
            
            // Safely handle searchQuery in case it's an event object
            const safeSearchQuery = typeof searchQuery === 'string' ? searchQuery : undefined;
            if (safeSearchQuery) {
                params.append('search', safeSearchQuery);
            }

            // Safely handle force flag
            const isForce = force === true || (typeof force === 'boolean' && force);
            if (isForce) {
                params.append('force', 'true');
                params.append('_t', Date.now().toString()); // Cache buster
            }

            const url = `/api/customers/balances${params.toString() ? `?${params.toString()}` : ''}`;
            
            const response = await fetch(url, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch customer balances (${response.status})`);
            }

            const responseData = await response.json();

            if (responseData && responseData.error) {
                throw new Error(responseData.error);
            }

            let data: CustomerBalance[] = [];
            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
                data = responseData.data;
            } else {
                throw new Error('Invalid data format received from API');
            }

            if (mounted.current) {
                setBalances(data);
            }
        } catch (err) {
            console.error('Error fetching customer balances:', err);
            if (mounted.current) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            }
        } finally {
            if (mounted.current) {
                setIsLoading(false);
            }
        }
    }, []);

    const refreshBalances = useCallback((force?: boolean | any) => {
        const isForce = force === true || (typeof force === 'boolean' && force);
        fetchBalances(undefined, isForce);
    }, [fetchBalances]);

    useEffect(() => {
        fetchBalances();
    }, [fetchBalances]);

    return {
        balances,
        isLoading,
        error,
        refreshBalances,
        fetchBalances,
    };
}
