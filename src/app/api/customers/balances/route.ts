import { NextResponse } from 'next/server';
import { fetchWithCache } from '@/lib/api-cache';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const force = searchParams.get('force') === 'true';

        console.log('Fetching customer balances from external API...');

        const externalUrl = new URL('http://192.168.1.163:3000/api/customers/balances');
        if (search) {
            externalUrl.searchParams.append('search', search);
        }

        const result = await fetchWithCache<any>(
            externalUrl.toString(),
            { headers: { 'Cache-Control': 'no-cache' } },
            15,
            force
        );

        if (!result.success || !result.data) {
            console.warn(`External API unavailable for customer balances. Returning empty array. Error: ${result.error}`);
            return NextResponse.json([]);
        }

        const externalData = result.data?.data || result.data || [];

        if (!Array.isArray(externalData)) {
            console.warn('[API/Customers/Balances] External data is not an array:', externalData);
            return NextResponse.json([]);
        }

        // Enhance data with local calculations if possible
        const balances = await Promise.all(externalData.map(async (item: any) => {
            // Find local customer to get the correct code/account number
            const localCustomer = await prisma.customer.findFirst({
                where: {
                    OR: [
                        { id: item.id },
                        { code: item.id },
                        { customerName: item.name }
                    ]
                }
            });

            const lookupId = localCustomer?.code || item.id;

            // Get local transactions for this customer to sum up payments
            const localPayments = await prisma.transaction.aggregate({
                where: {
                    accountNumber: lookupId,
                    credit: { gt: 0 }
                },
                _sum: {
                    credit: true
                }
            });

            const amountPaid = localPayments._sum.credit || 0;
            const balance = Number(item.balance || 0);
            const totalAmount = balance + Number(amountPaid);

            return {
                ...item,
                amountPaid,
                totalAmount,
                balance
            };
        }));

        return NextResponse.json(balances);
    } catch (error: any) {
        console.warn('❌ [API/Customers/Balances] Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
