import { useQuery } from '@tanstack/react-query';

export function useBusinessProfile() {
    const { data: profile, isLoading, error, refetch } = useQuery({
        queryKey: ['business-profile'],
        queryFn: async () => {
            const res = await fetch('/api/business-profile');
            if (!res.ok) {
                throw new Error('Failed to fetch business profile');
            }
            return res.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return { profile, isLoading, error, refetch };
}
