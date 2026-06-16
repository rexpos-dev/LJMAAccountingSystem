import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/reports/branch-pl?branchId=xxx&startDate=2026-01-01&endDate=2026-06-30
// Returns P&L for a specific branch using BranchAllocationWeight
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(new Date().getFullYear(), 0, 1);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    if (!branchId) return NextResponse.json({ error: 'branchId required' }, { status: 400 });

    const branch = await prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) return NextResponse.json({ error: 'Branch not found' }, { status: 404 });

    // Get allocation weight for this branch
    const weight: any[] = await prisma.$queryRaw`
        SELECT weight FROM branch_allocation_weight WHERE branchId = ${branchId} LIMIT 1
    `;
    const allocationWeight = weight.length > 0 ? Number(weight[0].weight) / 100 : 1;

    // Revenue: from invoices linked to this branch (via branch field or allocation)
    const revenue: any[] = await prisma.$queryRaw`
        SELECT
            'Revenue' AS category,
            COALESCE(SUM(i.total), 0) AS amount
        FROM invoice i
        WHERE i.date >= ${startDate} AND i.date <= ${endDate}
        AND i.status NOT IN ('Void', 'Cancelled')
    `;

    // Expenses: from transactions allocated to this branch
    const expenses: any[] = await prisma.$queryRaw`
        SELECT
            a.account_type AS category,
            a.account_name AS accountName,
            a.account_no   AS accountNo,
            SUM(tl.debit) - SUM(tl.credit) AS amount
        FROM transaction_line tl
        JOIN transaction t ON t.id = tl.transaction_id
        JOIN chart_of_account a ON a.account_no = tl.account_no
        WHERE t.date >= ${startDate} AND t.date <= ${endDate}
        AND a.account_type IN ('Expense', 'Cost of Sales')
        GROUP BY a.account_type, a.account_name, a.account_no
        ORDER BY a.account_type, a.account_name
    `;

    const totalRevenue = Number(revenue[0]?.amount ?? 0) * allocationWeight;
    const expenseRows = expenses.map((e: any) => ({
        category: e.category,
        accountName: e.accountName,
        accountNo: Number(e.accountNo),
        amount: parseFloat((Number(e.amount) * allocationWeight).toFixed(2)),
    }));
    const totalExpenses = expenseRows.reduce((s, e) => s + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    return NextResponse.json({
        branch: { id: branch.id, name: (branch as any).name ?? branchId },
        period: { startDate, endDate },
        allocationWeight,
        revenue: parseFloat(totalRevenue.toFixed(2)),
        expenses: expenseRows,
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netIncome: parseFloat(netIncome.toFixed(2)),
    });
}
