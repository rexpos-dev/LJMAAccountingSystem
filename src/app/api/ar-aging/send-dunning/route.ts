import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { sendEmail } from '@/lib/email';

// POST /api/ar-aging/send-dunning
// Body: { customerId, invoiceId?, level (1|2|3) }
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { customerId, invoiceId, level } = await request.json();
    if (!customerId || !level) return NextResponse.json({ error: 'customerId and level required' }, { status: 400 });

    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    if (!customer.email) return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 });

    // Build outstanding summary
    const invoices: any[] = invoiceId
        ? await prisma.$queryRaw`
            SELECT i.invoiceNumber, i.dueDate, i.total,
                COALESCE((SELECT SUM(cp.amount) FROM customer_payment cp WHERE cp.invoiceId = i.id AND cp.status != 'Voided'), 0) AS paid
            FROM invoice i
            WHERE i.customerId = ${customerId} AND i.id = ${invoiceId}
            AND i.status NOT IN ('Paid', 'Void', 'Cancelled') ORDER BY i.dueDate ASC`
        : await prisma.$queryRaw`
            SELECT i.invoiceNumber, i.dueDate, i.total,
                COALESCE((SELECT SUM(cp.amount) FROM customer_payment cp WHERE cp.invoiceId = i.id AND cp.status != 'Voided'), 0) AS paid
            FROM invoice i
            WHERE i.customerId = ${customerId}
            AND i.status NOT IN ('Paid', 'Void', 'Cancelled') ORDER BY i.dueDate ASC`;

    const outstanding = invoices.reduce((s: number, i: any) => s + Math.max(Number(i.total) - Number(i.paid), 0), 0);
    const oldestInv = invoices[0];
    const daysOverdue = oldestInv?.dueDate
        ? Math.floor((Date.now() - new Date(oldestInv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const sent = await sendEmail({
        to: customer.email,
        template: 'payment_overdue',
        data: {
            customerName: customer.customerName,
            invoiceNumber: oldestInv?.invoiceNumber ?? 'Multiple Invoices',
            dueDate: oldestInv?.dueDate ? new Date(oldestInv.dueDate).toLocaleDateString('en-PH') : '-',
            daysOverdue: String(daysOverdue),
            amount: outstanding,
        },
        entityType: 'customer',
        entityId: customerId,
    });

    if (sent) {
        await prisma.dunningLog.create({
            data: { customerId, invoiceId: invoiceId ?? null, level: parseInt(String(level)), sentTo: customer.email },
        });
    }

    return NextResponse.json({ success: sent, sentTo: customer.email, outstanding });
}
