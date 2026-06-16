import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// POST /api/reports/custom
// Dynamic report builder — filter by date, accounts, type, cost center, branch
// Body: { startDate, endDate, accountTypes?, accountNos?, groupBy, format }
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
        startDate,
        endDate,
        accountTypes,   // string[] e.g. ['Expense','Revenue']
        accountNos,     // number[] specific account numbers
        groupBy = 'account',  // 'account' | 'month' | 'account_type'
        format = 'json',      // 'json' | 'csv'
        title = 'Custom Report',
    } = body;

    if (!startDate || !endDate) {
        return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Build the base query dynamically
    let rows: any[];

    if (groupBy === 'month') {
        rows = await prisma.$queryRaw`
            SELECT
                DATE_FORMAT(t.date, '%Y-%m') AS period,
                a.account_type              AS accountType,
                SUM(tl.debit)               AS totalDebit,
                SUM(tl.credit)              AS totalCredit,
                SUM(tl.debit) - SUM(tl.credit) AS netAmount
            FROM transaction_line tl
            JOIN transaction t ON t.id = tl.transaction_id
            JOIN chart_of_account a ON a.account_no = tl.account_no
            WHERE t.date >= ${start} AND t.date <= ${end}
            GROUP BY DATE_FORMAT(t.date, '%Y-%m'), a.account_type
            ORDER BY period ASC, a.account_type ASC
        `;
    } else if (groupBy === 'account_type') {
        rows = await prisma.$queryRaw`
            SELECT
                a.account_type              AS accountType,
                SUM(tl.debit)               AS totalDebit,
                SUM(tl.credit)              AS totalCredit,
                SUM(tl.debit) - SUM(tl.credit) AS netAmount,
                COUNT(DISTINCT t.id)        AS transactionCount
            FROM transaction_line tl
            JOIN transaction t ON t.id = tl.transaction_id
            JOIN chart_of_account a ON a.account_no = tl.account_no
            WHERE t.date >= ${start} AND t.date <= ${end}
            GROUP BY a.account_type
            ORDER BY a.account_type ASC
        `;
    } else {
        // Default: group by account
        rows = await prisma.$queryRaw`
            SELECT
                a.account_no                AS accountNo,
                a.account_name              AS accountName,
                a.account_type              AS accountType,
                SUM(tl.debit)               AS totalDebit,
                SUM(tl.credit)              AS totalCredit,
                SUM(tl.debit) - SUM(tl.credit) AS netAmount,
                COUNT(DISTINCT t.id)        AS transactionCount
            FROM transaction_line tl
            JOIN transaction t ON t.id = tl.transaction_id
            JOIN chart_of_account a ON a.account_no = tl.account_no
            WHERE t.date >= ${start} AND t.date <= ${end}
            GROUP BY a.account_no, a.account_name, a.account_type
            ORDER BY a.account_no ASC
        `;
    }

    // Apply optional filters in-memory (to avoid dynamic SQL injection risk)
    let filtered = rows;
    if (accountTypes?.length) {
        filtered = filtered.filter((r: any) => accountTypes.includes(r.accountType));
    }
    if (accountNos?.length) {
        filtered = filtered.filter((r: any) => accountNos.includes(Number(r.accountNo)));
    }

    const data = filtered.map((r: any) => ({
        ...r,
        accountNo: r.accountNo ? Number(r.accountNo) : undefined,
        totalDebit: parseFloat(Number(r.totalDebit ?? 0).toFixed(2)),
        totalCredit: parseFloat(Number(r.totalCredit ?? 0).toFixed(2)),
        netAmount: parseFloat(Number(r.netAmount ?? 0).toFixed(2)),
        transactionCount: Number(r.transactionCount ?? 0),
    }));

    const totals = {
        totalDebit: parseFloat(data.reduce((s: number, r: any) => s + r.totalDebit, 0).toFixed(2)),
        totalCredit: parseFloat(data.reduce((s: number, r: any) => s + r.totalCredit, 0).toFixed(2)),
        netAmount: parseFloat(data.reduce((s: number, r: any) => s + r.netAmount, 0).toFixed(2)),
    };

    if (format === 'csv') {
        const BOM = '﻿';
        const cols = groupBy === 'month'
            ? ['Period', 'Account Type', 'Total Debit', 'Total Credit', 'Net Amount']
            : groupBy === 'account_type'
            ? ['Account Type', 'Total Debit', 'Total Credit', 'Net Amount', 'Transactions']
            : ['Account No', 'Account Name', 'Account Type', 'Total Debit', 'Total Credit', 'Net Amount', 'Transactions'];

        const header = cols.join(',');
        const rowsCSV = data.map((r: any) => {
            if (groupBy === 'month') return `${r.period},${r.accountType},${r.totalDebit},${r.totalCredit},${r.netAmount}`;
            if (groupBy === 'account_type') return `${r.accountType},${r.totalDebit},${r.totalCredit},${r.netAmount},${r.transactionCount}`;
            return `${r.accountNo},"${r.accountName}",${r.accountType},${r.totalDebit},${r.totalCredit},${r.netAmount},${r.transactionCount}`;
        });

        const csv = BOM + [header, ...rowsCSV].join('\n');
        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${title.replace(/\s+/g, '_')}.csv"`,
            },
        });
    }

    return NextResponse.json({
        title,
        parameters: { startDate: start, endDate: end, groupBy, accountTypes, accountNos },
        rowCount: data.length,
        data,
        totals,
    });
}
