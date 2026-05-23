import useSWR from 'swr';

export interface AccountTypeModel {
    id: string;
    name: string;
    baseType: string;
    createdAt: string;
    updatedAt: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        let errorMsg = 'An error occurred while fetching the data.';
        try {
            const data = await res.json();
            if (data?.error) errorMsg = data.error;
        } catch (e) {
            // Ignore JSON parse errors for non-JSON responses
        }
        throw new Error(errorMsg);
    }
    return res.json();
};

export function useAccountTypes() {
    const { data, error, isLoading, mutate } = useSWR<AccountTypeModel[]>(
        '/api/account-types',
        fetcher
    );

    return {
        accountTypes: Array.isArray(data) ? data : [],
        isLoading,
        isError: error,
        refetch: mutate,
    };
}
