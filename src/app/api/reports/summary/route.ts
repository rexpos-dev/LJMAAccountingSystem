import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure prisma is imported correctly

export async function GET() {
    try {
        const [
            invoiceCount,
            orderCount,
            customerCount,
            productCount,
            supplierCount,
            transactionCount
        ] = await Promise.all([
            prisma.invoice?.count().catch(() => 0) || 0,
            prisma.purchaseOrder?.count().catch(() => 0) || 0,
            prisma.customer?.count().catch(() => 0) || 0,
            prisma.product?.count().catch(() => 0) || 0,
            prisma.supplier?.count().catch(() => 0) || 0,
            prisma.transaction?.count().catch(() => 0) || 0
        ]);

        return NextResponse.json({
            hasInvoices: invoiceCount > 0,
            hasOrders: orderCount > 0,
            hasCustomers: customerCount > 0,
            hasProducts: productCount > 0,
            hasSuppliers: supplierCount > 0,
            hasFinancials: transactionCount > 0,
        });
    } catch (error) {
        console.error('Error fetching report summaries:', error);
        return NextResponse.json({ error: 'Failed to fetch report summaries' }, { status: 500 });
    }
}
