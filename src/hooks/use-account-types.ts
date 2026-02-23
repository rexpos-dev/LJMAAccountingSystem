import useSWR from 'swr';

export interface AccountTypeModel {
    id: string;
    name: string;
    baseType: string;
    createdAt: string;
    updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAccountTypes() {
    const { data, error, isLoading, mutate } = useSWR<AccountTypeModel[]>(
        '/api/account-types',
        fetcher
    );

    return {
        accountTypes: data || [],
        isLoading,
        isError: error,
        refetch: mutate,
    };
}
