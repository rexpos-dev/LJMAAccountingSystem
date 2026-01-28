import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
    parseCSV,
    validatePurchaseOrderCSV,
    mapCSVRowToPurchaseOrderItem,
    groupRowsBySupplier,
    PurchaseOrderCSVRow
} from '@/lib/bulk-upload-utils';

export async function POST(request: NextRequest) {
    console.log('[Bulk Upload] Starting bulk upload process...');
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        console.log('[Bulk Upload] File received:', file?.name, file?.size, 'bytes');

        if (!file) {
            console.error('[Bulk Upload] No file provided');
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Parse CSV
        console.log('[Bulk Upload] Parsing CSV...');
        const csvData = await parseCSV(file);
        console.log('[Bulk Upload] Parsed', csvData.length, 'rows');

        // Validate CSV
        console.log('[Bulk Upload] Validating CSV...');
        const validation = validatePurchaseOrderCSV(csvData);
        if (!validation.isValid) {
            console.error('[Bulk Upload] Validation failed:', validation.errors);
            return NextResponse.json(
                {
                    error: 'CSV validation failed',
                    validationErrors: validation.errors
                },
                { status: 400 }
            );
        }
        console.log('[Bulk Upload] Validation passed');

        // Group rows by supplier
        const groupedData = groupRowsBySupplier(validation.data as PurchaseOrderCSVRow[]);
        console.log('[Bulk Upload] Grouped into', groupedData.size, 'suppliers');

        const createdOrders = [];
        const errors = [];

        // Process each supplier group
        for (const [supplierName, rows] of groupedData.entries()) {
            console.log(`[Bulk Upload] Processing supplier: ${supplierName} (${rows.length} items)`);
            try {
                // Find or create supplier
                let supplier = await prisma.supplier.findFirst({
                    where: { name: supplierName }
                });

                if (!supplier) {
                    console.log(`[Bulk Upload] Creating new supplier: ${supplierName}`);
                    // Create new supplier with just the name
                    supplier = await prisma.supplier.create({
                        data: {
                            name: supplierName,
                            isActive: true
                        }
                    });
                }

                // Map rows to purchase order items
                const items = await Promise.all(
                    rows.map(async (row) => {
                        const itemData = mapCSVRowToPurchaseOrderItem(row);

                        // Try to find product by SKU or Barcode
                        let productId = null;
                        if (row.SKU || row.Barcode) {
                            const product = await prisma.product.findFirst({
                                where: {
                                    OR: [
                                        row.SKU ? { code: row.SKU } : {},
                                        row.Barcode ? { barcode: row.Barcode } : {}
                                    ]
                                }
                            });

                            if (product) {
                                productId = product.id;
                            } else {
                                // Create purchase order item without linking to product
                                // User can manually link later if needed
                                console.log(`[Bulk Upload] Product not found for SKU: ${row.SKU}, Barcode: ${row.Barcode}`);
                            }
                        }

                        return {
                            ...itemData,
                            productId
                        };
                    })
                );

                // Calculate totals
                const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
                const taxTotal = items.reduce((sum, item) => sum + (item.tax || 0), 0);
                const total = subtotal + taxTotal;

                console.log(`[Bulk Upload] Creating purchase order for ${supplierName}: subtotal=${subtotal}, total=${total}`);

                // Create purchase order with items
                const purchaseOrder = await prisma.purchaseOrder.create({
                    data: {
                        supplierId: supplier.id,
                        date: new Date(),
                        subtotal,
                        taxTotal,
                        total,
                        status: 'Open',
                        items: {
                            create: items
                        }
                    },
                    include: {
                        supplier: true,
                        items: true
                    }
                });

                console.log(`[Bulk Upload] Created purchase order: ${purchaseOrder.id}`);

                createdOrders.push({
                    id: purchaseOrder.id,
                    supplier: supplierName,
                    itemCount: items.length,
                    total: purchaseOrder.total
                });
            } catch (error) {
                console.error(`[Bulk Upload] Error creating purchase order for supplier ${supplierName}:`, error);
                errors.push({
                    supplier: supplierName,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        console.log(`[Bulk Upload] Completed: ${createdOrders.length} orders created, ${errors.length} errors`);

        return NextResponse.json({
            success: true,
            message: `Successfully created ${createdOrders.length} purchase order(s)`,
            createdOrders,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        console.error('[Bulk Upload] Fatal error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process bulk upload',
                details: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
