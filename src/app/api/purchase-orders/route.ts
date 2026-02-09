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
                items: {
                    include: {
                        product: true
                    }
                },
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

        // Validate Product IDs (Foreign Key P2003 protection)
        const productIds = Array.from(new Set(items.map((i: any) => i.productId).filter(Boolean)));
        const validProducts = await prisma.product.findMany({
            where: { id: { in: productIds as string[] } },
            select: { id: true }
        });
        const validProductIds = new Set(validProducts.map(p => p.id));

        // Create Purchase Order
        try {
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
                        create: items.map((item: any) => {
                            const qty = parseInt(item.qty) || 0;
                            const price = parseFloat(item.unitPrice) || 0;
                            const isProductValid = item.productId && validProductIds.has(item.productId);

                            return {
                                productId: isProductValid ? item.productId : null,
                                itemDescription: item.item || 'No Name',
                                barcode: item.barcode || '',
                                buyingUom: item.uom || 'pc',
                                quantity: qty,
                                unitPrice: price,
                                tax: 0,
                                total: qty * price,
                                qtyPerCase: parseInt(item.qtyPerCase) || 1,
                                orderQty: parseInt(item.orderQty) || qty,
                                costPricePerCase: parseFloat(item.costPricePerCase) || (price * (parseInt(item.qtyPerCase) || 1)),
                                costPricePerPiece: parseFloat(item.costPricePerPiece) || price,
                            };
                        }),
                    },
                },
                include: {
                    items: true,
                },
            });

            return NextResponse.json(purchaseOrder, { status: 201 });
        } catch (dbError: any) {
            console.error('DATABASE ERROR during PO creation:', {
                code: dbError.code,
                meta: dbError.meta,
                message: dbError.message,
                payload: { supplierId, itemCount: items?.length }
            });
            return NextResponse.json({
                error: 'Database error during creation',
                code: dbError.code,
                details: dbError.message
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('Error creating purchase order:', error);
        return NextResponse.json({ error: 'Failed to create purchase order', details: error.message }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, items, ...otherData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Purchase Order ID is required' }, { status: 400 });
        }

        // If only status is provided, just update status
        if (Object.keys(otherData).length === 0 && !items && status) {
            const purchaseOrder = await prisma.purchaseOrder.update({
                where: { id },
                data: { status },
            });
            return NextResponse.json(purchaseOrder);
        }

        // Prerequisite: Delete existing items if new items are provided
        if (items) {
            await prisma.purchaseOrderItem.deleteMany({
                where: { purchaseOrderId: id }
            });
        }

        const updateData: any = {
            status,
            ...otherData,
        };

        // Clean up updateData to match schema inputs (e.g. remove 'items' array from direct update)
        // items is already extracted

        if (items) {
            // Validate Product IDs in bulk
            const productIds = Array.from(new Set(items.map((i: any) => i.productId).filter(Boolean)));
            const validProducts = await prisma.product.findMany({
                where: { id: { in: productIds as string[] } },
                select: { id: true }
            });
            const validProductIds = new Set(validProducts.map(p => p.id));

            updateData.items = {
                create: items.map((item: any) => {
                    const qty = parseInt(item.qty || item.quantity) || 0;
                    const price = parseFloat(item.unitPrice) || 0;
                    const isProductValid = item.productId && validProductIds.has(item.productId);

                    return {
                        productId: isProductValid ? item.productId : null,
                        itemDescription: item.item || item.itemDescription || 'No Name',
                        barcode: item.barcode || '',
                        buyingUom: item.uom || item.buyingUom || 'pc',
                        quantity: qty,
                        unitPrice: price,
                        tax: 0,
                        total: qty * price,
                        qtyPerCase: parseInt(item.qtyPerCase) || 1,
                        orderQty: parseInt(item.orderQty) || qty,
                        costPricePerCase: parseFloat(item.costPricePerCase) || (price * (parseInt(item.qtyPerCase) || 1)),
                        costPricePerPiece: parseFloat(item.costPricePerPiece) || price,
                    };
                })
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
        return NextResponse.json({ error: 'Failed to update purchase order', details: error.message }, { status: 500 });
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
