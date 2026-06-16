import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { computeSchedule } from '@/lib/depreciation';

export async function GET(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const status = request.nextUrl.searchParams.get('status');
    const assets = await prisma.fixedAsset.findMany({
        where: status ? { status } : undefined,
        include: { depreciationEntries: { orderBy: [{ year: 'desc' }, { month: 'desc' }], take: 1 } },
        orderBy: { purchaseDate: 'desc' },
    });

    return NextResponse.json(assets);
}

export async function POST(request: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    const asset = await prisma.fixedAsset.create({
        data: {
            assetCode: body.assetCode,
            name: body.name,
            description: body.description,
            category: body.category,
            location: body.location,
            purchaseDate: new Date(body.purchaseDate),
            cost: parseFloat(body.cost),
            salvageValue: parseFloat(body.salvageValue ?? 0),
            usefulLifeYears: parseInt(body.usefulLifeYears),
            depreciationMethod: body.depreciationMethod ?? 'Straight-Line',
            accountNo: body.accountNo ? parseInt(body.accountNo) : null,
            accDepAccountNo: body.accDepAccountNo ? parseInt(body.accDepAccountNo) : null,
            depExpAccountNo: body.depExpAccountNo ? parseInt(body.depExpAccountNo) : null,
        },
    });

    // Pre-compute and store the full depreciation schedule
    const schedule = computeSchedule({
        cost: asset.cost,
        salvageValue: asset.salvageValue,
        usefulLifeYears: asset.usefulLifeYears,
        depreciationMethod: asset.depreciationMethod,
        purchaseDate: asset.purchaseDate,
    });

    await prisma.assetDepreciationEntry.createMany({
        data: schedule.map(e => ({
            assetId: asset.id,
            year: e.year,
            month: e.month,
            depreciationAmt: e.depreciationAmt,
            bookValue: e.bookValue,
        })),
        skipDuplicates: true,
    });

    return NextResponse.json(asset, { status: 201 });
}
