
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Use raw queries for all metrics to avoid Prisma Client model mismatches
        const counts: any[] = await prisma.$queryRaw`
            SELECT 
                COUNT(*) as total,
                IFNULL(SUM(CASE WHEN status = 'To Verify' THEN 1 ELSE 0 END), 0) as toVerify,
                IFNULL(SUM(CASE WHEN status = 'To Approve' THEN 1 ELSE 0 END), 0) as toApprove,
                IFNULL(SUM(CASE WHEN status = 'To Process' THEN 1 ELSE 0 END), 0) as toProcess,
                IFNULL(SUM(CASE WHEN status = 'Released' THEN 1 ELSE 0 END), 0) as released,
                IFNULL(SUM(CASE WHEN status = 'Received' THEN 1 ELSE 0 END), 0) as received
            FROM \`request\`
        `;

        const row = (counts && counts[0]) ? counts[0] : {};

        // Convert BigInt to Number as queryRaw returns BigInt for counts in many MySQL adapters
        const total = Number(row.total || 0);
        const toVerify = Number(row.toVerify || 0);
        const toApprove = Number(row.toApprove || 0);
        const toProcess = Number(row.toProcess || 0);
        const released = Number(row.released || 0);
        const received = Number(row.received || 0);
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
        return NextResponse.json({
            error: 'Failed to fetch stats',
            total: 0,
            toVerify: 0,
            toApprove: 0,
            toProcess: 0,
            released: 0,
            received: 0,
            releasedAndReceived: 0
        }, { status: 200 }); // Return empty stats instead of 500 to keep UI stable
    }
}
