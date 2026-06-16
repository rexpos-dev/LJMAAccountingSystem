import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/dashboard/kpi?asOf=2026-06-05
// Returns all executive KPIs in one call
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const asOf = request.nextUrl.searchParams.get('asOf')
        ? new Date(request.nextUrl.searchParams.get('asOf')!)
        : new Date();

    const now = asOf;
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
        revenueMTD,
        revenueYTD,
        revenueLastYear,
        revenueLastMonth,
        bankBalances,
        arAging,
        topCustomers,
        expensesYTD,
        expensesMTD,
        pendingRequests,
        lowStockCount,
    ] = await Promise.all([

        // Revenue MTD
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(total),0) AS amount FROM invoice
            WHERE date >= ${startOfMonth} AND date <= ${now}
            AND status NOT IN ('Void','Cancelled')
        `,

        // Revenue YTD
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(total),0) AS amount FROM invoice
            WHERE date >= ${startOfYear} AND date <= ${now}
            AND status NOT IN ('Void','Cancelled')
        `,

        // Revenue Last Year (same period)
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(total),0) AS amount FROM invoice
            WHERE date >= ${startOfLastYear} AND date <= ${endOfLastYear}
            AND status NOT IN ('Void','Cancelled')
        `,

        // Revenue Last Month
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(total),0) AS amount FROM invoice
            WHERE date >= ${startOfLastMonth} AND date <= ${endOfLastMonth}
            AND status NOT IN ('Void','Cancelled')
        `,

        // Cash position: sum of all active bank account balances
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(balance),0) AS total FROM bank_account WHERE isActive = true
        `,

        // AR Aging buckets
        prisma.$queryRaw<any[]>`
            SELECT
                SUM(CASE WHEN DATEDIFF(${now}, COALESCE(i.dueDate, i.date)) <= 0 THEN i.total - COALESCE(p.paid,0) ELSE 0 END) AS current_amt,
                SUM(CASE WHEN DATEDIFF(${now}, COALESCE(i.dueDate, i.date)) BETWEEN 1  AND 30  THEN i.total - COALESCE(p.paid,0) ELSE 0 END) AS days_1_30,
                SUM(CASE WHEN DATEDIFF(${now}, COALESCE(i.dueDate, i.date)) BETWEEN 31 AND 60  THEN i.total - COALESCE(p.paid,0) ELSE 0 END) AS days_31_60,
                SUM(CASE WHEN DATEDIFF(${now}, COALESCE(i.dueDate, i.date)) BETWEEN 61 AND 90  THEN i.total - COALESCE(p.paid,0) ELSE 0 END) AS days_61_90,
                SUM(CASE WHEN DATEDIFF(${now}, COALESCE(i.dueDate, i.date)) > 90 THEN i.total - COALESCE(p.paid,0) ELSE 0 END) AS days_90plus
            FROM invoice i
            LEFT JOIN (SELECT invoiceId, SUM(amount) AS paid FROM customer_payment WHERE status != 'Voided' GROUP BY invoiceId) p ON p.invoiceId = i.id
            WHERE i.status NOT IN ('Paid','Void','Cancelled')
        `,

        // Top 5 customers by YTD revenue
        prisma.$queryRaw<any[]>`
            SELECT c.customerName, SUM(i.total) AS revenue
            FROM invoice i JOIN customer c ON c.id = i.customerId
            WHERE i.date >= ${startOfYear} AND i.date <= ${now}
            AND i.status NOT IN ('Void','Cancelled')
            GROUP BY c.customerName ORDER BY revenue DESC LIMIT 5
        `,

        // Total expenses YTD
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(tl.debit) - SUM(tl.credit), 0) AS amount
            FROM transaction_line tl
            JOIN transaction t ON t.id = tl.transaction_id
            JOIN chart_of_account a ON a.account_no = tl.account_no
            WHERE t.date >= ${startOfYear} AND t.date <= ${now}
            AND a.account_type IN ('Expense','Cost of Sales')
        `,

        // Total expenses MTD (burn rate)
        prisma.$queryRaw<any[]>`
            SELECT COALESCE(SUM(tl.debit) - SUM(tl.credit), 0) AS amount
            FROM transaction_line tl
            JOIN transaction t ON t.id = tl.transaction_id
            JOIN chart_of_account a ON a.account_no = tl.account_no
            WHERE t.date >= ${startOfMonth} AND t.date <= ${now}
            AND a.account_type IN ('Expense','Cost of Sales')
        `,

        // Pending requests count
        prisma.$queryRaw<any[]>`
            SELECT COUNT(*) AS cnt FROM request WHERE status IN ('To Verify','To Approve','To Process')
        `,

        // Low stock count
        prisma.product.count({
            where: { isActive: true, reorderPoint: { gt: 0 } },
        }),
    ]);

    const cash = Number(bankBalances[0]?.total ?? 0);
    const burnRateMTD = Number(expensesMTD[0]?.amount ?? 0);
    const revYTD = Number(revenueYTD[0]?.amount ?? 0);
    const expYTD = Number(expensesYTD[0]?.amount ?? 0);
    const netIncomeYTD = revYTD - expYTD;

    // Runway: months of cash at current burn rate
    const runway = burnRateMTD > 0 ? parseFloat((cash / burnRateMTD).toFixed(1)) : null;

    // Revenue growth YoY
    const revLastYear = Number(revenueLastYear[0]?.amount ?? 0);
    const revenueGrowthYoY = revLastYear > 0
        ? parseFloat((((revYTD - revLastYear) / revLastYear) * 100).toFixed(2))
        : null;

    // Revenue growth MoM
    const revLastMonth = Number(revenueLastMonth[0]?.amount ?? 0);
    const revMTD = Number(revenueMTD[0]?.amount ?? 0);
    const revenueGrowthMoM = revLastMonth > 0
        ? parseFloat((((revMTD - revLastMonth) / revLastMonth) * 100).toFixed(2))
        : null;

    const aging = arAging[0] ?? {};
    const totalAR = [aging.current_amt, aging.days_1_30, aging.days_31_60, aging.days_61_90, aging.days_90plus]
        .reduce((s, v) => s + Number(v ?? 0), 0);

    // Low stock products
    const lowStockProducts = await prisma.product.findMany({
        where: { isActive: true, reorderPoint: { gt: 0 }, stockQuantity: { lte: prisma.product.fields.reorderPoint } },
        select: { name: true, stockQuantity: true, reorderPoint: true },
        take: 5,
    });

    return NextResponse.json({
        asOf,
        revenue: {
            mtd: parseFloat(revMTD.toFixed(2)),
            ytd: parseFloat(revYTD.toFixed(2)),
            lastYear: parseFloat(revLastYear.toFixed(2)),
            growthYoY: revenueGrowthYoY,
            growthMoM: revenueGrowthMoM,
        },
        cashPosition: parseFloat(cash.toFixed(2)),
        expenses: {
            ytd: parseFloat(expYTD.toFixed(2)),
            mtd: parseFloat(burnRateMTD.toFixed(2)),
        },
        netIncome: {
            ytd: parseFloat(netIncomeYTD.toFixed(2)),
            margin: revYTD > 0 ? parseFloat(((netIncomeYTD / revYTD) * 100).toFixed(2)) : 0,
        },
        burnRate: parseFloat(burnRateMTD.toFixed(2)),
        runway,
        arAging: {
            current: parseFloat(Number(aging.current_amt ?? 0).toFixed(2)),
            days1_30: parseFloat(Number(aging.days_1_30 ?? 0).toFixed(2)),
            days31_60: parseFloat(Number(aging.days_31_60 ?? 0).toFixed(2)),
            days61_90: parseFloat(Number(aging.days_61_90 ?? 0).toFixed(2)),
            days90plus: parseFloat(Number(aging.days_90plus ?? 0).toFixed(2)),
            total: parseFloat(totalAR.toFixed(2)),
        },
        topCustomers: topCustomers.map((c: any) => ({
            name: c.customerName,
            revenue: parseFloat(Number(c.revenue).toFixed(2)),
        })),
        pendingRequests: Number((pendingRequests[0] as any)?.cnt ?? 0),
        lowStock: {
            count: lowStockCount,
            items: lowStockProducts,
        },
    });
}
