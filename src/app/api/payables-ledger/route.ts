import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postJournalEntry } from '@/lib/journal-helper';

export async function GET(request: NextRequest) {
    try {
        const entries = await prisma.payablesLedger.findMany({
            orderBy: { date: 'desc' },
        });
        return NextResponse.json(entries);
    } catch (error) {
        console.error('Error fetching payables ledger:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payables ledger entries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        if (!Array.isArray(data)) {
            return NextResponse.json(
                { error: 'Invalid data format. Expected an array of ledger entries.' },
                { status: 400 }
            );
        }

        const entries = data.map((entry: any) => ({
            date: new Date(entry.date),
            reference: entry.reference || null,
            ledger: entry.ledger || null,
            accountNumber: entry.accountNumber || null, // This is the Cash Account being paid from
            accountName: entry.accountName || null,
            accountDescription: entry.accountDescription || null,
            debitAmount: Number(entry.debitAmount) || 0,
            creditAmount: Number(entry.creditAmount) || 0,
            user: entry.user || null,
        }));

        const result = await prisma.$transaction(async (tx) => {
            const createdEntries = await tx.payablesLedger.createMany({
                data: entries,
            });

            // Auto update account balances and post to journal
            for (const entry of entries) {
                if (entry.accountNumber && (entry.debitAmount !== 0 || entry.creditAmount !== 0)) {
                    // Assuming Accounts Payable is account No. 2000
                    await postJournalEntry({
                        date: entry.date,
                        referenceId: entry.reference || 'PAYMENT',
                        particulars: `Payment to ${entry.ledger || 'Supplier'}`,
                        user: entry.user || 'System',
                        lines: [
                            { accountNo: 2000, debit: entry.debitAmount }, // Decrease AP
                            { accountNo: parseInt(entry.accountNumber, 10), credit: entry.debitAmount } // Decrease Cash Asset
                        ]
                    }, tx);
                }

                // Add to Audit Trail regardless of Account Number
                await prisma.auditLog.create({
                    data: {
                        date: entry.date,
                        actionType: 'Payables Ledger Posted',
                        transactionId: entry.reference || 'N/A', // fallback to reference
                        amount: Math.max(entry.debitAmount, entry.creditAmount),
                        details: entry.accountDescription || `Payable Entry to ${entry.ledger || 'Supplier'}`,
                        status: 'To Audit'
                    }
                });
            }

            return createdEntries;
        });

        return NextResponse.json(
            { message: 'Ledger entries and journal recorded successfully', count: data.length },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error saving payables ledger:', error);
        return NextResponse.json(
            { error: 'Failed to save payables ledger entries' },
            { status: 500 }
        );
    }
}
