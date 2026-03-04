'use client';

import { useState, useEffect } from 'react';
import { SalesTransaction, SalesTransactionResponse } from '@/app/api/sales/transactions/route';

export function useSalesTransactions(page: number = 1, limit: number = 10, search?: string, fromDate?: string, toDate?: string) {
    const [transactions, setTransactions] = useState<SalesTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<SalesTransactionResponse['pagination'] | null>(null);

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams({
                limit: limit.toString(),
                page: page.toString(),
            });

            if (search) params.append('search', search);
            if (fromDate) params.append('fromDate', fromDate);
            if (toDate) params.append('toDate', toDate);

            const response = await fetch(`/api/sales/transactions?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch sales transactions: ${response.statusText}`);
            }

            const data: SalesTransactionResponse = await response.json();

            if (!data.success) {
                console.warn('[useSalesTransactions] backend reported failure');
                setTransactions([]);
                setPagination({
                    page,
                    limit,
                    totalRecords: 0,
                    totalPages: 0,
                });
                return;
            }

            setTransactions(data.data);
            setPagination(data.pagination);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching sales transactions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, limit, search, fromDate, toDate]);

    return {
        transactions,
        isLoading,
        error,
        pagination,
        refreshTransactions: fetchTransactions,
    };
}
