import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const purchaseOrder = await prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                supplier: true,
                items: true
            }
        });

        if (!purchaseOrder) {
            return NextResponse.json(
                { error: 'Purchase order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(purchaseOrder);
    } catch (error) {
        console.error('Error fetching purchase order:', error);
        return NextResponse.json(
            { error: 'Failed to fetch purchase order' },
            { status: 500 }
        );
    }
}
