import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { sendEmail } from '@/lib/email';

// GET /api/inventory/reorder-alerts
// Returns all products where stockQuantity <= reorderPoint
export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            reorderPoint: { gt: 0 },
        },
        select: {
            id: true, code: true, name: true,
            stockQuantity: true, reorderPoint: true,
            minStockLevel: true, maxStockLevel: true, unitPrice: true,
        },
        orderBy: { name: 'asc' },
    });

    const alerts = products.filter(p => p.stockQuantity <= p.reorderPoint);

    return NextResponse.json({
        total: alerts.length,
        items: alerts.map(p => ({
            ...p,
            shortfall: Math.max(p.reorderPoint - p.stockQuantity, 0),
            status: p.stockQuantity <= 0 ? 'Out of Stock' : 'Low Stock',
        })),
    });
}

// POST /api/inventory/reorder-alerts — send email alerts to admin
export async function POST() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminEmail = process.env.NOTIFY_ADMIN_EMAIL;
    if (!adminEmail) return NextResponse.json({ error: 'NOTIFY_ADMIN_EMAIL not set' }, { status: 400 });

    const products = await prisma.product.findMany({
        where: { isActive: true, reorderPoint: { gt: 0 } },
    });

    const alerts = products.filter(p => p.stockQuantity <= p.reorderPoint);
    let sent = 0;

    for (const product of alerts) {
        await sendEmail({
            to: adminEmail,
            template: 'low_stock',
            data: {
                productName: product.name,
                currentStock: String(product.stockQuantity),
                reorderPoint: String(product.reorderPoint),
            },
            entityType: 'product',
            entityId: product.id,
        });
        sent++;
    }

    return NextResponse.json({ sent, alerts: alerts.length });
}
