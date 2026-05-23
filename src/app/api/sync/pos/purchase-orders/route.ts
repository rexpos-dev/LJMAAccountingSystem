import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const POS_API_URL = "http://192.168.1.163:3000/api";

export async function POST() {
    console.log("Starting POS Purchase Order Sync...");
    try {
        const results = {
            synced: 0,
            skipped: 0,
            errors: [] as string[],
        };

        const fetchUrl = `${POS_API_URL}/purchase-orders`;
        console.log(`Fetching from: ${fetchUrl}`);

        const res = await fetch(fetchUrl);
        if (!res.ok) {
            console.error(`Fetch failed with status: ${res.status} ${res.statusText}`);
            throw new Error(`Failed to fetch POS Purchase Orders: ${res.statusText}`);
        }

        const posResponse = await res.json();
        const posOrders = posResponse.data || [];
        console.log(`Fetched ${posOrders?.length || 0} orders from POS`);

        if (!Array.isArray(posOrders)) {
            console.error("POS response data is not an array:", posResponse);
            throw new Error("Invalid response format from POS: data property missing or not an array");
        }

        for (const posOrder of posOrders) {
            try {
                console.log(`Processing Order: ${posOrder.id || posOrder.orderNumber}`);
                // Find or create supplier
                let supplier = await prisma.supplier.findFirst({
                    where: {
                        OR: [
                            { name: posOrder.supplier?.name },
                            { name: posOrder.supplierName }
                        ].filter(cond => cond.name)
                    }
                });

                if (!supplier && (posOrder.supplier?.name || posOrder.supplierName)) {
                    const supplierName = posOrder.supplier?.name || posOrder.supplierName;
                    console.log(`Supplier not found. Creating: ${supplierName}`);
                    supplier = await prisma.supplier.create({
                        data: {
                            name: supplierName,
                            contactPerson: posOrder.supplier?.contactPerson,
                            email: posOrder.supplier?.email,
                            phone: posOrder.supplier?.phone,
                        }
                    });
                }

                if (!supplier) {
                    console.warn(`No supplier info for Order ${posOrder.id}. Skipping.`);
                    results.errors.push(`Supplier not found for Order ${posOrder.orderNumber || posOrder.id}`);
                    results.skipped++;
                    continue;
                }

                // Parse date
                const orderDate = posOrder.date ? new Date(posOrder.date) : new Date();

                // Upsert Purchase Order
                const localOrder = await prisma.purchaseOrder.upsert({
                    where: { id: posOrder.id },
                    update: {
                        supplierId: supplier.id,
                        date: orderDate,
                        total: parseFloat(posOrder.total) || 0,
                        status: posOrder.status || "Open",
                        comments: posOrder.comments,
                    },
                    create: {
                        id: posOrder.id,
                        supplierId: supplier.id,
                        date: orderDate,
                        total: parseFloat(posOrder.total) || 0,
                        status: posOrder.status || "Open",
                        comments: posOrder.comments,
                    }
                });

                // Sync items
                if (posOrder.items && Array.isArray(posOrder.items)) {
                    console.log(`Syncing ${posOrder.items.length} items for Order ${localOrder.id}`);
                    // Delete existing items for this order to refresh
                    await prisma.purchaseOrderItem.deleteMany({
                        where: { purchaseOrderId: localOrder.id }
                    });

                    for (const item of posOrder.items) {
                        // Try to find local product match
                        let productId = null;
                        const productMatch = await prisma.product.findFirst({
                            where: {
                                OR: [
                                    { code: item.productCode || item.code },
                                    { barcode: item.barcode }
                                ].filter(cond => cond.code || cond.barcode)
                            }
                        });
                        if (productMatch) productId = productMatch.id;

                        await prisma.purchaseOrderItem.create({
                            data: {
                                purchaseOrderId: localOrder.id,
                                productId: productId,
                                itemDescription: item.productName || item.description || "Unknown Item",
                                quantity: parseInt(item.quantity) || 0,
                                unitPrice: parseFloat(item.unitPrice) || 0,
                                total: parseFloat(item.total) || 0,
                                barcode: item.barcode,
                                sku: item.sku || item.productCode || item.code,
                            }
                        });
                    }
                }

                results.synced++;
            } catch (err: any) {
                console.error(`Error syncing order ${posOrder.id}:`, err);
                results.errors.push(`Order ${posOrder.id}: ${err.message}`);
            }
        }

        console.log(`Sync completed. Synced: ${results.synced}, Skipped: ${results.skipped}, Errors: ${results.errors.length}`);
        return NextResponse.json({
            success: true,
            message: `Successfully synced ${results.synced} purchase orders.`,
            results
        });

    } catch (error: any) {
        console.error("POS Purchase Order Sync Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to sync POS purchase orders", details: error.message },
            { status: 500 }
        );
    }
}
