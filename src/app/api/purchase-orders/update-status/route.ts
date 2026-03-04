import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { ids, status } = await request.json();

        if (!Array.isArray(ids) || !status) {
            return NextResponse.json(
                { error: 'Invalid data format. Expected an array of ids and a status string.' },
                { status: 400 }
            );
        }

        const result = await prisma.purchaseOrder.updateMany({
            where: {
                id: { in: ids }
            },
            data: {
                status: status
            }
        });

        return NextResponse.json(
            { message: 'Purchase order statuses updated successfully', count: result.count },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating purchase order statuses:', error);
        return NextResponse.json(
            { error: 'Failed to update purchase order statuses' },
            { status: 500 }
        );
    }
}
