import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const currencies = await prisma.currency.findMany({
        include: {
            rates: { orderBy: { rateDate: 'desc' }, take: 1 },
        },
        orderBy: { code: 'asc' },
    });

    return NextResponse.json(currencies.map(c => ({
        ...c,
        latestRate: c.rates[0]?.rateToBase ?? null,
        latestRateDate: c.rates[0]?.rateDate ?? null,
    })));
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { code, name, symbol, isBase } = await request.json();

    const currency = await prisma.currency.create({
        data: { code: code.toUpperCase(), name, symbol: symbol ?? '', isBase: isBase ?? false },
    });

    return NextResponse.json(currency, { status: 201 });
}
