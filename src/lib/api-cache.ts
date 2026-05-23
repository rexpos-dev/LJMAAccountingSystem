import { prisma } from '@/lib/prisma';

export async function fetchWithCache<T>(
    url: string,
    options: RequestInit = {},
    ttlMinutes: number = 15,
    forceRefresh: boolean = false
): Promise<{ success: boolean; data: T | null; cached: boolean; status?: number; error?: string }> {
    try {
        // Determine the cache key using the URL
        const cacheKey = url;

        // Only cache GET requests (or requests without a specified method)
        if (options.method && options.method.toUpperCase() !== 'GET') {
            const response = await fetch(url, options);
            if (!response.ok) {
                return { success: false, data: null, cached: false, status: response.status, error: await response.text() };
            }
            return { success: true, data: await response.json(), cached: false };
        }

        // Try to get from cache first (skip if forceRefresh is true)
        const cachedRecord = forceRefresh ? null : await prisma.apiCache.findUnique({
            where: { endpoint: cacheKey },
        });

        const now = new Date();
        const isStale = (cachedRecord && !forceRefresh) ? (now.getTime() - cachedRecord.updatedAt.getTime()) > (ttlMinutes * 60 * 1000) : true;

        if (cachedRecord && !isStale && !forceRefresh) {
            // Return fresh cache
            try {
                const parsedData = JSON.parse(cachedRecord.data) as T;
                return { success: true, data: parsedData, cached: true };
            } catch (parseErr) {
                console.error('Failed to parse cached data for', url, parseErr);
                // Fallthrough to fetch
            }
        }

        // Fetch from external API
        let fetchError: any = null;
        let response: Response | null = null;
        let timeoutId: NodeJS.Timeout | undefined;

        try {
            const controller = new AbortController();
            timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
            response = await fetch(url, { ...options, signal: controller.signal });
        } catch (err) {
            fetchError = err;
        } finally {
            if (timeoutId) clearTimeout(timeoutId);
        }

        if (fetchError || !response || !response.ok) {
            if (cachedRecord) {
                // Fallback to stale cache if external API is unreachable or fails
                console.warn(`External API failed for ${url}, falling back to stale cache.`);
                try {
                    const parsedData = JSON.parse(cachedRecord.data) as T;
                    return { success: true, data: parsedData, cached: true };
                } catch (e) { }
            }

            return {
                success: false,
                data: null,
                cached: false,
                status: response?.status,
                error: fetchError?.message || await response?.text().catch(() => 'Unknown error')
            };
        }

        const data = await response.json();

        // Store/update cache asynchronously (don't block the return, but prisma is fast)
        // Actually, awaiting it ensures we don't have overlapping detached promises running amok
        await prisma.apiCache.upsert({
            where: { endpoint: cacheKey },
            update: {
                data: JSON.stringify(data),
                updatedAt: now,
            },
            create: {
                endpoint: cacheKey,
                data: JSON.stringify(data),
            },
        });

        return { success: true, data, cached: false };

    } catch (error: any) {
        console.error('Error in fetchWithCache:', error);
        return { success: false, data: null, cached: false, error: error.message };
    }
}
