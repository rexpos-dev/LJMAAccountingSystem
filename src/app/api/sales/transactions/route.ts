import { NextRequest, NextResponse } from 'next/server';

export interface SalesTransaction {
    id: string;
    orderNumber: number;
    receiptNo: number;
    posTransactionId: string;
    date: string;
    total: number;
    subtotal: number;
    discount: number;
    taxAmount: number;
    vatableSales: number;
    nonVatSales: number;
    amountPaid: number;
    balance: number;
    cost: number;
    profit: number;
    notes: string;
    paymentStatus: string;
    status: string;
    transactionType: string;
    paymentMethod: string;
    customer: {
        id: string;
        name: string;
        contactNumber: string;
    } | null;
    cashier: string;
    terminal: string;
    items: {
        id: string;
        productId: string;
        productName: string;
        description: string;
        quantity: string;
        price: number;
        total: number;
        cost: number;
        discount: number;
        unitOfMeasure: string;
    }[];
}

export interface SalesTransactionResponse {
    success: boolean;
    data: SalesTransaction[];
    pagination: {
        page: number;
        limit: number;
        totalRecords: number;
        totalPages: number;
    };
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const page = searchParams.get('page') || '1';
    const search = searchParams.get('search');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    // Build query parameters for external API
    const externalParams = new URLSearchParams({
        limit,
        page,
    });

    if (search) externalParams.append('search', search);
    if (fromDate) externalParams.append('fromDate', fromDate);
    if (toDate) externalParams.append('toDate', toDate);

    try {
        const response = await fetch(
            `http://192.168.1.163:3001/api/sales/transactions?${externalParams.toString()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            const text = await response.text().catch(() => '');
            console.error(
                'External sales transactions API responded with non-OK status',
                response.status,
                text
            );

            const failureResponse: SalesTransactionResponse = {
                success: false,
                data: [],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    totalRecords: 0,
                    totalPages: 0,
                },
            };

            return NextResponse.json(failureResponse);
        }

        const data: SalesTransactionResponse = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching external sales transactions:', error);

        const failureResponse: SalesTransactionResponse = {
            success: false,
            data: [],
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalRecords: 0,
                totalPages: 0,
            },
        };

        return NextResponse.json(failureResponse);
    }
}
