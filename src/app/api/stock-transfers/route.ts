import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const transfers = await prisma.stockTransfer.findMany({
        include: { items: true },
        orderBy: { transferDate: 'desc' },
    });

    return NextResponse.json(transfers);
}

export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const transferredBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    // Validate stock availability
    for (const item of body.items ?? []) {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 404 });
        if (product.stockQuantity < item.quantity) {
            return NextResponse.json({
                error: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`,
                code: 'INSUFFICIENT_STOCK',
            }, { status: 422 });
        }
    }

    const count = await prisma.stockTransfer.count();
    const transferNumber = `ST-${String(count + 1).padStart(5, '0')}`;

    const transfer = await prisma.stockTransfer.create({
        data: {
            transferNumber,
            fromBranch: body.fromBranch,
            toBranch: body.toBranch,
            transferDate: new Date(body.transferDate),
            transferredBy,
            notes: body.notes,
            status: 'Completed',
            items: {
                create: (body.items ?? []).map((item: any) => ({
                    productId: item.productId,
                    quantity: parseFloat(item.quantity),
                    unitCost: parseFloat(item.unitCost ?? 0),
                })),
            },
        },
        include: { items: true },
    });

    // Update stock quantities (deduct from source — in single-inventory setup)
    for (const item of transfer.items) {
        await prisma.product.update({
            where: { id: item.productId },
            data: { stockQuantity: { decrement: Math.round(item.quantity) } },
        });

        await prisma.inventoryTransaction.create({
            data: {
                productId: item.productId,
                type: `Transfer: ${body.fromBranch} → ${body.toBranch}`,
                quantity: -item.quantity,
                referenceId: transfer.transferNumber,
                status: 'Completed',
            },
        });
    }

    return NextResponse.json(transfer, { status: 201 });
}
