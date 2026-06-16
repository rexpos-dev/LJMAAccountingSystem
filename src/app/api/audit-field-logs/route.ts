import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/audit-field-logs?entityType=invoice&entityId=xxx&limit=100
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') ?? undefined;
    const entityId = searchParams.get('entityId') ?? undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '100'), 500);

    const logs = await prisma.auditFieldLog.findMany({
        where: {
            ...(entityType ? { entityType } : {}),
            ...(entityId ? { entityId } : {}),
        },
        orderBy: { changedAt: 'desc' },
        take: limit,
    });

    return NextResponse.json(logs);
}
