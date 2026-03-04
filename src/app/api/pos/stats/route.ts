import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // First try to fetch directly from the POS API
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const response = await fetch('http://192.168.1.163:3000/api/reports/stats', {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                // Return the live data immediately
                return NextResponse.json(data);
            }
            console.warn(`POS API returned ${response.status} ${response.statusText}, falling back to local data`);
        } catch (fetchError: any) {
            console.warn(`Failed to connect to POS API: ${fetchError.message}, falling back to local data`);
        }

        // If the fetch fails, fallback to local synchronized database
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Total Revenue All Time
        const allTimeStats = await prisma.posSale.aggregate({
            _sum: { amount: true }
        });
        const totalRevenueAllTime = allTimeStats._sum.amount || 0;

        // 2. Revenue & Sales Count This Month
        const monthStats = await prisma.posSale.aggregate({
            where: { date: { gte: startOfMonth } },
            _sum: { amount: true },
            _count: { id: true }
        });
        const totalRevenueMonth = monthStats._sum.amount || 0;
        const totalSalesMonth = monthStats._count.id;

        // 3. Products Sold This Month
        const productsSoldStats = await prisma.posSaleItem.aggregate({
            where: {
                posSale: {
                    date: { gte: startOfMonth }
                }
            },
            _sum: { quantity: true }
        });
        const productsSoldMonth = productsSoldStats._sum.quantity || 0;

        // 4. Low Stock Items (based on Prisma Products table)
        const lowStockItems = await prisma.product.count({
            where: { stockQuantity: { lte: 10 } } // Assuming 10 is low stock threshold
        });

        // 5. Total Items in Catalog
        const totalItems = await prisma.product.count();

        const summary = {
            totalRevenueAllTime,
            totalRevenueMonth,
            totalSalesMonth,
            productsSoldMonth,
            lowStockItems,
            totalItems
        };

        return NextResponse.json({ summary });
    } catch (error: any) {
        console.error('Database error fetching local POS stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch local stats', details: error.message },
            { status: 500 }
        );
    }
}
