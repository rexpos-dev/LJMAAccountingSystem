import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/budgets/vs-actual?year=2026&month=6
// Returns per-account: budget amount, actual amount, variance, variance %
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : null;

    // Date range for actual transactions
    const startDate = month
        ? new Date(year, month - 1, 1)
        : new Date(year, 0, 1);
    const endDate = month
        ? new Date(year, month, 0, 23, 59, 59)
        : new Date(year, 11, 31, 23, 59, 59);

    // Budget for the period
    const budgets = await prisma.budgetItem.findMany({
        where: { year, ...(month ? { month } : { month: { not: 0 } }) },
    });

    // Actual from chart of accounts (sum debits/credits per account in period)
    const actuals: any[] = await prisma.$queryRaw`
        SELECT
            tl.account_no AS accountNo,
            SUM(tl.debit)  AS totalDebit,
            SUM(tl.credit) AS totalCredit
        FROM transaction_line tl
        JOIN transaction t ON t.id = tl.transaction_id
        WHERE t.date >= ${startDate} AND t.date <= ${endDate}
        GROUP BY tl.account_no
    `;

    // Fetch account names
    const accountNos = [...new Set([
        ...budgets.map(b => b.accountNo),
        ...actuals.map((a: any) => Number(a.accountNo)),
    ])];

    // Fetch accounts by querying each individually then merging (avoids dynamic IN clause issue)
    const accounts: any[] = accountNos.length > 0
        ? await prisma.$queryRaw`
            SELECT account_no, account_name, account_type
            FROM chart_of_account
            WHERE account_no IN (${accountNos.join(',') as any})
          `
        : [];

    const accountMap = new Map(accounts.map(a => [Number(a.account_no), a]));

    // Aggregate budget per accountNo
    const budgetMap = new Map<number, number>();
    for (const b of budgets) {
        budgetMap.set(b.accountNo, (budgetMap.get(b.accountNo) ?? 0) + b.amount);
    }

    // Build result
    const result = accountNos.map(accountNo => {
        const acct = accountMap.get(accountNo);
        const budget = budgetMap.get(accountNo) ?? 0;
        const actual = actuals.find((a: any) => Number(a.accountNo) === accountNo);
        const actualAmount = actual ? (Number(actual.totalDebit) - Number(actual.totalCredit)) : 0;
        const variance = actualAmount - budget;
        const variancePct = budget !== 0 ? (variance / budget) * 100 : null;

        return {
            accountNo,
            accountName: acct?.account_name ?? `Account ${accountNo}`,
            accountType: acct?.account_type ?? '',
            budget,
            actual: actualAmount,
            variance,
            variancePct: variancePct !== null ? parseFloat(variancePct.toFixed(2)) : null,
        };
    });

    return NextResponse.json({ year, month, data: result });
}
