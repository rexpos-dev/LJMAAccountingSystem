import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/bir/vat-return?year=2026&month=6
// Returns output VAT (from invoices) and input VAT (from purchase orders) for 2550M filing
export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1));

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const VAT_RATE = 0.12;

    // Output VAT: from invoices (taxable sales)
    const salesRows: any[] = await prisma.$queryRaw`
        SELECT SUM(i.total) AS totalSales
        FROM invoice i
        JOIN customer c ON c.id = i.customerId
        WHERE i.date >= ${startDate}
          AND i.date <= ${endDate}
          AND i.status != 'Void'
          AND c.isTaxExempt = false
    `;
    const taxableSales = Number(salesRows[0]?.totalSales ?? 0);
    const vatableSales = taxableSales / 1.12; // ex-VAT
    const outputVat = vatableSales * VAT_RATE;

    // Input VAT: from purchase orders
    const poRows: any[] = await prisma.$queryRaw`
        SELECT SUM(po.totalAmount) AS totalPurchases
        FROM purchase_order po
        WHERE po.orderDate >= ${startDate}
          AND po.orderDate <= ${endDate}
          AND po.status != 'Cancelled'
    `;
    const totalPurchases = Number(poRows[0]?.totalPurchases ?? 0);
    const vatablePurchases = totalPurchases / 1.12;
    const inputVat = vatablePurchases * VAT_RATE;

    const vatPayable = Math.max(outputVat - inputVat, 0);
    const vatCarryOver = Math.min(inputVat - outputVat, 0); // if input > output, carry forward

    const profile: any = await prisma.businessProfile.findFirst();

    return NextResponse.json({
        period: { year, month, startDate, endDate },
        filerInfo: {
            businessName: profile?.businessName ?? '',
            tin: profile?.tin ?? '',
            address: profile?.address ?? '',
        },
        outputVat: {
            taxableSales: parseFloat(vatableSales.toFixed(2)),
            grossSales: parseFloat(taxableSales.toFixed(2)),
            outputVat: parseFloat(outputVat.toFixed(2)),
        },
        inputVat: {
            taxablePurchases: parseFloat(vatablePurchases.toFixed(2)),
            grossPurchases: parseFloat(totalPurchases.toFixed(2)),
            inputVat: parseFloat(inputVat.toFixed(2)),
        },
        summary: {
            vatPayable: parseFloat(vatPayable.toFixed(2)),
            excessInput: parseFloat(Math.abs(vatCarryOver).toFixed(2)),
        },
    });
}
