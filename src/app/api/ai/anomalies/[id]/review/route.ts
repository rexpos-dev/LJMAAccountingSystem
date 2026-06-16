import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// PATCH /api/ai/anomalies/:id/review — mark anomaly as reviewed
export async function PATCH(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const reviewedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    const log = await prisma.anomalyLog.update({
        where: { id },
        data: { reviewed: true, reviewedBy, reviewedAt: new Date() },
    });

    return NextResponse.json(log);
}
