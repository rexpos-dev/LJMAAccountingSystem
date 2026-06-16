import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// POST /api/bank-reconciliation/import
// Accepts CSV upload: Date, Description, Debit, Credit, Balance
// CSV must have header row: date,description,debit,credit,balance
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const bankAccountId = formData.get('bankAccountId') as string;
    const file = formData.get('file') as File;

    if (!bankAccountId || !file) {
        return NextResponse.json({ error: 'bankAccountId and CSV file are required' }, { status: 400 });
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);

    if (lines.length < 2) {
        return NextResponse.json({ error: 'CSV must have header row + at least one data row' }, { status: 400 });
    }

    // Parse header to find column indexes (case-insensitive)
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z]/g, ''));
    const colIdx = {
        date: headers.findIndex(h => h.includes('date')),
        description: headers.findIndex(h => h.includes('desc') || h.includes('narr') || h.includes('detail')),
        debit: headers.findIndex(h => h === 'debit' || h === 'withdrawal' || h === 'dr'),
        credit: headers.findIndex(h => h === 'credit' || h === 'deposit' || h === 'cr'),
        balance: headers.findIndex(h => h.includes('balance') || h === 'bal'),
        reference: headers.findIndex(h => h.includes('ref') || h.includes('cheque') || h.includes('check')),
    };

    if (colIdx.date === -1 || colIdx.description === -1) {
        return NextResponse.json({ error: 'CSV must have at least Date and Description columns' }, { status: 400 });
    }

    const importRecord = await prisma.bankStatementImport.create({
        data: { bankAccountId, fileName: file.name, lineCount: 0, matchedCount: 0 },
    });

    const parsedLines = [];
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const dateStr = cols[colIdx.date];
        const txDate = new Date(dateStr);
        if (isNaN(txDate.getTime())) continue; // skip invalid dates

        parsedLines.push({
            importId: importRecord.id,
            txDate,
            description: colIdx.description >= 0 ? (cols[colIdx.description] ?? '') : '',
            debit: colIdx.debit >= 0 ? parseFloat(cols[colIdx.debit]?.replace(/,/g, '') || '0') : 0,
            credit: colIdx.credit >= 0 ? parseFloat(cols[colIdx.credit]?.replace(/,/g, '') || '0') : 0,
            balance: colIdx.balance >= 0 ? parseFloat(cols[colIdx.balance]?.replace(/,/g, '') || '0') : null,
            reference: colIdx.reference >= 0 ? (cols[colIdx.reference] ?? null) : null,
        });
    }

    await prisma.bankStatementLine.createMany({ data: parsedLines });
    await prisma.bankStatementImport.update({
        where: { id: importRecord.id },
        data: { lineCount: parsedLines.length },
    });

    return NextResponse.json({
        importId: importRecord.id,
        fileName: file.name,
        linesImported: parsedLines.length,
    }, { status: 201 });
}
