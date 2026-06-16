import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const asset = await prisma.fixedAsset.findUnique({
        where: { id },
        include: { depreciationEntries: { orderBy: [{ year: 'asc' }, { month: 'asc' }] } },
    });

    if (!asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(asset);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    const asset = await prisma.fixedAsset.update({
        where: { id },
        data: {
            ...(body.name !== undefined && { name: body.name }),
            ...(body.description !== undefined && { description: body.description }),
            ...(body.category !== undefined && { category: body.category }),
            ...(body.location !== undefined && { location: body.location }),
            ...(body.status !== undefined && { status: body.status }),
            ...(body.disposalDate !== undefined && { disposalDate: new Date(body.disposalDate) }),
            ...(body.disposalAmount !== undefined && { disposalAmount: parseFloat(body.disposalAmount) }),
        },
    });

    return NextResponse.json(asset);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await prisma.fixedAsset.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
