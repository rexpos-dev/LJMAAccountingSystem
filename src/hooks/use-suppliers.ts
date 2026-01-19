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
                throw new Error('Failed to fetch suppliers');
            }

            const data = await response.json();
            setSuppliers(data);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching suppliers:', err);
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
