import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTransactions, createTransaction, getTransactionsByAccount } from '@/lib/database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountNumber = searchParams.get('accountNumber');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    let transactions;
    if (accountNumber) {
      transactions = await getTransactionsByAccount(accountNumber);
    } else {
      transactions = await getTransactions(
        limit ? parseInt(limit, 10) : undefined,
        offset ? parseInt(offset, 10) : undefined
      );
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle both single transaction and multiple transactions (for journal entries)
    const transactions = Array.isArray(body.transactions) ? body.transactions : [body];
    
    const createdTransactions = [];
    
    for (const transactionBody of transactions) {
      const {
        seq,
        ledger,
        transNo,
        code,
        accountNumber,
        date,
        invoiceNumber,
        particulars,
        debit,
        credit,
        balance,
        checkAccountNumber,
        checkNumber,
        dateMatured,
        accountName,
        bankName,
        bankBranch,
        user,
        isCoincide,
        dailyClosing,
        approval,
        ftToLedger,
        ftToAccount
      } = transactionBody;

      const transactionData: any = {};
      if (seq !== undefined) transactionData.seq = parseInt(seq, 10);
      if (ledger !== undefined) transactionData.ledger = ledger;
      if (transNo !== undefined) transactionData.transNo = transNo;
      if (code !== undefined) transactionData.code = code;
      if (accountNumber !== undefined) transactionData.accountNumber = accountNumber;
      if (date !== undefined) transactionData.date = new Date(date);
      if (invoiceNumber !== undefined) transactionData.invoiceNumber = invoiceNumber;
      if (particulars !== undefined) transactionData.particulars = particulars;
      if (debit !== undefined) transactionData.debit = parseFloat(debit) || 0;
      if (credit !== undefined) transactionData.credit = parseFloat(credit) || 0;
      if (balance !== undefined) transactionData.balance = parseFloat(balance) || 0;
      if (checkAccountNumber !== undefined) transactionData.checkAccountNumber = checkAccountNumber;
      if (checkNumber !== undefined) transactionData.checkNumber = checkNumber;
      if (dateMatured !== undefined) transactionData.dateMatured = new Date(dateMatured);
      if (accountName !== undefined) transactionData.accountName = accountName;
      if (bankName !== undefined) transactionData.bankName = bankName;
      if (bankBranch !== undefined) transactionData.bankBranch = bankBranch;
      if (user !== undefined) transactionData.user = user;
      if (isCoincide !== undefined) transactionData.isCoincide = Boolean(isCoincide);
      if (dailyClosing !== undefined) transactionData.dailyClosing = parseInt(dailyClosing, 10);
      if (approval !== undefined) transactionData.approval = approval;
      if (ftToLedger !== undefined) transactionData.ftToLedger = ftToLedger;
      if (ftToAccount !== undefined) transactionData.ftToAccount = ftToAccount;

      const transaction = await createTransaction(transactionData);
      createdTransactions.push(transaction);
    }

    // Return single transaction if only one was created, otherwise return array
    return NextResponse.json(
      createdTransactions.length === 1 ? createdTransactions[0] : createdTransactions,
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    // Prepare update data with proper type conversions
    const transactionUpdateData: any = {};
    if (updateData.seq !== undefined) transactionUpdateData.seq = parseInt(updateData.seq, 10);
    if (updateData.ledger !== undefined) transactionUpdateData.ledger = updateData.ledger;
    if (updateData.transNo !== undefined) transactionUpdateData.transNo = updateData.transNo;
    if (updateData.code !== undefined) transactionUpdateData.code = updateData.code;
    if (updateData.accountNumber !== undefined) transactionUpdateData.accountNumber = updateData.accountNumber;
    if (updateData.date !== undefined) transactionUpdateData.date = new Date(updateData.date);
    if (updateData.invoiceNumber !== undefined) transactionUpdateData.invoiceNumber = updateData.invoiceNumber;
    if (updateData.particulars !== undefined) transactionUpdateData.particulars = updateData.particulars;
    if (updateData.debit !== undefined) transactionUpdateData.debit = parseFloat(updateData.debit) || 0;
    if (updateData.credit !== undefined) transactionUpdateData.credit = parseFloat(updateData.credit) || 0;
    if (updateData.balance !== undefined) transactionUpdateData.balance = parseFloat(updateData.balance) || 0;
    if (updateData.checkAccountNumber !== undefined) transactionUpdateData.checkAccountNumber = updateData.checkAccountNumber;
    if (updateData.checkNumber !== undefined) transactionUpdateData.checkNumber = updateData.checkNumber;
    if (updateData.dateMatured !== undefined) transactionUpdateData.dateMatured = new Date(updateData.dateMatured);
    if (updateData.accountName !== undefined) transactionUpdateData.accountName = updateData.accountName;
    if (updateData.bankName !== undefined) transactionUpdateData.bankName = updateData.bankName;
    if (updateData.bankBranch !== undefined) transactionUpdateData.bankBranch = updateData.bankBranch;
    if (updateData.user !== undefined) transactionUpdateData.user = updateData.user;
    if (updateData.isCoincide !== undefined) transactionUpdateData.isCoincide = Boolean(updateData.isCoincide);
    if (updateData.dailyClosing !== undefined) transactionUpdateData.dailyClosing = parseInt(updateData.dailyClosing, 10);
    if (updateData.approval !== undefined) transactionUpdateData.approval = updateData.approval;
    if (updateData.ftToLedger !== undefined) transactionUpdateData.ftToLedger = updateData.ftToLedger;
    if (updateData.ftToAccount !== undefined) transactionUpdateData.ftToAccount = updateData.ftToAccount;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: transactionUpdateData,
    });

    return NextResponse.json(transaction);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    await prisma.transaction.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting transaction:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 });
  }
}
