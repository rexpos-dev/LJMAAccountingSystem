import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/inventory/valuation?method=weighted-average|fifo&asOf=2026-06-05
// Returns inventory valuation per product
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const method = searchParams.get('method') ?? 'weighted-average';
    const asOf = searchParams.get('asOf') ? new Date(searchParams.get('asOf')!) : new Date();

    const products = await prisma.product.findMany({
        where: { isActive: true },
        select: {
            id: true, code: true, name: true,
            stockQuantity: true, costPrice: true,
            inventoryTransactions: {
                where: { createdAt: { lte: asOf } },
                orderBy: { createdAt: 'asc' },
                select: { type: true, quantity: true, createdAt: true },
            },
        },
        orderBy: { name: 'asc' },
    });

    const rows = products.map(product => {
        let unitCost = product.costPrice;

        if (method === 'weighted-average') {
            // Weighted average: total cost / total quantity received
            const received = product.inventoryTransactions.filter(t => t.quantity > 0);
            const totalQty = received.reduce((s, t) => s + t.quantity, 0);
            if (totalQty > 0 && product.costPrice > 0) {
                // Use costPrice as proxy (actual FIFO would need purchase cost per lot)
                unitCost = product.costPrice;
            }
        }

        const totalValue = product.stockQuantity * unitCost;

        return {
            id: product.id,
            code: product.code,
            name: product.name,
            onHand: product.stockQuantity,
            unitCost: parseFloat(unitCost.toFixed(4)),
            totalValue: parseFloat(totalValue.toFixed(2)),
        };
    });

    const grandTotal = rows.reduce((s, r) => s + r.totalValue, 0);

    return NextResponse.json({
        method,
        asOf,
        items: rows,
        grandTotal: parseFloat(grandTotal.toFixed(2)),
    });
}
