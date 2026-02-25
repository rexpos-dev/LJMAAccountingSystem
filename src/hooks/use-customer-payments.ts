'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CustomerPayment {
    id: string;
    customer_id: string;
    payment_type: string;
    payment_date: string;
    amount: string | number;
    reference: string;
    note: string;
    created_at: string;
    updated_at: string;
    customer_name: string;
    contact_number: string;
}

export function useCustomerPayments() {
    const [payments, setPayments] = useState<CustomerPayment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchPayments = useCallback(async (searchQuery?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);

            const url = `/api/customer-payments${params.toString() ? `?${params.toString()}` : ''}`;
            const response = await fetch(url);

            if (!response.ok) {
                const errBody = await response.json().catch(() => null);
                throw new Error(errBody?.error || response.statusText || 'Failed to fetch customer payments');
            }

            const responseData = await response.json();

            let data: CustomerPayment[] = [];
            if (Array.isArray(responseData)) {
                data = responseData;
            } else if (responseData && Array.isArray(responseData.data)) {
                data = responseData.data;
            }

            setPayments(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching customer payments:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshPayments = () => {
        fetchPayments();
    };

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    return {
        payments,
        isLoading,
        error,
        refreshPayments,
        fetchPayments,
    };
}
