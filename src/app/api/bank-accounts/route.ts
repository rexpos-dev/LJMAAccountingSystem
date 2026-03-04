import { NextResponse } from 'next/server';
import {
    getAllBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount
} from '@/lib/database';

export async function GET() {
    try {
        const bankAccounts = await getAllBankAccounts();
        return NextResponse.json(bankAccounts);
    } catch (error: any) {
        console.error('Error fetching bank accounts:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch bank accounts' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            bank_code,
            bank_name,
            account_name,
            account_number,
            account_type,
            currency,
            gl_account_id,
            opening_balance,
            opening_date,
            is_active,
            audit_status,
            user
        } = body;

        if (!bank_code || !bank_name || !account_name || !account_number || !gl_account_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const bankAccount = await createBankAccount({
            bank_code,
            bank_name,
            account_name,
            account_number,
            account_type,
            currency: currency || 'PHP',
            gl_account_id,
            opening_balance: parseFloat(opening_balance) || 0,
            opening_date: opening_date ? new Date(opening_date) : null,
            is_active: is_active !== undefined ? is_active : true,
            audit_status: audit_status || 'TO_AUDIT',
            user
        });

        // Force a Vercel/Turbopack recompile to clear the caching
        return NextResponse.json(bankAccount);
    } catch (error: any) {
        console.error('Error creating bank account:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to create bank account' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, gl_account, created_at, updated_at, bank_transactions, reconciliations, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { error: 'Bank Account ID is required' },
                { status: 400 }
            );
        }

        // Convert types if necessary
        if (updateData.opening_balance !== undefined) {
            updateData.opening_balance = parseFloat(updateData.opening_balance) || 0;
        }
        if (updateData.opening_date) {
            updateData.opening_date = new Date(updateData.opening_date);
        }

        const bankAccount = await updateBankAccount(id, updateData);
        return NextResponse.json(bankAccount);
    } catch (error: any) {
        console.error('Error updating bank account:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to update bank account' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Bank Account ID is required' },
                { status: 400 }
            );
        }

        await deleteBankAccount(id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting bank account:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to delete bank account' },
            { status: 500 }
        );
    }
}
