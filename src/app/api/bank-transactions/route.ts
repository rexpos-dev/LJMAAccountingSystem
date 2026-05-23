import { NextResponse } from 'next/server';
import { getBankTransactionsHistory } from '@/lib/database';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const bankAccountId = searchParams.get('bankAccountId') || undefined;
        const status = searchParams.get('status') || undefined;
        const type = searchParams.get('type') || undefined;
        const search = searchParams.get('search') || undefined;
        const startDateString = searchParams.get('startDate') || undefined;
        const endDateString = searchParams.get('endDate') || undefined;

        const startDate = startDateString ? new Date(startDateString) : undefined;
        const endDate = endDateString ? new Date(endDateString) : undefined;

        const history = await getBankTransactionsHistory({
            bankAccountId,
            status,
            type,
            search,
            startDate,
            endDate
        });
        return NextResponse.json(history);
    } catch (error: any) {
        console.error('Error fetching bank transaction history:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch bank transaction history' },
            { status: 500 }
        );
    }
}
