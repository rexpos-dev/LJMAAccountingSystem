import useSWR, { mutate } from 'swr';
import { Employee } from '@/types/employee';
import { useState } from 'react';

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const errorInfo = await res.json().catch(() => ({}));
        throw new Error(errorInfo.error || 'Failed to fetch employees');
    }
    return res.json();
};

export function useEmployees() {
    const { data, error, isLoading, mutate } = useSWR<Employee[]>('/api/employees', fetcher);

    return {
        data: Array.isArray(data) ? data : [],
        isLoading,
        error,
        refetch: mutate,
    };
}

export function useCreateEmployee() {
    const [isPending, setIsPending] = useState(false);

    const create = async (employeeData: Partial<Employee>) => {
        setIsPending(true);
        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create employee');
            }

            await mutate('/api/employees');
            return await response.json();
        } finally {
            setIsPending(false);
        }
    };

    return { mutateAsync: create, isPending };
}

export function useUpdateEmployee() {
    const [isPending, setIsPending] = useState(false);

    const update = async (employeeData: Partial<Employee>) => {
        setIsPending(true);
        try {
            const response = await fetch('/api/employees', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update employee');
            }

            await mutate('/api/employees');
            return await response.json();
        } finally {
            setIsPending(false);
        }
    };

    return { mutateAsync: update, isPending };
}

export function useDeleteEmployee() {
    const [isPending, setIsPending] = useState(false);

    const remove = async (id: string) => {
        setIsPending(true);
        try {
            const response = await fetch(`/api/employees?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete employee');
            }

            await mutate('/api/employees');
            return await response.json();
        } finally {
            setIsPending(false);
        }
    };

    return { mutateAsync: remove, isPending };
}
