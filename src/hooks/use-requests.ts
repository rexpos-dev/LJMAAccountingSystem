import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useRequests() {
    const { data, error, isLoading, mutate } = useSWR('/api/requests', fetcher);

    return {
        data,
        isLoading,
        isError: error,
        mutate
    };
}

export function useRequest(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/api/requests/${id}` : null,
        fetcher
    );

    return {
        data,
        isLoading,
        isError: error,
        mutate
    };
}
