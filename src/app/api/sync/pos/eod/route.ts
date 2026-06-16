import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { postJournalEntry } from '@/lib/journal-helper';
import { dispatchWebhookEvent } from '@/lib/api-gateway';

// POST /api/sync/pos/eod
// End-of-Day reconciliation — aggregates all POS sales for a date and posts to GL
// Body: { date, machineId?, cashAccountNo?, revenueAccountNo? }
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const date = body.date ? new Date(body.date) : new Date();
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

    const cashAccountNo = body.cashAccountNo ?? 1000;
    const revenueAccountNo = body.revenueAccountNo ?? 4000;

    // Aggregate POS sales for the day
    const sales: any[] = await prisma.$queryRaw`
        SELECT COUNT(*) AS receiptCount, SUM(amount) AS totalSales
        FROM pos_sale
        WHERE date >= ${startOfDay} AND date <= ${endOfDay}
    `;

    const totalSales = Number(sales[0]?.totalSales ?? 0);
    const receiptCount = Number(sales[0]?.receiptCount ?? 0);

    if (totalSales === 0) {
        return NextResponse.json({ message: 'No POS sales found for this date', date });
    }

    // Check if already reconciled
    const existing = await prisma.posEodReconciliation.findFirst({
        where: { date: { gte: startOfDay, lte: endOfDay } },
    });
    if (existing?.journalPosted) {
        return NextResponse.json({ error: 'EOD already posted for this date', existing }, { status: 400 });
    }

    const postedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;
    const ref = `EOD-POS-${date.toISOString().slice(0, 10)}`;

    // Post consolidated journal entry
    await postJournalEntry({
        date,
        referenceId: ref,
        particulars: `POS End-of-Day — ${date.toLocaleDateString('en-PH')} (${receiptCount} receipts)`,
        user: postedBy,
        lines: [
            { accountNo: cashAccountNo, debit: totalSales, credit: 0 },
            { accountNo: revenueAccountNo, debit: 0, credit: totalSales },
        ],
    });

    const recon = await prisma.posEodReconciliation.upsert({
        where: { id: existing?.id ?? '' },
        update: { totalSales, totalReceipts: receiptCount, journalPosted: true },
        create: {
            date: startOfDay,
            machineId: body.machineId ?? null,
            totalSales,
            totalReceipts: receiptCount,
            journalPosted: true,
        },
    });

    // Dispatch webhook event
    await dispatchWebhookEvent('pos.eod.completed', {
        date: date.toISOString().slice(0, 10),
        totalSales,
        receiptCount,
        reference: ref,
    });

    return NextResponse.json({ success: true, totalSales, receiptCount, reference: ref, recon });
}

// GET /api/sync/pos/eod?startDate=...&endDate=...
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    const records = await prisma.posEodReconciliation.findMany({
        where: { date: { gte: startDate, lte: endDate } },
        orderBy: { date: 'desc' },
    });

    const totals = {
        totalSales: records.reduce((s, r) => s + r.totalSales, 0),
        totalReceipts: records.reduce((s, r) => s + r.totalReceipts, 0),
    };

    return NextResponse.json({ records, totals });
}
