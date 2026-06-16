import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { postJournalEntry } from '@/lib/journal-helper';

// POST /api/fixed-assets/:id/post-depreciation
// Body: { year, month }  — posts journal entry for that period's depreciation
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession() as any;
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { year, month } = await request.json();

    const asset = await prisma.fixedAsset.findUnique({ where: { id } });
    if (!asset) return NextResponse.json({ error: 'Asset not found' }, { status: 404 });

    const entry = await prisma.assetDepreciationEntry.findUnique({
        where: { assetId_year_month: { assetId: id, year, month } },
    });
    if (!entry) return NextResponse.json({ error: 'No depreciation entry for that period' }, { status: 404 });
    if (entry.posted) return NextResponse.json({ error: 'Already posted' }, { status: 400 });

    if (!asset.depExpAccountNo || !asset.accDepAccountNo) {
        return NextResponse.json({ error: 'Asset must have depExpAccountNo and accDepAccountNo set' }, { status: 400 });
    }

    const postedBy = `${session.firstName ?? ''} ${session.lastName ?? ''}`.trim() || session.username;
    const refDate = new Date(year, month - 1, 1);

    await postJournalEntry({
        date: refDate,
        referenceId: `DEP-${asset.assetCode}-${year}-${String(month).padStart(2, '0')}`,
        particulars: `Depreciation — ${asset.name} (${year}/${String(month).padStart(2, '0')})`,
        user: postedBy,
        lines: [
            { accountNo: asset.depExpAccountNo, debit: entry.depreciationAmt, credit: 0 },
            { accountNo: asset.accDepAccountNo, debit: 0, credit: entry.depreciationAmt },
        ],
    });

    await prisma.assetDepreciationEntry.update({
        where: { id: entry.id },
        data: { posted: true, postedAt: new Date() },
    });

    return NextResponse.json({ success: true });
}
