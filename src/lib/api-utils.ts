import { prisma } from '@/lib/prisma';

// Define the shape of your fallback response
export type FetchResult<T> = T | { error: string };

// Interface for your database cache layer.
export interface CacheStore<T> {
    save: (key: string, data: T) => Promise<void>;
    get: (key: string) => Promise<T | null>;
}

// A Prisma-backed implementation of the CacheStore
export const prismaCacheStore: CacheStore<any> = {
    save: async (key: string, data: any) => {
        try {
            const stringifiedData = JSON.stringify(data);
            await prisma.apiCache.upsert({
                where: { endpoint: key },
                update: { data: stringifiedData },
                create: { endpoint: key, data: stringifiedData },
            });
        } catch (e) {
            console.error(`Failed to save to cache for ${key}:`, e);
        }
    },
    get: async (key: string) => {
        try {
            const cacheRecord = await prisma.apiCache.findUnique({
                where: { endpoint: key },
            });
            if (cacheRecord && cacheRecord.data) {
                return JSON.parse(cacheRecord.data);
            }
        } catch (e) {
            console.error(`Failed to retrieval from cache for ${key}:`, e);
        }
        return null;
    },
};

/**
 * Handles a single API request with caching and fallback logic.
 */
export async function fetchWithCacheFallback<T>(
    url: string,
    cacheStore: CacheStore<T> = prismaCacheStore
): Promise<FetchResult<T>> {
    try {
        // 1. Attempt the network request
        // We add a short timeout so one slow request doesn't hang the UI forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();

        // 2. Persistence: Save successful request to cache
        // We don't await this so it doesn't block returning the response
        cacheStore.save(url, data).catch(console.error);

        return data;
    } catch (error) {
        console.error(`Network request failed for ${url}:`, error);

        // 3. Fallback: Try to retrieve the last known good data from the cache
        try {
            const cachedData = await cacheStore.get(url);
            if (cachedData !== null) {
                console.log(`Using cached fallback for ${url}`);
                return cachedData;
            }
        } catch (cacheError) {
            console.error(`Failed to retrieve from cache for ${url}:`, cacheError);
        }

        // 4. UI Feedback: Return a specific error object if both network and cache fail
        return { error: 'Unable to fetch data' };
    }
}

/**
 * Makes multiple concurrent GET requests.
 * Uses Promise.all, but each promise catches its own errors so the whole sequence won't crash.
 */
export async function fetchMultipleEndpoints<T>(
    urls: string[],
    cacheStore: CacheStore<T> = prismaCacheStore
): Promise<FetchResult<T>[]> {
    const promises = urls.map((url) => fetchWithCacheFallback<T>(url, cacheStore));
    return Promise.all(promises);
}
