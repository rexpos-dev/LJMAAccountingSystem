import { NextResponse } from 'next/server';
import { recordBankDeposit } from '@/lib/database';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { bankGlId, amount, date, reference, memo, user, allocations } = data;

        if (!bankGlId || !amount || !date || !allocations || !Array.isArray(allocations)) {
            return NextResponse.json({ error: 'Missing required fields or invalid allocations' }, { status: 400 });
        }

        const result = await recordBankDeposit({
            bankGlId,
            amount: parseFloat(amount),
            date: new Date(date),
            reference,
            memo,
            user: user || 'admin',
            allocations: allocations.map((a: any) => ({
                accountId: a.accountId,
                amount: parseFloat(a.amount),
                memo: a.memo
            }))
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Error in banking deposit API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
