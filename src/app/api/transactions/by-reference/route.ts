import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ref = searchParams.get('ref');

        if (!ref) {
            return NextResponse.json({ error: 'Reference transNo or ID is required' }, { status: 400 });
        }

        // Fetch the transactions related to the reference code from AuditLog.
        const transactions = await prisma.transaction.findMany({
            where: {
                OR: [
                    { transNo: ref },
                    { id: ref }
                ]
            },
            orderBy: {
                debit: 'desc' // Debits first, then credits usually
            }
        });

        return NextResponse.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions by reference:', error);
        return NextResponse.json({ error: 'Failed to fetch transactions by reference' }, { status: 500 });
    }
}
