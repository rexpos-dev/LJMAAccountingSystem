import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/currencies/rates?currencyId=xxx&limit=30
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const currencyId = searchParams.get('currencyId');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '30'), 365);

    const rates = await prisma.exchangeRate.findMany({
        where: currencyId ? { currencyId } : undefined,
        include: { currency: { select: { code: true, name: true, symbol: true } } },
        orderBy: { rateDate: 'desc' },
        take: limit,
    });

    return NextResponse.json(rates);
}

// POST /api/currencies/rates — upsert rate for a currency on a date
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { currencyId, rateDate, rateToBase } = await request.json();

    const rate = await prisma.exchangeRate.upsert({
        where: { currencyId_rateDate: { currencyId, rateDate: new Date(rateDate) } },
        update: { rateToBase: parseFloat(rateToBase) },
        create: { currencyId, rateDate: new Date(rateDate), rateToBase: parseFloat(rateToBase) },
    });

    return NextResponse.json(rate, { status: 201 });
}
