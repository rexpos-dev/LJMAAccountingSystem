import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// The POS API Base URL
const POS_API_URL = "http://192.168.1.163:3000/api";

export async function POST(req: Request) {
    try {
        const results = {
            customers: 0,
            products: 0,
            sales: 0,
            errors: [] as string[],
        };

        // 1. Sync Customers
        try {
            // Get all customers from POS
            const customersRes = await fetch(`${POS_API_URL}/customers`);
            if (customersRes.ok) {
                const customers = await customersRes.json();

                for (const customer of customers) {
                    // Upsert into local DB based on code/email/phone mapping
                    await prisma.customer.upsert({
                        where: { code: customer.code || customer.id },
                        update: {
                            customerName: customer.customerName || customer.firstName + " " + customer.lastName,
                            phonePrimary: customer.phonePrimary || customer.phone,
                            email: customer.email,
                        },
                        create: {
                            code: customer.code || customer.id,
                            customerName: customer.customerName || customer.firstName + " " + customer.lastName,
                            phonePrimary: customer.phonePrimary || customer.phone,
                            email: customer.email,
                        }
                    });
                    results.customers++;
                }
            } else {
                results.errors.push(`Failed to fetch POS Customers: ${customersRes.statusText}`);
            }
        } catch (e: any) {
            console.error("Customers sync error:", e);
            results.errors.push(`Customers sync error: ${e.message}`);
        }

        // 2. Sync Products & Inventory
        try {
            // Assuming /products endpoint exists on POS and returns stock info
            const productsRes = await fetch(`${POS_API_URL}/products`);
            if (productsRes.ok) {
                const products = await productsRes.json();

                for (const product of products) {
                    await prisma.product.upsert({
                        where: { code: product.code || product.id },
                        update: {
                            name: product.name,
                            unitPrice: parseFloat(product.price) || parseFloat(product.unitPrice) || 0,
                            stockQuantity: parseInt(product.stock) || parseInt(product.stockQuantity) || 0,
                        },
                        create: {
                            code: product.code || product.id,
                            name: product.name,
                            unitPrice: parseFloat(product.price) || parseFloat(product.unitPrice) || 0,
                            stockQuantity: parseInt(product.stock) || parseInt(product.stockQuantity) || 0,
                        }
                    });
                    results.products++;
                }
            } else {
                results.errors.push(`Failed to fetch POS Products: ${productsRes.statusText}`);
            }
        } catch (e: any) {
            console.error("Products sync error:", e);
            results.errors.push(`Products sync error: ${e.message}`);
        }

        // 3. Sync Sales
        try {
            // Find the last time we synced sales
            const lastSync = await prisma.posSyncLog.findUnique({
                where: { endpoint: 'sales' }
            });

            // Construct query based on last sync date
            // Note: adjust query parameter according to what the POS API expects (e.g., ?since=2024-01-01)
            let salesUrl = `${POS_API_URL}/sales`;
            if (lastSync && lastSync.status === 'SUCCESS') {
                // If the POS API supports a 'since' or 'startDate' parameter, append it here
                // salesUrl += `?startDate=${lastSync.lastSyncedAt.toISOString()}`;
            }

            const salesRes = await fetch(salesUrl);

            if (salesRes.ok) {
                const salesResponse = await salesRes.json();
                // POS returns paginated { data: [] } structure
                const salesData = salesResponse.data || [];
                let totalSalesAmount = 0;
                const unsyncedSales: any[] = [];

                for (const sale of salesData) {
                    const saleTotal = parseFloat(sale.total) || parseFloat(sale.amount) || 0;
                    totalSalesAmount += saleTotal;

                    // Extract date (fallback to now if missing)
                    const saleDate = sale.invoiceDate ? new Date(sale.invoiceDate) : (sale.date ? new Date(sale.date) : new Date());

                    // Check if the sale was already synced to ledger
                    const existingSale = await prisma.posSale.findUnique({
                        where: { receiptId: sale.id },
                        select: { syncedToLedger: true }
                    });

                    const isAlreadySynced = existingSale?.syncedToLedger || false;

                    const createdSale = await prisma.posSale.upsert({
                        where: { receiptId: sale.id },
                        update: {
                            amount: parseFloat(sale.total) || parseFloat(sale.amount) || 0,
                            subtotal: parseFloat(sale.subtotal) || 0,
                            tax: parseFloat(sale.tax) || 0,
                            discount: parseFloat(sale.discount) || 0,
                            paymentMethod: sale.paymentMethod,
                            cashier: sale.cashier
                        },
                        create: {
                            receiptId: sale.id,
                            date: saleDate,
                            amount: parseFloat(sale.total) || parseFloat(sale.amount) || 0,
                            subtotal: parseFloat(sale.subtotal) || 0,
                            tax: parseFloat(sale.tax) || 0,
                            discount: parseFloat(sale.discount) || 0,
                            paymentMethod: sale.paymentMethod,
                            cashier: sale.cashier,
                            syncedToLedger: false // Will be updated after journal posting
                        }
                    });

                    if (!isAlreadySynced) {
                        unsyncedSales.push(sale);
                        totalSalesAmount += saleTotal;
                    }

                    results.sales++;

                    // Delete existing items for the sale
                    await prisma.posSaleItem.deleteMany({
                        where: { posSaleId: createdSale.id }
                    });

                    // If the POS returns items along with the sale, we sync them here
                    if (sale.items && Array.isArray(sale.items)) {
                        for (const item of sale.items) {
                            // Lookup product id if we have a codebase match
                            let productId = null;
                            const remoteProduct = item.product || {};
                            const possibleIdentifier = remoteProduct.sku || remoteProduct.barcode || remoteProduct.code || remoteProduct.id;

                            if (possibleIdentifier) {
                                const productMatch = await prisma.product.findFirst({
                                    where: {
                                        OR: [
                                            { code: possibleIdentifier },
                                            { barcode: possibleIdentifier }
                                        ]
                                    }
                                });
                                if (productMatch) productId = productMatch.id;
                            }

                            const qty = parseFloat(item.quantity) || 1;
                            const price = parseFloat(item.price) || parseFloat(item.unitPrice) || 0;

                            await prisma.posSaleItem.create({
                                data: {
                                    posSaleId: createdSale.id,
                                    productId: productId,
                                    productName: remoteProduct.name || item.productName || item.name || "Unknown Product",
                                    quantity: qty,
                                    unitPrice: price,
                                    total: parseFloat(item.total) || (qty * price) || 0
                                }
                            });
                        }
                    }
                }

                // If we synced any new sales, handle banking and journal posting
                if (results.sales > 0 && totalSalesAmount > 0) {
                    try {
                        const { postJournalEntry } = await import('@/lib/journal-helper');

                        // Categorize unsynced sales by payment method
                        const cashSales = unsyncedSales.filter((s: any) =>
                            s.paymentMethod?.toLowerCase() === 'cash' || !s.paymentMethod
                        ).reduce((sum: number, s: any) => sum + (parseFloat(s.total) || 0), 0);

                        const onlineSales = unsyncedSales.filter((s: any) =>
                            s.paymentMethod?.toLowerCase() !== 'cash' && s.paymentMethod
                        ).reduce((sum: number, s: any) => sum + (parseFloat(s.total) || 0), 0);

                        // 1. Post Journal for Cash Sales (Immediate to Cash on Hand 1000)
                        if (cashSales > 0) {
                            await postJournalEntry({
                                date: new Date(),
                                referenceId: `SYNC-POS-CASH-${new Date().getTime()}`,
                                particulars: `POS Cash Sales Sync (${results.sales} receipts)`,
                                user: 'System',
                                lines: [
                                    { accountNo: 1000, debit: cashSales }, // Cash on Hand
                                    { accountNo: 4000, credit: cashSales }  // Sales Revenue
                                ]
                            });
                        }

                        // 2. Handle Online Sales (Create BankTransactions -> TO_AUDIT)
                        if (onlineSales > 0) {
                            // Find a default bank account for online payments
                            // This would ideally be configurable.
                            const bankAccount = await prisma.bankAccount.findFirst({
                                where: {
                                    OR: [
                                        { account_name: { contains: 'Online' } },
                                        { is_active: true }
                                    ]
                                }
                            });

                            if (bankAccount) {
                                const bt = await prisma.bankTransaction.create({
                                    data: {
                                        bankAccountId: bankAccount.id,
                                        type: 'CASH_IN',
                                        status: 'TO_AUDIT',
                                        amount: onlineSales,
                                        balanceAfter: 0,
                                        particulars: `POS Online Sales Sync (${results.sales} receipts)`,
                                        sourceType: 'POS',
                                        sourceId: `SYNC-POS-ONLINE-${new Date().getTime()}`,
                                        date: new Date()
                                    }
                                });

                                // Create Audit Log
                                await prisma.auditLog.create({
                                    data: {
                                        actionType: 'POS Bank Deposit',
                                        transactionId: bt.id,
                                        amount: onlineSales,
                                        details: `POS Online Sales batch requires audit before GL posting.`,
                                        status: 'To Audit'
                                    }
                                });
                            } else {
                                // If no bank account found, fallback to suspense or error
                                console.warn("No bank account found for POS Online Sales sync. Posting to suspense.");
                                await postJournalEntry({
                                    date: new Date(),
                                    referenceId: `SYNC-POS-ONLINE-SUSPENSE-${new Date().getTime()}`,
                                    particulars: `POS Online Sales Sync (No Bank Account)`,
                                    user: 'System',
                                    lines: [
                                        { accountNo: 9999, debit: onlineSales }, // Suspense
                                        { accountNo: 4000, credit: onlineSales }  // Sales Revenue
                                    ]
                                });
                            }
                        }

                        // 3. Mark all processed sales as syncedToLedger
                        if (unsyncedSales.length > 0) {
                            await prisma.posSale.updateMany({
                                where: {
                                    receiptId: { in: unsyncedSales.map(s => s.id) }
                                },
                                data: { syncedToLedger: true }
                            });
                        }

                    } catch (journalErr) {
                        console.error("Failed to process banking/journal for POS Sync batch", journalErr);
                        results.errors.push("Banking/Journal processing failed for synced sales.");
                    }
                }

                // Log the successful sync
                await prisma.posSyncLog.upsert({
                    where: { endpoint: 'sales' },
                    update: { lastSyncedAt: new Date(), status: 'SUCCESS', recordsAdded: results.sales },
                    create: { endpoint: 'sales', lastSyncedAt: new Date(), status: 'SUCCESS', recordsAdded: results.sales }
                });

            } else {
                results.errors.push(`Failed to fetch POS Sales: ${salesRes.statusText}`);
            }

        } catch (e: any) {
            console.error("Sales sync error:", e);
            results.errors.push(`Sales sync error: ${e.message}`);

            await prisma.posSyncLog.upsert({
                where: { endpoint: 'sales' },
                update: { lastSyncedAt: new Date(), status: 'FAILED', errorMessage: e.message },
                create: { endpoint: 'sales', lastSyncedAt: new Date(), status: 'FAILED', errorMessage: e.message }
            });
        }

        return NextResponse.json({
            success: true,
            message: "Sync completed",
            results
        });
    } catch (error: any) {
        console.error("Error syncing POS data:", error);
        return NextResponse.json(
            { success: false, error: "Failed to sync POS data", details: error.message },
            { status: 500 }
        );
    }
}
