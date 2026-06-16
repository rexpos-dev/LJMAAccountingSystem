import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { postJournalEntry } from '@/lib/journal-helper';

function nextRunDate(current: Date, frequency: string, dayOfMonth?: number | null): Date {
    const d = new Date(current);
    if (frequency === 'monthly') {
        d.setMonth(d.getMonth() + 1);
        if (dayOfMonth) d.setDate(dayOfMonth);
    } else if (frequency === 'weekly') {
        d.setDate(d.getDate() + 7);
    } else if (frequency === 'yearly') {
        d.setFullYear(d.getFullYear() + 1);
    }
    return d;
}

// POST /api/recurring-transactions/run
// Processes all due recurring transactions (nextRunDate <= today)
export async function POST(request: NextRequest) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const due = await prisma.recurringTransaction.findMany({
        where: { isActive: true, nextRunDate: { lte: now } },
    });

    const results: { id: string; description: string; status: string; error?: string }[] = [];
    const postedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;

    for (const rec of due) {
        try {
            const lines = JSON.parse(rec.lines) as { accountNo: number; debit: number; credit: number; particulars?: string }[];
            const ref = `${rec.referencePrefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;

            await postJournalEntry({
                date: now,
                referenceId: ref,
                particulars: rec.description,
                user: postedBy,
                lines: lines.map(l => ({
                    accountNo: l.accountNo,
                    debit: l.debit ?? 0,
                    credit: l.credit ?? 0,
                })),
            });

            await prisma.recurringTransaction.update({
                where: { id: rec.id },
                data: {
                    lastRunDate: now,
                    nextRunDate: nextRunDate(now, rec.frequency, rec.dayOfMonth),
                },
            });

            results.push({ id: rec.id, description: rec.description, status: 'posted' });
        } catch (err: any) {
            results.push({ id: rec.id, description: rec.description, status: 'failed', error: err.message });
        }
    }

    return NextResponse.json({ processed: results.length, results });
}
