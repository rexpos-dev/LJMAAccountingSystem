import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const poId = request.nextUrl.searchParams.get('poId');

    const grns = await prisma.goodsReceiptNote.findMany({
        where: poId ? { poId } : undefined,
        include: { items: true },
        orderBy: { receivedDate: 'desc' },
    });

    return NextResponse.json(grns);
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const receivedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    // Auto-generate GRN number
    const count = await prisma.goodsReceiptNote.count();
    const grnNumber = `GRN-${String(count + 1).padStart(5, '0')}`;

    const grn = await prisma.goodsReceiptNote.create({
        data: {
            grnNumber,
            poId: body.poId,
            supplierId: body.supplierId,
            receivedDate: new Date(body.receivedDate),
            receivedBy,
            notes: body.notes,
            items: {
                create: (body.items ?? []).map((item: any) => ({
                    poItemId: item.poItemId ?? null,
                    productId: item.productId ?? null,
                    description: item.description,
                    orderedQty: parseFloat(item.orderedQty),
                    receivedQty: parseFloat(item.receivedQty),
                    unitPrice: parseFloat(item.unitPrice ?? 0),
                })),
            },
        },
        include: { items: true },
    });

    // Update stock quantities for received items
    for (const item of grn.items) {
        if (item.productId && item.receivedQty > 0) {
            await prisma.product.update({
                where: { id: item.productId },
                data: { stockQuantity: { increment: Math.round(item.receivedQty) } },
            });

            await prisma.inventoryTransaction.create({
                data: {
                    productId: item.productId,
                    type: 'Goods Receipt',
                    quantity: item.receivedQty,
                    referenceId: grn.grnNumber,
                    status: 'Completed',
                },
            });
        }
    }

    return NextResponse.json(grn, { status: 201 });
}
