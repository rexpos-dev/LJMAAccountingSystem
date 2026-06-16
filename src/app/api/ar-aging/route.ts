import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/ar-aging?asOf=2026-06-05&customerId=xxx
// Returns AR aging buckets: Current, 1-30, 31-60, 61-90, 90+ days
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const asOf = searchParams.get('asOf') ? new Date(searchParams.get('asOf')!) : new Date();
    const customerId = searchParams.get('customerId') ?? undefined;

    const invoices: any[] = customerId
        ? await prisma.$queryRaw`
            SELECT i.id, i.invoiceNumber, i.date, i.dueDate, i.total, i.status,
                   c.id AS customerId, c.customerName, c.email, c.creditLimit
            FROM invoice i JOIN customer c ON c.id = i.customerId
            WHERE i.status NOT IN ('Paid', 'Void', 'Cancelled') AND c.id = ${customerId}
            ORDER BY c.customerName ASC, i.dueDate ASC`
        : await prisma.$queryRaw`
            SELECT i.id, i.invoiceNumber, i.date, i.dueDate, i.total, i.status,
                   c.id AS customerId, c.customerName, c.email, c.creditLimit
            FROM invoice i JOIN customer c ON c.id = i.customerId
            WHERE i.status NOT IN ('Paid', 'Void', 'Cancelled')
            ORDER BY c.customerName ASC, i.dueDate ASC`;

    // Get payments applied per invoice
    const payments: any[] = await prisma.$queryRaw`
        SELECT invoiceId, SUM(amount) AS totalPaid
        FROM customer_payment
        WHERE status != 'Voided'
        GROUP BY invoiceId
    `;
    const paidMap = new Map(payments.map((p: any) => [p.invoiceId, Number(p.totalPaid)]));

    // Compute aging per invoice
    type AgingBucket = { current: number; days1_30: number; days31_60: number; days61_90: number; days90plus: number };
    const customerMap = new Map<string, {
        customerId: string; customerName: string; email: string; creditLimit: number;
        invoices: any[]; aging: AgingBucket; totalOutstanding: number;
    }>();

    for (const inv of invoices) {
        const paid = paidMap.get(inv.id) ?? 0;
        const outstanding = Math.max(Number(inv.total) - paid, 0);
        if (outstanding <= 0) continue;

        const dueDate = inv.dueDate ? new Date(inv.dueDate) : new Date(inv.date);
        const daysOverdue = Math.floor((asOf.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        const bucket: keyof AgingBucket =
            daysOverdue <= 0 ? 'current' :
            daysOverdue <= 30 ? 'days1_30' :
            daysOverdue <= 60 ? 'days31_60' :
            daysOverdue <= 90 ? 'days61_90' : 'days90plus';

        if (!customerMap.has(inv.customerId)) {
            customerMap.set(inv.customerId, {
                customerId: inv.customerId,
                customerName: inv.customerName,
                email: inv.email ?? '',
                creditLimit: Number(inv.creditLimit ?? 0),
                invoices: [],
                aging: { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90plus: 0 },
                totalOutstanding: 0,
            });
        }

        const cust = customerMap.get(inv.customerId)!;
        cust.aging[bucket] += outstanding;
        cust.totalOutstanding += outstanding;
        cust.invoices.push({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            date: inv.date,
            dueDate: inv.dueDate,
            total: Number(inv.total),
            paid,
            outstanding,
            daysOverdue,
            bucket,
        });
    }

    const result = Array.from(customerMap.values());

    const grandTotal = {
        current: result.reduce((s, c) => s + c.aging.current, 0),
        days1_30: result.reduce((s, c) => s + c.aging.days1_30, 0),
        days31_60: result.reduce((s, c) => s + c.aging.days31_60, 0),
        days61_90: result.reduce((s, c) => s + c.aging.days61_90, 0),
        days90plus: result.reduce((s, c) => s + c.aging.days90plus, 0),
        total: result.reduce((s, c) => s + c.totalOutstanding, 0),
    };

    return NextResponse.json({ asOf, customers: result, grandTotal });
}
