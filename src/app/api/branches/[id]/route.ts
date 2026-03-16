import { NextResponse } from 'next/server';
import { updateBranch, deleteBranch } from '@/lib/database';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const { name, code, type, logoUrl, address, phone, isActive, payTo, accountNumber, expenseAcct, receivables, depositAccount, othersField } = body;

        const branch = await updateBranch(id, {
            name,
            code,
            type,
            logoUrl,
            address,
            phone,
            isActive,
            payTo,
            accountNumber,
            expenseAcct,
            receivables,
            depositAccount,
            othersField,
        });

        return NextResponse.json(branch);
    } catch (error: any) {
        console.error('Error updating branch:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Branch name or code already exists' }, { status: 409 });
        }
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to update branch' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await deleteBranch(id);
        return NextResponse.json({ message: 'Branch deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting branch:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
    }
}
