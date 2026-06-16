import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const periods = await prisma.payrollPeriod.findMany({
        orderBy: { startDate: 'desc' },
        include: { entries: false },
    });

    return NextResponse.json(periods);
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const createdBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    const period = await prisma.payrollPeriod.create({
        data: {
            name: body.name,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            payDate: new Date(body.payDate),
            createdBy,
        },
    });

    return NextResponse.json(period, { status: 201 });
}
