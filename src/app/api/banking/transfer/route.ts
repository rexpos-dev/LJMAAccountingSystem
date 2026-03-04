import { NextResponse } from 'next/server';
import { recordBankTransfer } from '@/lib/database';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { fromGlId, toGlId, amount, date, reference, memo, user } = data;

        if (!fromGlId || !toGlId || !amount || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await recordBankTransfer({
            fromBankAccountId: fromGlId,
            toBankAccountId: toGlId,
            amount: parseFloat(amount),
            date: new Date(date),
            reference,
            memo,
            user: user || 'system'
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error in banking transfer API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
