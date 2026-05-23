import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const fromDate = searchParams.get('fromDate');
        const toDate = searchParams.get('toDate');

        // Optional date filtering
        let dateFilter: any = {};
        if (fromDate || toDate) {
            dateFilter = { date: {} };
            if (fromDate) {
                dateFilter.date.gte = new Date(fromDate);
            }
            if (toDate) {
                dateFilter.date.lte = new Date(toDate + 'T23:59:59');
            }
        }

        const logs = await prisma.auditLog.findMany({
            where: {
                ...dateFilter
            },
            orderBy: {
                date: 'desc'
            }
        });

        return NextResponse.json(logs);
    } catch (error: any) {
        console.error("Failed to fetch audit logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch audit logs", details: error.message },
            { status: 500 }
        );
    }
}
