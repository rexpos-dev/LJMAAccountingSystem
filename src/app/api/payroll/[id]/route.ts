import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const period = await prisma.payrollPeriod.findUnique({
        where: { id },
        include: { entries: { orderBy: { employeeName: 'asc' } } },
    });
    if (!period) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(period);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();

    const period = await prisma.payrollPeriod.update({
        where: { id },
        data: { status },
    });
    return NextResponse.json(period);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.payrollPeriod.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
