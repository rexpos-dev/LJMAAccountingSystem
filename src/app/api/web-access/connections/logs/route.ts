import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const logs = await prisma.apiCallLog.findMany({
      orderBy: { called_at: 'desc' },
      take: limit,
      include: {
        connection: { select: { name: true, endpoint_url: true } },
      },
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch logs', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
