import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

// GET /api/bank-reconciliation/:importId — view all lines for an import
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ importId: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { importId } = await params;

    const importRecord = await prisma.bankStatementImport.findUnique({ where: { id: importId } });
    if (!importRecord) return NextResponse.json({ error: 'Import not found' }, { status: 404 });

    const lines = await prisma.bankStatementLine.findMany({
        where: { importId },
        orderBy: { txDate: 'asc' },
    });

    const summary = {
        total: lines.length,
        matched: lines.filter(l => l.matched).length,
        unmatched: lines.filter(l => !l.matched).length,
        totalDebits: lines.reduce((s, l) => s + l.debit, 0),
        totalCredits: lines.reduce((s, l) => s + l.credit, 0),
    };

    return NextResponse.json({ import: importRecord, lines, summary });
}
