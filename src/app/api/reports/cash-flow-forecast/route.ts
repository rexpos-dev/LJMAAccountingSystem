import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/reports/cash-flow-forecast?days=90&startDate=2026-06-05
// Projects daily net cash flow for the next N days
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const days = Math.min(parseInt(searchParams.get('days') ?? '90'), 180);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);

    // ── INFLOWS: Unpaid invoices due within the period ──────────────────────
    const dueInvoices: any[] = await prisma.$queryRaw`
        SELECT
            COALESCE(i.dueDate, DATE_ADD(i.date, INTERVAL 30 DAY)) AS dueDate,
            i.total - COALESCE(p.paid, 0) AS outstanding,
            c.customerName
        FROM invoice i
        JOIN customer c ON c.id = i.customerId
        LEFT JOIN (SELECT invoiceId, SUM(amount) AS paid FROM customer_payment WHERE status != 'Voided' GROUP BY invoiceId) p ON p.invoiceId = i.id
        WHERE i.status NOT IN ('Paid','Void','Cancelled')
        AND i.total - COALESCE(p.paid,0) > 0
        AND COALESCE(i.dueDate, DATE_ADD(i.date, INTERVAL 30 DAY)) BETWEEN ${startDate} AND ${endDate}
        ORDER BY dueDate ASC
    `;

    // ── OUTFLOWS: Recurring transactions due within the period ──────────────
    const recurringTxns = await prisma.recurringTransaction.findMany({
        where: { isActive: true, nextRunDate: { lte: endDate } },
    });

    // ── OUTFLOWS: Payroll periods scheduled within the period ───────────────
    const payrollPeriods = await prisma.payrollPeriod.findMany({
        where: {
            payDate: { gte: startDate, lte: endDate },
            status: { not: 'Paid' },
        },
        include: { entries: { select: { netPay: true } } },
    });

    // Build daily buckets
    type DayBucket = { date: string; inflows: number; outflows: number; netFlow: number; cumulativeFlow: number; items: string[] };
    const bucketMap = new Map<string, DayBucket>();

    const addToBucket = (date: Date, flow: 'in' | 'out', amount: number, label: string) => {
        const key = date.toISOString().slice(0, 10);
        if (!bucketMap.has(key)) {
            bucketMap.set(key, { date: key, inflows: 0, outflows: 0, netFlow: 0, cumulativeFlow: 0, items: [] });
        }
        const b = bucketMap.get(key)!;
        if (flow === 'in') b.inflows += amount;
        else b.outflows += amount;
        b.items.push(`${flow === 'in' ? '↑' : '↓'} ${label}: ₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`);
    };

    // Add invoice inflows
    for (const inv of dueInvoices) {
        addToBucket(new Date(inv.dueDate), 'in', Number(inv.outstanding), `${inv.customerName} (AR)`);
    }

    // Add recurring transaction outflows
    for (const rec of recurringTxns) {
        const lines = JSON.parse(rec.lines) as { debit?: number; credit?: number }[];
        const totalDebit = lines.reduce((s, l) => s + (l.debit ?? 0), 0);
        if (totalDebit > 0) {
            let d = new Date(rec.nextRunDate);
            while (d <= endDate) {
                if (d >= startDate) addToBucket(d, 'out', totalDebit, rec.description);
                // Advance to next occurrence
                if (rec.frequency === 'monthly') d.setMonth(d.getMonth() + 1);
                else if (rec.frequency === 'weekly') d.setDate(d.getDate() + 7);
                else if (rec.frequency === 'yearly') d.setFullYear(d.getFullYear() + 1);
                else break;
            }
        }
    }

    // Add payroll outflows
    for (const period of payrollPeriods) {
        const totalNetPay = period.entries.reduce((s, e) => s + e.netPay, 0);
        addToBucket(new Date(period.payDate), 'out', totalNetPay, `Payroll: ${period.name}`);
    }

    // Sort buckets by date and compute cumulative flow
    const sortedKeys = Array.from(bucketMap.keys()).sort();
    let cumulative = 0;
    const timeline: DayBucket[] = sortedKeys.map(key => {
        const b = bucketMap.get(key)!;
        b.netFlow = parseFloat((b.inflows - b.outflows).toFixed(2));
        cumulative += b.netFlow;
        b.cumulativeFlow = parseFloat(cumulative.toFixed(2));
        b.inflows = parseFloat(b.inflows.toFixed(2));
        b.outflows = parseFloat(b.outflows.toFixed(2));
        return b;
    });

    // 30/60/90 day summaries
    const summary = (n: number) => {
        const cutoff = new Date(startDate);
        cutoff.setDate(cutoff.getDate() + n);
        const slice = timeline.filter(b => new Date(b.date) <= cutoff);
        return {
            totalInflows: parseFloat(slice.reduce((s, b) => s + b.inflows, 0).toFixed(2)),
            totalOutflows: parseFloat(slice.reduce((s, b) => s + b.outflows, 0).toFixed(2)),
            netFlow: parseFloat(slice.reduce((s, b) => s + b.netFlow, 0).toFixed(2)),
        };
    };

    return NextResponse.json({
        startDate,
        endDate,
        days,
        summaries: { days30: summary(30), days60: summary(60), days90: summary(90) },
        timeline,
    });
}
