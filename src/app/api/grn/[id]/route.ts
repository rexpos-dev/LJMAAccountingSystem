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
    const grn = await prisma.goodsReceiptNote.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!grn) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(grn);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { status, notes } = await request.json();

    const grn = await prisma.goodsReceiptNote.update({
        where: { id },
        data: {
            ...(status !== undefined && { status }),
            ...(notes !== undefined && { notes }),
        },
    });

    return NextResponse.json(grn);
}
