
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    try {
        console.log("Checking DB connection...");
        if (!prisma) {
            return NextResponse.json({ error: 'Prisma client is null' }, { status: 500 });
        }

        // Test Invoice model availability
        if (!prisma.invoice) {
            return NextResponse.json({ error: 'Prisma Invoice model is undefined. Client not generated?' }, { status: 500 });
        }

        const count = await prisma.invoice.count();
        return NextResponse.json({ status: 'OK', count });
    } catch (e: any) {
        console.error("Debug DB Error:", e);
        return NextResponse.json({ error: e.message, stack: e.stack }, { status: 500 });
    }
}
