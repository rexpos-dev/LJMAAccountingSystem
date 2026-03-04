import { NextResponse } from 'next/server';
import { recordBankAdjustment } from '@/lib/database';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { accountId, offsetAccountId, amount, type, date, reference, memo, user } = data;

        if (!accountId || !offsetAccountId || !amount || !type || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await recordBankAdjustment({
            bankAccountId: accountId,
            amount: parseFloat(amount),
            type,
            date: new Date(date),
            reference,
            memo,
            user: user || 'system'
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error in banking adjustment API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
