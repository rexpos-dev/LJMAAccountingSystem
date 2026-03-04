import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Find the invoice with the highest customerPONumber
        // Using simple string sort/max for now, assuming numeric values starting at 10000
        const lastInvoice = await prisma.invoice.findFirst({
            where: {
                customerPONumber: {
                    not: null
                }
            },
            orderBy: {
                createdAt: 'desc', // Try to get the latest created one as a proxy for max number
            },
        });

        let nextNumber = '20000'; // Different series than Invoice Number (10000)

        if (lastInvoice && lastInvoice.customerPONumber) {
            const lastNum = parseInt(lastInvoice.customerPONumber, 10);
            if (!isNaN(lastNum)) {
                nextNumber = (lastNum + 1).toString();
            }
        }

        return NextResponse.json({ nextNumber });
    } catch (error) {
        console.error('Error fetching next PO number:', error);
        return NextResponse.json({ nextNumber: '20000' }, { status: 500 });
    }
}
