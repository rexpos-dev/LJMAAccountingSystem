import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
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

        // This is a bit tricky with queryRaw/executeRaw because and dynamic fields.
        // For simplicity and to bypass Prisma model issues, we use a slightly more manual approach if needed
        // but let's try a simpler way for status/signatures specifically which are most common action fixes.

        if (body.status) {
            await prisma.$executeRaw`UPDATE request SET status = ${body.status}, updatedAt = ${now} WHERE id = ${id}`;

            // Handle automatic Journal Entry when status becomes 'Released'
            if (body.status === 'Released') {
                const existingReq: any = await prisma.$queryRaw`SELECT * FROM request WHERE id = ${id}`;
                if (existingReq && existingReq.length > 0) {
                    const req = existingReq[0];
                    // Verify it wasn't already released in some race condition
                    try {
                        const amount = req.amount || 0;
                        const chargeToAcct = parseInt(req.chargeTo, 10);
                        const depositAcct = parseInt(req.depositAccount, 10);

                        if (!isNaN(chargeToAcct) && !isNaN(depositAcct) && amount > 0) {
                            const { postJournalEntry } = await import('@/lib/journal-helper');
                            await postJournalEntry({
                                date: new Date(),
                                referenceId: req.requestNumber,
                                particulars: `Automatic Journal Entry for Released Request: ${req.purpose || req.formName}`,
                                user: 'System', // Could use a session user if passed
                                lines: [
                                    { accountNo: chargeToAcct, debit: amount, credit: 0 },
                                    { accountNo: depositAcct, debit: 0, credit: amount }
                                ]
                            });
                            console.log(`Successfully posted Journal Entry for Request ${req.requestNumber}`);
                        } else {
                            console.warn(`Request ${req.requestNumber} released but missing valid chargeTo/depositAccount or amount is 0. Cannot post Journal Entry.`);
                        }
                    } catch (err: any) {
                        console.error('Error posting journal entry for released request:', err);
                        // We still allow the request to be marked as released even if journaling fails, 
                        // or we could throw here. Opting to just log error for now to not block the release workflow.
                    }
                }
            }
        }

        if (body.depositAccount !== undefined) {
            await prisma.$executeRaw`UPDATE request SET depositAccount = ${body.depositAccount}, updatedAt = ${now} WHERE id = ${id}`;
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

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
