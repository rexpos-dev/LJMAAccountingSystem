
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Use raw query to bypass potentially stale Prisma Client model definitions
        const requests = await prisma.$queryRaw`SELECT * FROM request ORDER BY createdAt DESC`;
        // Normalize date fields if needed, but JSON serialization usually handles dates.
        // Prisma raw returns dates as Date objects.
        return NextResponse.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        // Try fallback to empty array if table doesn't exist yet (though it should)
        return NextResponse.json([], { status: 200 });
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Manual count
        const countResult: any = await prisma.$queryRaw`SELECT COUNT(*) as count FROM request`;
        // Handle BigInt return from count
        const count = Number(countResult[0]?.count || 0);

        const requestNumber = `REQ-${(count + 1).toString().padStart(5, '0')}`;

        const id = crypto.randomUUID();
        const now = new Date();

        // Insert Request using executeRaw to bypass Prisma Client model check
        await prisma.$executeRaw`
            INSERT INTO request (
                id, requestNumber, requesterName, position, businessUnit, chargeTo, 
                accountNo, purpose, amount, verifiedBy, approvedBy, processedBy, 
                status, createdAt, updatedAt, date
            ) VALUES (
                ${id}, ${requestNumber}, ${body.requesterName || 'Unknown'}, ${body.position}, ${body.businessUnit}, ${body.chargeTo},
                ${body.accountNo}, ${body.purpose}, ${body.amount || 0}, ${body.verifiedBy}, ${body.approvedBy}, ${body.processedBy},
                'To Verify', ${now}, ${now}, ${now}
            )
        `;

        // Insert Items
        if (body.items && body.items.length > 0) {
            for (const item of body.items) {
                const itemId = crypto.randomUUID();
                const total = (item.quantity || 0) * (item.unitPrice || 0);
                await prisma.$executeRaw`
                    INSERT INTO request_item (
                        id, requestId, description, quantity, unit, unitPrice, total, createdAt, updatedAt
                    ) VALUES (
                        ${itemId}, ${id}, ${item.description}, ${item.quantity}, ${null}, ${item.unitPrice}, ${total}, ${now}, ${now}
                    )
                `;
            }
        }

        return NextResponse.json({ id, requestNumber });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json({ error: `Failed to create request: ${String(error)}` }, { status: 500 });
    }
}
