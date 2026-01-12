import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Find the latest transaction with a reference starting with 'GJ'
        const lastTransaction = await prisma.transaction.findFirst({
            where: {
                transNo: {
                    startsWith: 'GJ',
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        let nextNumber = 1;
        if (lastTransaction && lastTransaction.transNo) {
            const match = lastTransaction.transNo.match(/GJ-(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }

        const nextReference = `GJ-${String(nextNumber).padStart(6, '0')}`;
        return NextResponse.json({ nextReference });
    } catch (error) {
        console.error('Error generating next reference:', error);
        return NextResponse.json({ error: 'Failed to generate next reference' }, { status: 500 });
    }
}
