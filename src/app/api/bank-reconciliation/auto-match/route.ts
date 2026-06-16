import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// POST /api/bank-reconciliation/auto-match
// Body: { importId, bankAccountId, toleranceDays? (default 3), toleranceAmount? (default 0) }
// Matches bank statement lines against BankTransaction records
export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { importId, bankAccountId, toleranceDays = 3, toleranceAmount = 0 } = await request.json();

    const unmatched = await prisma.bankStatementLine.findMany({
        where: { importId, matched: false },
    });

    // Fetch bank transactions for that account
    const bankTxns: any[] = await prisma.$queryRaw`
        SELECT id, amount, date, type, reference, description
        FROM bank_transaction
        WHERE bankAccountId = ${bankAccountId}
        ORDER BY date ASC
    `;

    let matched = 0;
    const matchResults: { lineId: string; txId: string | null; confidence: string }[] = [];

    for (const line of unmatched) {
        const lineAmt = line.credit > 0 ? line.credit : -line.debit;
        const lineDate = new Date(line.txDate);

        let bestMatch: any = null;
        let bestScore = 0;

        for (const tx of bankTxns) {
            const txDate = new Date(tx.date);
            const dateDiff = Math.abs((lineDate.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
            const txAmt = Number(tx.amount);
            const amtDiff = Math.abs(Math.abs(lineAmt) - Math.abs(txAmt));

            if (dateDiff > toleranceDays) continue;
            if (amtDiff > toleranceAmount + 0.01) continue;

            const score = 100 - (dateDiff * 5) - (amtDiff * 2);
            if (score > bestScore) { bestScore = score; bestMatch = tx; }
        }

        if (bestMatch) {
            await prisma.bankStatementLine.update({
                where: { id: line.id },
                data: { matched: true, matchedTxId: bestMatch.id },
            });
            matched++;
            matchResults.push({ lineId: line.id, txId: bestMatch.id, confidence: bestScore >= 90 ? 'High' : 'Medium' });
        } else {
            matchResults.push({ lineId: line.id, txId: null, confidence: 'No match' });
        }
    }

    await prisma.bankStatementImport.update({
        where: { id: importId },
        data: { matchedCount: { increment: matched } },
    });

    return NextResponse.json({
        totalLines: unmatched.length,
        matched,
        unmatched: unmatched.length - matched,
        results: matchResults,
    });
}
