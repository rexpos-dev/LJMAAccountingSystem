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
            // 1. Save local record of the Customer Payment
            const customerPayment = await tx.customerPayment.create({
                data: {
                    receiptId,
                    customerId,
                    date: new Date(date),
                    amount: parseFloat(amount),
                    paymentMethod: paymentMethod || 'Cash',
                    syncedToLedger: (paymentMethod?.toLowerCase() === 'cash' || !paymentMethod) // Only cash synced immediately
                }
            });

            // 2. Handle Banking Integration
            if (paymentMethod?.toLowerCase() !== 'cash' && paymentMethod) {
                // Find a bank account that contains the payment method name (e.g., "G-Cash", "BPI", etc.)
                // or just "Online"
                const bankAccount = await tx.bankAccount.findFirst({
                    where: {
                        OR: [
                            { account_name: { contains: paymentMethod } },
                            { account_name: { contains: 'Online' } }
                        ]
                    }
                }) || await tx.bankAccount.findFirst({ where: { is_active: true } });

                if (bankAccount) {
                    const bt = await tx.bankTransaction.create({
                        data: {
                            bankAccountId: bankAccount.id,
                            type: 'CASH_IN',
                            status: 'TO_AUDIT',
                            amount: customerPayment.amount,
                            balanceAfter: 0,
                            particulars: `Customer Payment - ${paymentMethod} (${customerPayment.receiptId})`,
                            sourceType: 'CUSTOMER_PAYMENT',
                            sourceId: customerPayment.id,
                            date: customerPayment.date
                        }
                    });

                    // Create Audit Log
                    await tx.auditLog.create({
                        data: {
                            actionType: 'Bank Deposit',
                            transactionId: bt.id,
                            amount: customerPayment.amount,
                            details: `Online Customer Payment (${paymentMethod}) requires audit.`,
                            status: 'To Audit'
                        }
                    });
                }
            } else {
                // Immediate post for Cash
                const { postJournalEntry } = await import('@/lib/journal-helper');
                await postJournalEntry({
                    date: customerPayment.date,
                    referenceId: customerPayment.receiptId,
                    particulars: `Customer Payment - Cash`,
                    user: 'System',
                    lines: [
                        { accountNo: 1000, debit: customerPayment.amount }, // Cash
                        { accountNo: 1210, credit: customerPayment.amount } // Decrease AR
                    ]
                }, tx);
            }

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
