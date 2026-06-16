import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-server';
import { toBaseCurrency, fromBaseCurrency } from '@/lib/currency';

// GET /api/currencies/convert?amount=1000&from=USD&to=PHP&date=2026-06-05
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get('amount') ?? '0');
    const from = searchParams.get('from') ?? 'PHP';
    const to = searchParams.get('to') ?? 'PHP';
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined;

    try {
        let result: number;
        if (to === 'PHP') {
            result = await toBaseCurrency(amount, from, date);
        } else if (from === 'PHP') {
            result = await fromBaseCurrency(amount, to, date);
        } else {
            // Cross-rate: convert from → PHP → to
            const inPHP = await toBaseCurrency(amount, from, date);
            result = await fromBaseCurrency(inPHP, to, date);
        }

        return NextResponse.json({ from, to, amount, result, date: date?.toISOString().slice(0, 10) });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
