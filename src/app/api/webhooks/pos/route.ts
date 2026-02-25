import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postJournalEntry } from '@/lib/journal-helper';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Expected payload from POS server
        const { receiptId, date, amount, cashier } = body;

        if (!receiptId || !date || amount === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: receiptId, date, amount' },
                { status: 400 }
            );
        }

        const sale = await prisma.$transaction(async (tx) => {
            // Save local record of the POS sale
            const posSale = await tx.posSale.create({
                data: {
                    receiptId,
                    date: new Date(date),
                    amount: parseFloat(amount),
                    cashier: cashier || 'System',
                    syncedToLedger: true
                }
            });

            // Auto-post the journal entry
            // Debit: Cash on Hand (1000)
            // Credit: Sales Revenue (4000)
            await postJournalEntry({
                date: posSale.date,
                referenceId: posSale.receiptId,
                particulars: 'POS Sale',
                user: posSale.cashier || 'System',
                lines: [
                    { accountNo: 1000, debit: posSale.amount }, // Cash
                    { accountNo: 4000, credit: posSale.amount } // Revenue
                ]
            }, tx);

            return posSale;
        });

        return NextResponse.json(
            { message: 'POS sale synced and journal posted successfully', sale },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Webhook error for POS sync:', error);

        // Handle uniqueness constraint if the same receipt is sent twice
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'This receipt ID has already been synced.' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to sync POS sale to journal', details: error.message },
            { status: 500 }
        );
    }
}
