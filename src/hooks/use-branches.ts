'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Branch {
    id: string;
    name: string;
    code?: string;
    type?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    isActive: boolean;
    payTo?: string;
    accountNumber?: string;
    expenseAcct?: string;
    receivables?: string;
    depositAccount?: string;
    othersField?: string;
    profit_center_id?: string;
    allocationWeights?: {
        weight: number;
    };
    createdAt?: string;
    updatedAt?: string;
}

export function useBranches() {
    const [data, setData] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchBranches = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/branches');
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const branches = await response.json();
            setData(branches);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createBranch = async (branchData: Partial<Branch>) => {
        const response = await fetch('/api/branches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(branchData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create branch');
        }
        await fetchBranches();
        return await response.json();
    };

    const updateBranch = async (id: string, branchData: Partial<Branch>) => {
        const response = await fetch(`/api/branches/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(branchData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update branch');
        }
        await fetchBranches();
        return await response.json();
    };

    const deleteBranch = async (id: string) => {
        const response = await fetch(`/api/branches/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete branch');
        }
        await fetchBranches();
    };

    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchBranches,
        createBranch,
        updateBranch,
        deleteBranch
    };
}
