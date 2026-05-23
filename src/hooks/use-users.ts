'use client';

import { useQuery } from '@tanstack/react-query';

export interface User {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    accountType: string;
}

export function useUsers() {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await fetch('/api/user-permissions');
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        }
    });
}
