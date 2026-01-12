import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const salesUsers = await prisma.salesUser.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(salesUsers);
    } catch (error: any) {
        console.error('Error fetching sales users:', error);
        return NextResponse.json({ error: 'Failed to fetch sales users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sp_id, username, complete_name } = body;

        if (!sp_id || !complete_name) {
            return NextResponse.json({ error: 'SP ID and Complete Name are required' }, { status: 400 });
        }

        const salesUser = await prisma.salesUser.create({
            data: {
                uniqueId: sp_id,
                name: complete_name,
                username: username || null,
                isActive: true,
            },
        });

        return NextResponse.json(salesUser);
    } catch (error: any) {
        console.error('Error creating sales user:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'SP ID already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to create sales user' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, username, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const salesUser = await prisma.salesUser.update({
            where: { id },
            data: {
                name,
                username: username || undefined,
                isActive: isActive !== undefined ? isActive : undefined,
            },
        });

        return NextResponse.json(salesUser);
    } catch (error: any) {
        console.error('Error updating sales user:', error);
        return NextResponse.json({ error: 'Failed to update sales user' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await prisma.salesUser.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Sales user deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting sales user:', error);
        return NextResponse.json({ error: 'Failed to delete sales user' }, { status: 500 });
    }
}
