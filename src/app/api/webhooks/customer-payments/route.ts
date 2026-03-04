import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postJournalEntry } from '@/lib/journal-helper';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Expected payload from Customer Payments server
        const { receiptId, customerId, date, amount, paymentMethod } = body;

        if (!receiptId || !customerId || !date || amount === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: receiptId, customerId, date, amount' },
                { status: 400 }
            );
        }

        const payment = await prisma.$transaction(async (tx) => {
            // Save local record of the Customer Payment
            const customerPayment = await tx.customerPayment.create({
                data: {
                    receiptId,
                    customerId,
                    date: new Date(date),
                    amount: parseFloat(amount),
                    paymentMethod: paymentMethod || 'Cash',
                    syncedToLedger: true
                }
            });

            // Auto-post the journal entry
            // Debit: Cash on Hand (1000)
            // Credit: Accounts Receivable (1210)
            await postJournalEntry({
                date: customerPayment.date,
                referenceId: customerPayment.receiptId,
                particulars: `Customer Payment - ${paymentMethod}`,
                user: 'System',
                lines: [
                    { accountNo: 1000, debit: customerPayment.amount }, // Cash
                    { accountNo: 1210, credit: customerPayment.amount } // Decrease AR
                ]
            }, tx);

            return customerPayment;
        });

        return NextResponse.json(
            { message: 'Customer payment synced and journal posted successfully', payment },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Webhook error for Customer Payment sync:', error);

        // Handle uniqueness constraint if the same receipt is sent twice
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'This receipt ID has already been synced.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to sync Customer Payment to journal', details: error.message },
            { status: 500 }
        );
    }
}
