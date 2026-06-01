import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const [payments, total] = await prisma.$transaction([
      prisma.directPayment.findMany({
        where,
        orderBy: { transaction_date: 'desc' },
        take: limit,
        skip: offset,
        include: { allocations: true },
      }),
      prisma.directPayment.count({ where }),
    ]);

    return NextResponse.json({ payments, total });
  } catch (error: any) {
    console.error('Error fetching direct payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch direct payments', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transaction_date,
      pay_to,
      account_paid_from,
      method,
      amount,
      reference_number,
      check_number,
      journal_memo,
      allocations,
      created_by,
    } = body;

    if (!account_paid_from || !amount || !transaction_date) {
      return NextResponse.json(
        { error: 'Transaction date, source account, and amount are required' },
        { status: 400 }
      );
    }

    if (!allocations || allocations.length === 0) {
      return NextResponse.json(
        { error: 'At least one allocation line is required' },
        { status: 400 }
      );
    }

    const totalAllocated = allocations.reduce((s: number, a: any) => s + (parseFloat(a.amount) || 0), 0);
    if (Math.abs(totalAllocated - parseFloat(amount)) > 0.01) {
      return NextResponse.json(
        { error: 'Allocated total does not match the disbursement amount' },
        { status: 400 }
      );
    }

    const payment = await prisma.directPayment.create({
      data: {
        transaction_date: new Date(transaction_date),
        pay_to: pay_to?.trim() || null,
        account_paid_from: account_paid_from.trim(),
        method: method || 'Cash',
        amount: parseFloat(amount),
        reference_number: reference_number?.trim() || null,
        check_number: check_number?.trim() || null,
        journal_memo: journal_memo?.trim() || null,
        status: 'POSTED',
        created_by: created_by || null,
        allocations: {
          create: allocations.map((a: any) => ({
            account_name: a.account,
            amount: parseFloat(a.amount),
            entry_type: a.type,
          })),
        },
      },
      include: { allocations: true },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    console.error('Error creating direct payment:', error);
    return NextResponse.json(
      { error: 'Failed to save direct payment', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    );
  }
}
