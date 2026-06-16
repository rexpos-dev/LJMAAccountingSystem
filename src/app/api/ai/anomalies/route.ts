import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { detectAnomalies } from '@/lib/ai-engine';

// GET /api/ai/anomalies?lookbackDays=90&unreviewed=true
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const unreviewed = request.nextUrl.searchParams.get('unreviewed') !== 'false';

    const logged = await prisma.anomalyLog.findMany({
        where: unreviewed ? { reviewed: false } : undefined,
        orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
        take: 200,
    });

    return NextResponse.json(logged);
}

// POST /api/ai/anomalies/scan — run anomaly detection and save results
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { lookbackDays = 90 } = await request.json().catch(() => ({}));
    const anomalies = await detectAnomalies(lookbackDays);

    // Deduplicate: skip if already logged (same entityId + anomalyType)
    const existing = await prisma.anomalyLog.findMany({
        where: { entityType: 'transaction', reviewed: false },
        select: { entityId: true, anomalyType: true },
    });
    const existingSet = new Set(existing.map(e => `${e.entityId}-${e.anomalyType}`));

    const toCreate = anomalies.filter(a => !existingSet.has(`${a.entityId}-${a.anomalyType}`));

    if (toCreate.length > 0) {
        await prisma.anomalyLog.createMany({
            data: toCreate.map(a => ({
                entityType: 'transaction',
                entityId: a.entityId,
                entityRef: a.entityRef,
                anomalyType: a.anomalyType,
                severity: a.severity,
                description: a.description,
                amount: a.amount,
                baseline: a.baseline ?? null,
            })),
            skipDuplicates: true,
        });
    }

    return NextResponse.json({
        found: anomalies.length,
        newlyLogged: toCreate.length,
        skipped: anomalies.length - toCreate.length,
        breakdown: {
            high: anomalies.filter(a => a.severity === 'high').length,
            medium: anomalies.filter(a => a.severity === 'medium').length,
            low: anomalies.filter(a => a.severity === 'low').length,
        },
    });
}
