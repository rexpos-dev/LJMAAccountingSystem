import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/** Hash an API key using SHA-256 */
export function hashApiKey(key: string): string {
    return crypto.createHash('sha256').update(key).digest('hex');
}

/** Generate a new API key — returns both the raw key (show once) and the hash */
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
    const raw = `ljma_${crypto.randomBytes(24).toString('hex')}`;
    const hash = hashApiKey(raw);
    const prefix = raw.slice(0, 12);
    return { raw, hash, prefix };
}

/** Validate an API key from request header — returns the ApiKey record or null */
export async function validateApiKey(rawKey: string): Promise<{ id: string; name: string; permissions: string[] } | null> {
    if (!rawKey) return null;

    const hash = hashApiKey(rawKey);
    const record = await prisma.apiKey.findUnique({ where: { keyHash: hash } });
    if (!record || !record.isActive) return null;
    if (record.expiresAt && record.expiresAt < new Date()) return null;

    // Update last used timestamp (non-blocking)
    prisma.apiKey.update({ where: { id: record.id }, data: { lastUsedAt: new Date() } }).catch(() => {});

    return {
        id: record.id,
        name: record.name,
        permissions: JSON.parse(record.permissions ?? '[]'),
    };
}

/** Check if API key has a specific permission (e.g. 'invoices:read') */
export function apiKeyHasPermission(permissions: string[], required: string): boolean {
    if (permissions.includes('*')) return true;
    return permissions.includes(required);
}

/** Dispatch an event to all active webhook subscribers */
export async function dispatchWebhookEvent(event: string, payload: object): Promise<void> {
    const subscribers = await prisma.webhookSubscription.findMany({
        where: { isActive: true },
    });

    for (const sub of subscribers) {
        const events: string[] = JSON.parse(sub.events ?? '[]');
        if (!events.includes(event) && !events.includes('*')) continue;

        const payloadStr = JSON.stringify({ event, data: payload, sentAt: new Date().toISOString() });
        const signature = crypto
            .createHmac('sha256', sub.secret)
            .update(payloadStr)
            .digest('hex');

        let statusCode: number | null = null;
        let responseBody: string | null = null;
        let success = false;

        try {
            const res = await fetch(sub.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-LJMA-Signature': `sha256=${signature}`,
                    'X-LJMA-Event': event,
                },
                body: payloadStr,
                signal: AbortSignal.timeout(10000),
            });
            statusCode = res.status;
            responseBody = await res.text().catch(() => '');
            success = res.ok;
        } catch (err: any) {
            responseBody = err.message;
        }

        // Log delivery attempt (non-blocking)
        prisma.webhookDelivery.create({
            data: {
                subscriptionId: sub.id,
                event,
                payload: payloadStr,
                statusCode,
                responseBody,
                success,
            },
        }).catch(() => {});
    }
}
