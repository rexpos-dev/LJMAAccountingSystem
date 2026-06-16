
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postJournalEntry } from '@/lib/journal-helper';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            customerId,
            customerPONumber,
            date,
            dueDate,
            terms,
            salesperson,
            depositAccount,
            billingAddress,
            shippingAddress,
            invoiceNumber,
            items,
            subtotal,
            total,
        } = body;

        // Basic validation
        if (!customerId || !items || items.length === 0) {
            return NextResponse.json(
                { message: 'Missing required fields: customer or items' },
                { status: 400 }
            );
        }

        // Validate customer exists — prevents FK constraint error
        const customer = await prisma.customer.findUnique({
            where: { id: String(customerId) },
        });
        if (!customer) {
            return NextResponse.json(
                { message: `Customer not found (id: ${customerId}). Please select a valid customer.` },
                { status: 404 }
            );
        }

        // Credit limit enforcement (only when creditLimit is set and > 0)
        if ((customer.creditLimit ?? 0) > 0) {
            const outstanding: any[] = await prisma.$queryRaw`
                SELECT
                    COALESCE(SUM(i.total), 0) -
                    COALESCE(
                        (SELECT SUM(cp.amount) FROM customer_payment cp
                         JOIN invoice i2 ON i2.id = cp.invoiceId
                         WHERE i2.customerId = ${customer.id} AND cp.status != 'Voided'),
                    0) AS balance
                FROM invoice i
                WHERE i.customerId = ${customer.id}
                AND i.status NOT IN ('Paid','Void','Cancelled')
            `;
            const currentBalance = Number(outstanding[0]?.balance ?? 0);
            const invoiceTotal = parseFloat(String(total ?? 0));
            if (currentBalance + invoiceTotal > (customer.creditLimit ?? 0)) {
                return NextResponse.json({
                    message: `Credit limit exceeded. Outstanding balance: ₱${currentBalance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}, Credit limit: ₱${(customer.creditLimit ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
                    code: 'CREDIT_LIMIT_EXCEEDED',
                    currentBalance,
                    creditLimit: customer.creditLimit,
                }, { status: 422 });
            }
        }

        // Create Invoice and Items in a transaction
        // First, verify which product IDs actually exist in our local database
        const itemIds = items.map((item: any) => item.id).filter((id: string) => id);
        const existingProducts = await prisma.product.findMany({
            where: {
                id: {
                    in: itemIds
                }
            },
            select: {
                id: true
            }
        });
        const existingProductIds = new Set(existingProducts.map(p => p.id));

        const invoice = await prisma.$transaction(async (tx) => {
            const inv = await tx.invoice.create({
                data: {
                    invoiceNumber,
                    customerId,
                    customerPONumber,
                    date: new Date(date),
                    dueDate: dueDate ? new Date(dueDate) : null,
                    terms,
                    salesperson,
                    depositAccount,
                    billingAddress,
                    shippingAddress,
                    subtotal: parseFloat(subtotal),
                    total: parseFloat(total),
                    status: 'Open',
                    items: {
                        create: items.map((item: any) => ({
                            // Only link productId if it exists in our local DB
                            productId: existingProductIds.has(item.id) ? item.id : undefined,
                            description: item.name || item.description,
                            quantity: parseFloat(item.qty) || 0,
                            unitPrice: parseFloat(item.unitPrice) || 0,
                            total: (parseFloat(item.qty) || 0) * (parseFloat(item.unitPrice) || 0),
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // Post Journal Entry for Invoice Creation
            // Debit: Accounts Receivable (1210) for Total
            // Credit: Sales Revenue (4000) for Subtotal
            // (Assuming no tax handling right now based on existing implementation)
            const amtTotal = parseFloat(total) || 0;

            await postJournalEntry({
                date: inv.date,
                referenceId: inv.invoiceNumber,
                particulars: `Sales Invoice - ${inv.invoiceNumber}`,
                user: salesperson || 'System',
                lines: [
                    { accountNo: 1210, debit: amtTotal }, // AR
                    { accountNo: 4000, credit: amtTotal } // Revenue
                ]
            }, tx);

            return inv;
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error: any) {
        console.error('Error creating invoice:', error);

        // Handle unique constraint violation for invoice number
        if (error.code === 'P2002' && error.meta?.target?.includes('invoiceNumber')) {
            return NextResponse.json(
                { message: 'Invoice number already exists' },
                { status: 409 }
            );
        }


        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message, details: error },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const customerId = searchParams.get('customerId');
        // const startDate = searchParams.get('startDate');
        // const endDate = searchParams.get('endDate');

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (customerId && customerId !== 'all') {
            where.customerId = customerId;
        }

        const invoices = await prisma.invoice.findMany({
            where,
            include: {
                customer: {
                    select: {
                        customerName: true
                    }
                },
                items: true
            },
            orderBy: {
                date: 'desc'
            }
        });

        // Map to a consistent format
        const formattedInvoices = invoices.map(inv => ({
            ...inv,
            customerName: inv.customer?.customerName || 'Unknown',
            salespersonName: inv.salesperson || '',
        }));

        return NextResponse.json(formattedInvoices);
    } catch (error: any) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { message: 'Failed to fetch invoices', error: error.message },
            { status: 500 }
        );
    }
}
