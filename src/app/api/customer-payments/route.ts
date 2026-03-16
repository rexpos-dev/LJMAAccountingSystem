import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Added prisma import
import { fetchWithCache } from '@/lib/api-cache';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        console.log('Fetching customer payments from external API...');

        const externalUrl = new URL('http://192.168.1.163:3000/api/customer-payments');
        if (search) {
            externalUrl.searchParams.append('search', search);
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const result = await fetchWithCache<any>(
                externalUrl.toString(),
                {
                    headers: { 'Cache-Control': 'no-cache' },
                    signal: controller.signal
                },
                15
            );

            clearTimeout(timeoutId);

            if (result.success && result.data) {
                return NextResponse.json(result.data);
            }
            console.warn(`External API returned false success or no data: ${result.error}, falling back to local DB`);
        } catch (fetchError: any) {
            console.warn(`Failed to fetch from POS API: ${fetchError.message}, falling back to local DB`);
        }

        // --- Local Fallback ---
        console.log('Fetching customer payments from local cache...');

        const localPayments = await prisma.customerPayment.findMany({
            orderBy: { date: 'desc' }
        });

        // Filter by search locally if requested
        let filteredPayments = localPayments;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredPayments = localPayments.filter(p =>
                p.receiptId.toLowerCase().includes(searchLower) ||
                p.paymentMethod.toLowerCase().includes(searchLower)
            );
        }

        // Map Prisma format to what `useCustomerPayments` expects
        const formattedPayments = filteredPayments.map(payment => ({
            id: payment.id,
            customer_id: payment.customerId,
            payment_type: payment.paymentMethod,
            payment_date: payment.date.toISOString(),
            amount: payment.amount.toString(),
            reference: payment.receiptId,
            note: "Offline Data",
            created_at: payment.createdAt.toISOString(),
            updated_at: payment.createdAt.toISOString(), // fallback
            customer_name: "Local Cache",
            contact_number: ""
        }));

        // The frontend expects { data: [...] } OR [...]
        // Since useCustomerPayments checks `responseData.data`, we can return either.
        return NextResponse.json({ data: formattedPayments });
    } catch (error: any) {
        console.error('❌ [API/Customer-Payments] Error fetching customer payments:', error);

        return NextResponse.json(
            {
                error: 'Failed to fetch customer payments',
                details: error.message || error.toString(),
            },
            { status: 500 }
        );
    }
}
