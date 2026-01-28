
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const total = await prisma.request.count();
        const toVerify = await prisma.request.count({ where: { status: 'To Verify' } });
        const toApprove = await prisma.request.count({ where: { status: 'To Approve' } });
        const toProcess = await prisma.request.count({ where: { status: 'To Process' } });
        const released = await prisma.request.count({ where: { status: 'Released' } });
        const received = await prisma.request.count({ where: { status: 'Received' } });

        // "Release and Received" metric: user asked for "# of Release and Received".
        // I'll return them as separate fields, the UI can combine them if needed.
        // Or I can return a combined count "releasedAndReceived".
        const releasedAndReceived = released + received;

        return NextResponse.json({
            total,
            toVerify,
            toApprove,
            toProcess,
            released,
            received,
            releasedAndReceived
        });
    } catch (error) {
        console.error('Error fetching request stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
