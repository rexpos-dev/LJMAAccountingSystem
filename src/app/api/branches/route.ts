import { NextResponse } from 'next/server';
import { getBranches, createBranch } from '@/lib/database';

export async function GET() {
    try {
        const branches = await getBranches();
        return NextResponse.json(branches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, code, type, logoUrl, address, phone, isActive, payTo, accountNumber, expenseAcct, receivables, depositAccount, othersField } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const branch = await createBranch({
            name,
            code,
            type,
            logoUrl,
            address,
            phone,
            isActive: isActive !== undefined ? isActive : true,
            payTo,
            accountNumber,
            expenseAcct,
            receivables,
            depositAccount,
            othersField,
        });

        return NextResponse.json(branch, { status: 201 });
    } catch (error: any) {
        console.error('Error creating branch:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Branch name or code already exists' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
    }
}
