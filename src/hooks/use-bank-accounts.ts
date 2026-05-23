import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useBankAccounts() {
    const { data, error, mutate, isLoading } = useSWR('/api/bank-accounts', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10000,
    });

    return {
        bankAccounts: data,
        isLoading,
        isError: error,
        mutate,
    };
}
