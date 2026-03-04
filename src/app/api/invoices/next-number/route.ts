import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Find the invoice with the highest invoiceNumber
        // Note: This assumes invoiceNumber is numeric or sortable as a string in a way that works for max
        // Since it's a string, "10" < "2", so we might need better logic if it's mixed. 
        // For now assuming it's a number string.

        // We can't easily convert to int in the query with Prisma for standard sort.
        // So we fetch the latest created one, or we fetch all and find max (inefficient but safe for small data), 
        // or we assume it was created last.
        const lastInvoice = await prisma.invoice.findFirst({
            orderBy: {
                createdAt: 'desc', // Assuming sequential creation
            },
        });

        let nextNumber = '10000';

        if (lastInvoice && lastInvoice.invoiceNumber) {
            const lastNum = parseInt(lastInvoice.invoiceNumber, 10);
            if (!isNaN(lastNum)) {
                nextNumber = (lastNum + 1).toString();
            }
        }

        return NextResponse.json({ nextNumber });
    } catch (error) {
        console.error('Error fetching next invoice number:', error);
        return NextResponse.json({ nextNumber: '10000' }, { status: 500 });
    }
}
