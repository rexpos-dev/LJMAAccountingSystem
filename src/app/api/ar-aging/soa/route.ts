import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/ar-aging/soa?customerId=xxx&asOf=2026-06-05
// Returns full Statement of Account for a customer
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    if (!customerId) return NextResponse.json({ error: 'customerId required' }, { status: 400 });

    const asOf = searchParams.get('asOf') ? new Date(searchParams.get('asOf')!) : new Date();

    const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: {
            invoices: {
                where: { status: { notIn: ['Void', 'Cancelled'] }, date: { lte: asOf } },
                include: { items: true },
                orderBy: { date: 'asc' },
            },
        },
    });

    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

    const payments: any[] = await prisma.$queryRaw`
        SELECT cp.invoiceId, cp.amount, cp.date, cp.reference
        FROM customer_payment cp
        JOIN invoice i ON i.id = cp.invoiceId
        WHERE i.customerId = ${customerId} AND cp.status != 'Voided' AND cp.date <= ${asOf}
        ORDER BY cp.date ASC
    `;

    const paidMap = new Map<string, { total: number; payments: any[] }>();
    for (const p of payments) {
        if (!paidMap.has(p.invoiceId)) paidMap.set(p.invoiceId, { total: 0, payments: [] });
        const entry = paidMap.get(p.invoiceId)!;
        entry.total += Number(p.amount);
        entry.payments.push(p);
    }

    const invoicesWithBalance = customer.invoices.map(inv => {
        const paid = paidMap.get(inv.id)?.total ?? 0;
        const balance = Math.max(Number(inv.total) - paid, 0);
        const dueDate = inv.dueDate ?? inv.date;
        const daysOverdue = balance > 0
            ? Math.floor((asOf.getTime() - new Date(dueDate).getTime()) / (1000 * 60 * 60 * 24))
            : 0;
        return { ...inv, paid, balance, daysOverdue };
    });

    const totalBalance = invoicesWithBalance.reduce((s, i) => s + i.balance, 0);
    const totalPaid = invoicesWithBalance.reduce((s, i) => s + i.paid, 0);

    const profile: any = await prisma.businessProfile.findFirst();

    return NextResponse.json({
        asOf,
        company: {
            businessName: profile?.businessName ?? '',
            address: profile?.address ?? '',
            email: profile?.email ?? '',
            contactTel: profile?.contactTel ?? '',
        },
        customer: {
            id: customer.id,
            code: customer.code,
            customerName: customer.customerName,
            address: customer.address,
            email: customer.email,
            creditLimit: customer.creditLimit,
        },
        invoices: invoicesWithBalance,
        summary: { totalInvoiced: totalBalance + totalPaid, totalPaid, totalBalance },
    });
}
