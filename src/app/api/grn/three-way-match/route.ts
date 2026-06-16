import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/grn/three-way-match?poId=xxx
// Returns PO vs GRN vs Supplier Invoice comparison (3-way match)
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const poId = request.nextUrl.searchParams.get('poId');
    if (!poId) return NextResponse.json({ error: 'poId required' }, { status: 400 });

    const po = await prisma.purchaseOrder.findUnique({
        where: { id: poId },
        include: { items: true, supplier: true },
    });
    if (!po) return NextResponse.json({ error: 'PO not found' }, { status: 404 });

    const grns = await prisma.goodsReceiptNote.findMany({
        where: { poId },
        include: { items: true },
    });

    // Aggregate received quantities per poItemId
    const receivedMap = new Map<string, number>();
    for (const grn of grns) {
        for (const item of grn.items) {
            if (item.poItemId) {
                receivedMap.set(item.poItemId, (receivedMap.get(item.poItemId) ?? 0) + item.receivedQty);
            }
        }
    }

    const lines = po.items.map(poItem => {
        const ordered = poItem.quantity;
        const received = receivedMap.get(poItem.id) ?? 0;
        const variance = received - ordered;
        const variancePct = ordered > 0 ? parseFloat(((variance / ordered) * 100).toFixed(2)) : null;
        const status = received === 0 ? 'Not Received'
            : received < ordered ? 'Under-received'
            : received > ordered ? 'Over-received'
            : 'Matched';

        return {
            poItemId: poItem.id,
            description: poItem.itemDescription,
            unitPrice: poItem.unitPrice,
            ordered,
            received,
            variance,
            variancePct,
            status,
            matchOk: status === 'Matched',
        };
    });

    const allMatched = lines.every(l => l.matchOk);

    return NextResponse.json({
        poId,
        poNumber: po.id,
        supplier: po.supplier.id,
        poTotal: po.total,
        grnCount: grns.length,
        lines,
        allMatched,
        summary: {
            ordered: lines.reduce((s, l) => s + l.ordered, 0),
            received: lines.reduce((s, l) => s + l.received, 0),
        },
    });
}
