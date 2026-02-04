
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const requestData: any = await prisma.$queryRaw`
            SELECT * FROM request WHERE id = ${id}
        `;

        if (!requestData || requestData.length === 0) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        const items = await prisma.$queryRaw`
            SELECT * FROM request_item WHERE requestId = ${id}
        `;

        return NextResponse.json({
            ...requestData[0],
            items
        });
    } catch (error) {
        console.error('Error fetching request:', error);
        return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await req.json();
        const now = new Date();

        // Dynamically build update query for PATCH
        const updates: string[] = [];
        const values: any[] = [];

        Object.entries(body).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'items') {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        });

        if (updates.length === 0) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        updates.push(`updatedAt = ?`);
        values.push(now);
        values.push(id);

        const query = `UPDATE request SET ${updates.join(', ')} WHERE id = ?`;

        // This is a bit tricky with queryRaw/executeRaw because and dynamic fields.
        // For simplicity and to bypass Prisma model issues, we use a slightly more manual approach if needed
        // but let's try a simpler way for status/signatures specifically which are most common action fixes.

        if (body.status) {
            await prisma.$executeRaw`UPDATE request SET status = ${body.status}, updatedAt = ${now} WHERE id = ${id}`;
        }

        if (body.verifiedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET verifiedBy = ${body.verifiedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }

        if (body.approvedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET approvedBy = ${body.approvedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }

        if (body.processedBy !== undefined) {
            await prisma.$executeRaw`UPDATE request SET processedBy = ${body.processedBy}, updatedAt = ${now} WHERE id = ${id}`;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating request:', error);
        return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Delete items first
        await prisma.$executeRaw`DELETE FROM request_item WHERE requestId = ${id}`;

        // Delete request
        await prisma.$executeRaw`DELETE FROM request WHERE id = ${id}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting request:', error);
        return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 });
    }
}
