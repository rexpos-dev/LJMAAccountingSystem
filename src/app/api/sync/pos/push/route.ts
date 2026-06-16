import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// POST /api/sync/pos/push
// Pushes inventory levels and price updates to registered POS machines
// POS machines must be registered in the web_access_machine table
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { productIds } = await request.json();

    // Fetch products to push
    const products = await prisma.product.findMany({
        where: productIds?.length ? { id: { in: productIds } } : { isActive: true },
        select: {
            id: true, code: true, name: true, barcode: true,
            stockQuantity: true, unitPrice: true, costPrice: true,
            minStockLevel: true, reorderPoint: true,
        },
    });

    // Fetch active POS machines
    const machines: any[] = await prisma.$queryRaw`
        SELECT id, machineId, endpoint, lastHeartbeat, isOnline
        FROM web_access_machine
        WHERE isOnline = true
    `;

    const results: { machineId: string; status: string; error?: string }[] = [];

    for (const machine of machines) {
        if (!machine.endpoint) continue;
        try {
            const res = await fetch(`${machine.endpoint}/api/sync/inventory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ products, syncedAt: new Date().toISOString() }),
                signal: AbortSignal.timeout(8000),
            });
            results.push({
                machineId: machine.machineId,
                status: res.ok ? 'success' : `failed (${res.status})`,
            });
        } catch (err: any) {
            results.push({ machineId: machine.machineId, status: 'failed', error: err.message });
        }
    }

    return NextResponse.json({
        productsSync: products.length,
        machinesPushed: machines.length,
        results,
    });
}
