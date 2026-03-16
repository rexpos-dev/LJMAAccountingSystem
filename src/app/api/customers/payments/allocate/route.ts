import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactions, paymentData } = body;

        // 1. Update the external POS API if needed
        if (paymentData && paymentData.reference) {
            try {
                console.log(`[API] Pushing allocation to origin POS: ${paymentData.reference}`);
                const externalResponse = await fetch('http://192.168.1.163:3000/api/customer-payments/allocate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        reference: paymentData.reference,
                        status: 'Allocated',
                        amount: paymentData.amount,
                        date: paymentData.date,
                        customerId: paymentData.customerId
                    })
                });

                if (!externalResponse.ok) {
                    console.warn('[API] Failed to update external POS API, proceeding with local transactions anyway.');
                }
            } catch (externalError) {
                console.error('[API] Error pushing to external POS API:', externalError);
                // We proceed since local accounting is the priority for this system
            }
        }

        // 2. Save transactions to local ledger (Transactions table)
        if (transactions && Array.isArray(transactions)) {
            console.log(`[API] Saving ${transactions.length} ledger entries locally.`);

            // Assuming transaction creation logic similar to /api/transactions
            // We can reuse the structure but ensure it's linked if needed
            const createdTransactions = await prisma.$transaction(
                transactions.map((tx: any) =>
                    prisma.transaction.create({
                        data: {
                            accountNumber: tx.accountNumber,
                            accountName: tx.accountName,
                            date: new Date(tx.date),
                            transNo: tx.transNo,
                            particulars: tx.particulars,
                            debit: tx.debit || 0,
                            credit: tx.credit || 0,
                            type: tx.type || 'Payment',
                            ledger: tx.ledger || 'General',
                            user: tx.user || 'System'
                        }
                    })
                )
            );

            return NextResponse.json({
                success: true,
                message: 'Payment processed and saved successfully.',
                transactions: createdTransactions
            });
        }

        return NextResponse.json({ error: 'No transaction data provided' }, { status: 400 });
    } catch (error: any) {
        console.error('❌ [API/Allocate] Error processing payment:', error);
        return NextResponse.json(
            { error: 'Failed to process payment', details: error.message },
            { status: 500 }
        );
    }
}
