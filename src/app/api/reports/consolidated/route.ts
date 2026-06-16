import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/reports/consolidated?startDate=2026-01-01&endDate=2026-06-30
// Returns consolidated P&L across all branches
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    const branches = await prisma.branch.findMany({ orderBy: { id: 'asc' } });

    // Total Revenue (company-wide)
    const revenue: any[] = await prisma.$queryRaw`
        SELECT COALESCE(SUM(total), 0) AS amount
        FROM invoice
        WHERE date >= ${startDate} AND date <= ${endDate}
        AND status NOT IN ('Void', 'Cancelled')
    `;

    // Expenses by account (company-wide)
    const expenses: any[] = await prisma.$queryRaw`
        SELECT
            a.account_type  AS accountType,
            a.account_name  AS accountName,
            a.account_no    AS accountNo,
            SUM(tl.debit) - SUM(tl.credit) AS amount
        FROM transaction_line tl
        JOIN transaction t ON t.id = tl.transaction_id
        JOIN chart_of_account a ON a.account_no = tl.account_no
        WHERE t.date >= ${startDate} AND t.date <= ${endDate}
        AND a.account_type IN ('Expense', 'Cost of Sales')
        GROUP BY a.account_type, a.account_name, a.account_no
        ORDER BY a.account_type, a.account_name
    `;

    const totalRevenue = Number(revenue[0]?.amount ?? 0);
    const expenseLines = expenses.map((e: any) => ({
        accountType: e.accountType,
        accountName: e.accountName,
        accountNo: Number(e.accountNo),
        amount: parseFloat(Number(e.amount).toFixed(2)),
    }));
    const totalExpenses = expenseLines.reduce((s, e) => s + e.amount, 0);
    const grossProfit = totalRevenue - expenseLines.filter(e => e.accountType === 'Cost of Sales').reduce((s, e) => s + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    return NextResponse.json({
        period: { startDate, endDate },
        branchCount: branches.length,
        revenue: parseFloat(totalRevenue.toFixed(2)),
        costOfSales: parseFloat(expenseLines.filter(e => e.accountType === 'Cost of Sales').reduce((s, e) => s + e.amount, 0).toFixed(2)),
        grossProfit: parseFloat(grossProfit.toFixed(2)),
        grossProfitMargin: totalRevenue > 0 ? parseFloat(((grossProfit / totalRevenue) * 100).toFixed(2)) : 0,
        operatingExpenses: expenseLines.filter(e => e.accountType === 'Expense'),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netIncome: parseFloat(netIncome.toFixed(2)),
        netProfitMargin: totalRevenue > 0 ? parseFloat(((netIncome / totalRevenue) * 100).toFixed(2)) : 0,
    });
}
