import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/budgets?year=2026
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const year = parseInt(request.nextUrl.searchParams.get('year') ?? String(new Date().getFullYear()));

    const items = await prisma.budgetItem.findMany({
        where: { year },
        orderBy: [{ accountNo: 'asc' }, { month: 'asc' }],
    });

    return NextResponse.json(items);
}

// POST /api/budgets — upsert one or many budget lines
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const items: { accountNo: number; year: number; month: number; amount: number }[] = Array.isArray(body) ? body : [body];

    for (const item of items) {
        await prisma.budgetItem.upsert({
            where: { accountNo_year_month: { accountNo: item.accountNo, year: item.year, month: item.month } },
            update: { amount: item.amount },
            create: { accountNo: item.accountNo, year: item.year, month: item.month, amount: item.amount },
        });
    }

    return NextResponse.json({ success: true, count: items.length });
}
