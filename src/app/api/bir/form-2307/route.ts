import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/bir/form-2307?year=2026&quarter=2
// Returns creditable withholding tax data per payee for BIR Form 2307
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
    const quarter = parseInt(searchParams.get('quarter') ?? String(Math.ceil((new Date().getMonth() + 1) / 3)));

    const qStart = (quarter - 1) * 3 + 1;
    const startDate = new Date(year, qStart - 1, 1);
    const endDate = new Date(year, qStart + 2, 0, 23, 59, 59);

    // Pull from PayablesLedger as the source for payee payments
    const payments: any[] = await prisma.$queryRaw`
        SELECT
            pl.accountName      AS payeeName,
            pl.accountNumber    AS accountNo,
            SUM(pl.debitAmount) AS grossPayment,
            -- Withholding tax rate — defaulting to 2% for services (customizable)
            ROUND(SUM(pl.debitAmount) * 0.02, 2) AS withholdingTax
        FROM payables_ledger pl
        WHERE pl.date >= ${startDate} AND pl.date <= ${endDate}
        GROUP BY pl.accountName, pl.accountNumber
        ORDER BY pl.accountName ASC
    `;

    const profile: any = await prisma.businessProfile.findFirst();

    return NextResponse.json({
        period: { year, quarter, startDate, endDate },
        payorInfo: {
            businessName: profile?.businessName ?? '',
            tin: profile?.tin ?? '',
            address: profile?.address ?? '',
        },
        payees: payments.map((p: any) => ({
            payeeName: p.payeeName,
            accountNo: p.accountNo,
            grossPayment: Number(p.grossPayment),
            withholdingTax: Number(p.withholdingTax),
        })),
        totalGross: payments.reduce((s: number, p: any) => s + Number(p.grossPayment), 0),
        totalTax: payments.reduce((s: number, p: any) => s + Number(p.withholdingTax), 0),
    });
}
