import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const items = await prisma.recurringTransaction.findMany({
        orderBy: { nextRunDate: 'asc' },
    });

    return NextResponse.json(items.map(r => ({
        ...r,
        lines: JSON.parse(r.lines),
    })));
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const createdBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    const item = await prisma.recurringTransaction.create({
        data: {
            description: body.description,
            referencePrefix: body.referencePrefix ?? 'REC',
            frequency: body.frequency,
            dayOfMonth: body.dayOfMonth ? parseInt(body.dayOfMonth) : null,
            nextRunDate: new Date(body.nextRunDate),
            isActive: body.isActive ?? true,
            lines: JSON.stringify(body.lines),
            createdBy,
        },
    });

    return NextResponse.json({ ...item, lines: body.lines }, { status: 201 });
}
