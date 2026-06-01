import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const payment = await prisma.directPayment.findUnique({
      where: { id: params.id },
      include: { allocations: true },
    });
    if (!payment) return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch payment', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { status } = body;

    const payment = await prisma.directPayment.update({
      where: { id: params.id },
      data: { status },
      include: { allocations: true },
    });

    return NextResponse.json(payment);
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to update payment', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.directPayment.update({
      where: { id: params.id },
      data: { status: 'VOIDED' },
    });
    return NextResponse.json({ message: 'Payment voided' });
  } catch (error: any) {
    if (error.code === 'P2025') return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    return NextResponse.json(
      { error: 'Failed to void payment', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
