
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

        const invoice = await prisma.invoice.create({
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
