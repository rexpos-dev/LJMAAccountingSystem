import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assumes this is where your prisma client is exported

export async function GET() {
    try {
        const accountTypes = await prisma.accountType.findMany({
            orderBy: { name: 'asc' },
        });
        return NextResponse.json(accountTypes);
    } catch (error) {
        console.error('Error fetching account types:', error);
        return NextResponse.json(
            { error: 'Failed to fetch account types' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, baseType } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const newAccountType = await prisma.accountType.create({
            data: {
                name,
                baseType: baseType || 'Asset',
            },
        });

        return NextResponse.json(newAccountType, { status: 201 });
    } catch (error: any) {
        console.error('Error creating account type:', error);
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Account type with this name already exists' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Failed to create account type' },
            { status: 500 }
        );
    }
}
