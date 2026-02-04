import { NextResponse } from 'next/server';
import { getAccounts, getBankAccounts, createAccount, updateAccount, deleteAccount } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bank = searchParams.get('bank');
    const type = searchParams.get('type');

    let accounts: any[] = [];
    if (bank === 'yes') {
      accounts = await getBankAccounts();
    } else {
      accounts = await getAccounts();
    }

    if (type && Array.isArray(accounts)) {
      accounts = accounts.filter((acc: any) => acc.account_type === type);
    }

    return NextResponse.json(Array.isArray(accounts) ? accounts : []);
  } catch (error) {
    console.error('Error fetching accounts API:', error);
    // Always return an array to prevent frontend crashes
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { account_no, account_type_no, account_name, account_description, account_type, header, bank, account_category, account_status, fs_category, balance } = body;

    if (!account_no || !account_type_no || !account_name || !account_type) {
      return NextResponse.json({ error: 'Missing required fields: account_no, account_type_no, account_name, account_type' }, { status: 400 });
    }

    const account = await createAccount({
      account_no: parseInt(account_no, 10),
      account_type_no: parseInt(account_type_no, 10),
      account_name,
      account_description,
      account_type,
      header: header || 'No',
      bank: bank || 'No',
      account_category,
      account_status: account_status || 'Active',
      fs_category,
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
    const { id, account_no, account_type_no, account_name, account_description, account_type, header, bank, account_category, account_status, fs_category, balance } = body;

    if (!id) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (account_no !== undefined) updateData.account_no = parseInt(account_no, 10);
    if (account_name !== undefined) updateData.account_name = account_name;
    if (account_description !== undefined) updateData.account_description = account_description;
    if (account_type !== undefined) updateData.account_type = account_type;
    if (header !== undefined) updateData.header = header;
    if (bank !== undefined) updateData.bank = bank;
    if (account_category !== undefined) updateData.account_category = account_category;
    if (account_status !== undefined) updateData.account_status = account_status;
    if (fs_category !== undefined) updateData.fs_category = fs_category;
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
