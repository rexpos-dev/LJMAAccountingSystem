import { NextResponse } from 'next/server';
import { getAccounts, getBankAccounts, createAccount, updateAccount, deleteAccount } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bank = searchParams.get('bank');
    const type = searchParams.get('type');

    let accounts;
    if (bank === 'yes') {
      accounts = await getBankAccounts();
    } else {
      accounts = await getAccounts();
    }

    // Filter by type if provided
    if (type) {
      accounts = accounts.filter((acc: any) => acc.type === type);
    }

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accnt_no, accnt_type_no, name, type, header, bank, category, balance } = body;

    if (!accnt_no || !accnt_type_no || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields: accnt_no, accnt_type_no, name, type' }, { status: 400 });
    }

    const account = await createAccount({
      accnt_no: parseInt(accnt_no, 10),
      accnt_type_no: parseInt(accnt_type_no, 10),
      name,
      type,
      header: header || 'No',
      bank: bank || 'No',
      category,
      balance: balance || 0,
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    console.error('Error creating account:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Account number already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, accnt_no, accnt_type_no, name, type, header, bank, category, balance } = body;

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (accnt_no !== undefined) updateData.accnt_no = parseInt(accnt_no, 10);
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (header !== undefined) updateData.header = header;
    if (bank !== undefined) updateData.bank = bank;
    if (category !== undefined) updateData.category = category;
    if (balance !== undefined) updateData.balance = parseFloat(balance) || 0;

    const account = await updateAccount(id, updateData);

    return NextResponse.json(account);
  } catch (error: any) {
    console.error('Error updating account:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Account number already exists' }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    await deleteAccount(id);

    return NextResponse.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting account:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
