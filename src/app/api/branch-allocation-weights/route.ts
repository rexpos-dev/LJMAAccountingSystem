import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all branch allocation weights
export async function GET() {
    try {
        const weights = await prisma.branchAllocationWeight.findMany({
            include: { branch: true },
            orderBy: { branch: { name: 'asc' } },
        });
        return NextResponse.json(weights);
    } catch (error) {
        console.error('Error fetching branch allocation weights:', error);
        return NextResponse.json({ error: 'Failed to fetch weights' }, { status: 500 });
    }
}

// POST / PUT - Upsert branch allocation weights (bulk)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { weights } = body as { weights: { branchId: string; weight: number }[] };

        if (!weights || !Array.isArray(weights)) {
            return NextResponse.json({ error: 'weights array is required' }, { status: 400 });
        }

        const results = await prisma.$transaction(
            weights.map((w) =>
                prisma.branchAllocationWeight.upsert({
                    where: { branchId: w.branchId },
                    update: { weight: w.weight },
                    create: { branchId: w.branchId, weight: w.weight },
                })
            )
        );

        return NextResponse.json(results);
    } catch (error) {
        console.error('Error saving branch allocation weights:', error);
        return NextResponse.json({ error: 'Failed to save weights' }, { status: 500 });
    }
}
