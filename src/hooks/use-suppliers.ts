'use client';

import { useState, useEffect } from 'react';

export interface Supplier {
    id: string;
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string; // Verify this field exists or add it
    terms?: string;
    taxId?: string;
    // Add other fields as per your API
}

export function useSuppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/suppliers');

            if (!response.ok) {
                let errorMessage = 'Failed to fetch suppliers';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorData.details || errorMessage;
                } catch (e) {
                    errorMessage = `${errorMessage} (${response.status} ${response.statusText})`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            setSuppliers(data);
        } catch (err: any) {
            const finalError = err instanceof Error ? err : new Error(err.message || 'Failed to fetch suppliers');
            setError(finalError);
            console.error('Failed to fetch suppliers:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return {
        suppliers,
        isLoading,
        error,
        refreshSuppliers: fetchSuppliers,
    };
}
