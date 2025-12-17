import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return NextResponse.json({ error: 'customerId is required' }, { status: 400 });
    }

    const agg = await prisma.loyaltyPoint.aggregate({
      _sum: { totalPoints: true },
      where: { customerId }
    });

    const total = Number(agg._sum.totalPoints ?? 0);

    return NextResponse.json({ total });
  } catch (error) {
    console.error('Error fetching loyalty points summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 });
  }
}
