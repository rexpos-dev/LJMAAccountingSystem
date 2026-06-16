import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/bir/alphalist?year=2026&format=json|csv
// Returns Alphalist of payees with withholding tax (for BIR Annual Alphalist)
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
    const format = searchParams.get('format') ?? 'json';

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const payees: any[] = await prisma.$queryRaw`
        SELECT
            pl.accountName                    AS payeeName,
            pl.accountNumber                  AS accountNo,
            SUM(pl.debitAmount)               AS grossAmount,
            ROUND(SUM(pl.debitAmount) * 0.02, 2) AS withholdingTax,
            'EWT'                             AS taxType,
            '2%'                              AS taxRate
        FROM payables_ledger pl
        WHERE pl.date >= ${startDate} AND pl.date <= ${endDate}
        GROUP BY pl.accountName, pl.accountNumber
        ORDER BY pl.accountName ASC
    `;

    const profile: any = await prisma.businessProfile.findFirst();

    const data = payees.map((p: any, i: number) => ({
        seq: i + 1,
        payeeName: p.payeeName,
        accountNo: p.accountNo,
        grossAmount: parseFloat(Number(p.grossAmount).toFixed(2)),
        withholdingTax: parseFloat(Number(p.withholdingTax).toFixed(2)),
        taxType: p.taxType,
        taxRate: p.taxRate,
    }));

    if (format === 'csv') {
        const BOM = '﻿';
        const header = 'Seq,Payee Name,Account No,Gross Amount,Withholding Tax,Tax Type,Tax Rate\n';
        const rows = data.map(d =>
            `${d.seq},"${d.payeeName}","${d.accountNo}",${d.grossAmount},${d.withholdingTax},${d.taxType},${d.taxRate}`
        ).join('\n');
        const csv = BOM + header + rows;

        return new NextResponse(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="alphalist_${year}.csv"`,
            },
        });
    }

    return NextResponse.json({
        year,
        payorInfo: {
            businessName: profile?.businessName ?? '',
            tin: profile?.tin ?? '',
        },
        payees: data,
        totals: {
            grossAmount: data.reduce((s, d) => s + d.grossAmount, 0),
            withholdingTax: data.reduce((s, d) => s + d.withholdingTax, 0),
        },
    });
}
