import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');
        const status = searchParams.get('status');
        const supplierId = searchParams.get('supplierId');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        if (supplierId && supplierId !== 'all') {
            where.supplierId = supplierId;
        }

        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        }

        const purchaseOrders = await prisma.purchaseOrder.findMany({
            where,
            include: {
                supplier: true,
                items: true,
            },
            orderBy: { date: 'desc' },
            take: limit,
            skip: offset,
        });

        return NextResponse.json(purchaseOrders);
    } catch (error: any) {
        console.error('Error fetching purchase orders:', error);
        return NextResponse.json({ error: 'Failed to fetch purchase orders' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            supplierId, date, vendorAddress, shippingAddress,
            taxType, comments, privateComments, items,
            subtotal, taxTotal, total, status
        } = body;

        // Validation
        if (!supplierId) {
            return NextResponse.json({ error: 'Supplier is required' }, { status: 400 });
        }
        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'At least one item is required' }, { status: 400 });
        }

        // Create Purchase Order with items
        const purchaseOrder = await prisma.purchaseOrder.create({
            data: {
                supplierId,
                date: new Date(date),
                vendorAddress,
                shippingAddress,
                taxType,
                comments,
                privateComments,
                subtotal,
                taxTotal,
                total,
                status: status || 'Open',
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        itemDescription: item.description, // Mapped from UI "description" to DB "itemDescription"
                        quantity: item.qty, // Mapped from UI "qty" to DB "quantity"
                        unitPrice: item.unitPrice,
                        tax: item.tax === 'None' ? 0 : 0, // Simplified tax logic for now
                        total: item.qty * item.unitPrice,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(purchaseOrder, { status: 201 });
    } catch (error: any) {
        console.error('Error creating purchase order:', error);
        return NextResponse.json({ error: 'Failed to create purchase order' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, ...otherData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Purchase Order ID is required' }, { status: 400 });
        }

        // If only status is provided, just update status
        if (Object.keys(otherData).length === 0 && status) {
            const purchaseOrder = await prisma.purchaseOrder.update({
                where: { id },
                data: { status },
            });
            return NextResponse.json(purchaseOrder);
        }

        // Full update logic (re-creating items is simplest strategy for PO edits usually)
        // For now, let's implement basic status update and field updates,
        // handling items update is complex and might need a separate transaction logic
        // or deleting all items and re-creating them.

        // Prerequisite: Delete existing items if items are provided
        if (otherData.items) {
            await prisma.purchaseOrderItem.deleteMany({
                where: { purchaseOrderId: id }
            });
        }

        const updateData: any = {
            status,
            ...otherData,
        };

        // Clean up updateData to match schema inputs (e.g. remove 'items' array from direct update)
        delete updateData.items;
        delete updateData.supplier; // Don't try to update relation object

        if (otherData.items) {
            updateData.items = {
                create: otherData.items.map((item: any) => ({
                    productId: item.productId,
                    itemDescription: item.description || item.itemDescription,
                    quantity: item.qty || item.quantity,
                    unitPrice: item.unitPrice,
                    tax: item.tax === 'None' ? 0 : (item.tax || 0),
                    total: (item.qty || item.quantity) * item.unitPrice,
                }))
            };
        }

        // Fix Date object
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }

        const purchaseOrder = await prisma.purchaseOrder.update({
            where: { id },
            data: updateData,
            include: { items: true }
        });

        return NextResponse.json(purchaseOrder);
    } catch (error: any) {
        console.error('Error updating purchase order:', error);
        return NextResponse.json({ error: 'Failed to update purchase order' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Purchase Order ID is required' }, { status: 400 });
        }

        await prisma.purchaseOrder.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Purchase order deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting purchase order:', error);
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete purchase order' }, { status: 500 });
    }
}
