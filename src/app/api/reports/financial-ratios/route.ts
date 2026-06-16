import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/reports/financial-ratios?asOf=2026-06-05
// Computes key financial ratios from the Chart of Accounts balances
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const asOf = request.nextUrl.searchParams.get('asOf')
        ? new Date(request.nextUrl.searchParams.get('asOf')!)
        : new Date();

    const startOfYear = new Date(asOf.getFullYear(), 0, 1);

    // ── Balance Sheet accounts (current balances) ─────────────────────────────
    const bsAccounts: any[] = await prisma.$queryRaw`
        SELECT
            a.account_no, a.account_name, a.account_type, a.account_category,
            a.balance,
            COALESCE((
                SELECT SUM(tl.debit) - SUM(tl.credit)
                FROM transaction_line tl
                JOIN transaction t ON t.id = tl.transaction_id
                WHERE tl.account_no = a.account_no AND t.date <= ${asOf}
            ), 0) AS periodBalance
        FROM chart_of_account a
        WHERE a.account_type IN ('Asset','Liability','Equity')
        ORDER BY a.account_no
    `;

    // ── Income Statement (YTD) ────────────────────────────────────────────────
    const isAccounts: any[] = await prisma.$queryRaw`
        SELECT
            a.account_no, a.account_name, a.account_type,
            SUM(tl.credit) - SUM(tl.debit) AS netAmount
        FROM transaction_line tl
        JOIN transaction t ON t.id = tl.transaction_id
        JOIN chart_of_account a ON a.account_no = tl.account_no
        WHERE t.date >= ${startOfYear} AND t.date <= ${asOf}
        AND a.account_type IN ('Revenue','Expense','Cost of Sales')
        GROUP BY a.account_no, a.account_name, a.account_type
    `;

    // Aggregate by type
    const sum = (accounts: any[], types: string[]) =>
        accounts
            .filter(a => types.includes(a.account_type))
            .reduce((s, a) => s + Number(a.periodBalance ?? a.balance ?? 0), 0);

    const isSum = (accounts: any[], types: string[]) =>
        accounts
            .filter(a => types.includes(a.account_type))
            .reduce((s, a) => s + Number(a.netAmount ?? 0), 0);

    const currentAssets = sum(bsAccounts.filter(a => (a.account_category ?? '').toLowerCase().includes('current')), ['Asset']);
    const totalAssets = sum(bsAccounts, ['Asset']);
    const inventory = bsAccounts
        .filter(a => a.account_type === 'Asset' && (a.account_name ?? '').toLowerCase().includes('inventor'))
        .reduce((s, a) => s + Number(a.periodBalance ?? 0), 0);

    const currentLiabilities = sum(
        bsAccounts.filter(a => (a.account_category ?? '').toLowerCase().includes('current')),
        ['Liability']
    );
    const totalLiabilities = sum(bsAccounts, ['Liability']);
    const totalEquity = sum(bsAccounts, ['Equity']);

    const revenue = isSum(isAccounts, ['Revenue']);
    const costOfSales = Math.abs(isSum(isAccounts, ['Cost of Sales']));
    const expenses = Math.abs(isSum(isAccounts, ['Expense']));
    const grossProfit = revenue - costOfSales;
    const netIncome = revenue - costOfSales - expenses;

    const safe = (n: number, d: number) => d !== 0 ? parseFloat((n / d).toFixed(4)) : null;
    const pct = (n: number, d: number) => d !== 0 ? parseFloat(((n / d) * 100).toFixed(2)) : null;

    const ratios = {
        // Liquidity
        currentRatio: safe(currentAssets, currentLiabilities),
        quickRatio: safe(currentAssets - inventory, currentLiabilities),

        // Leverage / Solvency
        debtToEquity: safe(totalLiabilities, totalEquity),
        debtRatio: safe(totalLiabilities, totalAssets),
        equityRatio: safe(totalEquity, totalAssets),

        // Profitability
        grossProfitMargin: pct(grossProfit, revenue),
        netProfitMargin: pct(netIncome, revenue),
        returnOnAssets: pct(netIncome, totalAssets),
        returnOnEquity: pct(netIncome, totalEquity),

        // Absolute
        revenue: parseFloat(revenue.toFixed(2)),
        grossProfit: parseFloat(grossProfit.toFixed(2)),
        netIncome: parseFloat(netIncome.toFixed(2)),
        totalAssets: parseFloat(totalAssets.toFixed(2)),
        totalLiabilities: parseFloat(totalLiabilities.toFixed(2)),
        totalEquity: parseFloat(totalEquity.toFixed(2)),
    };

    const ratings = {
        currentRatio: ratios.currentRatio === null ? 'N/A' : ratios.currentRatio >= 2 ? 'Healthy' : ratios.currentRatio >= 1 ? 'Adequate' : 'Critical',
        quickRatio: ratios.quickRatio === null ? 'N/A' : ratios.quickRatio >= 1 ? 'Healthy' : 'Watch',
        debtToEquity: ratios.debtToEquity === null ? 'N/A' : ratios.debtToEquity <= 1 ? 'Low Risk' : ratios.debtToEquity <= 2 ? 'Moderate' : 'High Risk',
        netProfitMargin: ratios.netProfitMargin === null ? 'N/A' : ratios.netProfitMargin >= 15 ? 'Excellent' : ratios.netProfitMargin >= 5 ? 'Good' : ratios.netProfitMargin >= 0 ? 'Watch' : 'Loss',
    };

    return NextResponse.json({ asOf, period: { startOfYear, asOf }, ratios, ratings });
}
