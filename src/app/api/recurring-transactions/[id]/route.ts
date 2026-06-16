import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const item = await prisma.recurringTransaction.update({
        where: { id },
        data: {
            ...(body.description !== undefined && { description: body.description }),
            ...(body.frequency !== undefined && { frequency: body.frequency }),
            ...(body.dayOfMonth !== undefined && { dayOfMonth: parseInt(body.dayOfMonth) }),
            ...(body.nextRunDate !== undefined && { nextRunDate: new Date(body.nextRunDate) }),
            ...(body.isActive !== undefined && { isActive: body.isActive }),
            ...(body.lines !== undefined && { lines: JSON.stringify(body.lines) }),
        },
    });

    return NextResponse.json({ ...item, lines: JSON.parse(item.lines) });
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.recurringTransaction.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
