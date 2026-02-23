import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyTransactionToAccountBalance } from '@/lib/database';

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
            accountNumber: entry.accountNumber || null,
            accountName: entry.accountName || null,
            accountDescription: entry.accountDescription || null,
            debitAmount: Number(entry.debitAmount) || 0,
            creditAmount: Number(entry.creditAmount) || 0,
            user: entry.user || null,
        }));

        const result = await prisma.payablesLedger.createMany({
            data: entries,
        });

        // Auto update account balances
        for (const entry of entries) {
            if (entry.accountNumber && (entry.debitAmount !== 0 || entry.creditAmount !== 0)) {
                await applyTransactionToAccountBalance(entry.accountNumber, entry.debitAmount, entry.creditAmount);
            }
        }

        return NextResponse.json(
            { message: 'Ledger entries recorded successfully', count: result.count },
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
