import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const body = {
            requesterName: 'Test Requestor',
            position: 'Developer',
            purpose: 'Testing',
            depositAccount: null,
            items: [
                {
                    description: 'Test Item',
                    quantity: 1,
                    price: 15.0,
                    total: 15.0
                }
            ],
            total: 15.0,
            verifiedBy: 'Test Verifier',
            approvedBy: 'Test Approver',
            processedBy: 'Test Processor'
        };

        const countResult: any = await prisma.$queryRaw`SELECT COUNT(*) as count FROM request`;
        const count = Number(countResult[0]?.count || 0);

        const requestNumber = `REQ-${(count + 1).toString().padStart(5, '0')}`;

        const id = crypto.randomUUID();
        const now = new Date();

        await prisma.$executeRaw`
            INSERT INTO request (
                id, requestNumber, requesterName, position, businessUnit, chargeTo, 
                accountNo, depositAccount, purpose, amount, verifiedBy, approvedBy, processedBy, 
                formName, status, createdAt, updatedAt, date
            ) VALUES (
                ${id}, ${requestNumber}, ${body.requesterName ?? 'Unknown'}, ${null}, ${null}, ${null},
                ${null}, ${body.depositAccount ?? null}, ${body.purpose ?? null}, ${body.total ?? 0}, ${body.verifiedBy ?? null}, ${body.approvedBy ?? null}, ${body.processedBy ?? null},
                ${'Store Use Request Form'}, 'To Verify', ${now}, ${now}, ${now}
            )
        `;

        if (body.items && body.items.length > 0) {
            for (const item of body.items) {
                const itemId = crypto.randomUUID();
                const qty = item.quantity ?? 0;
                const price = item.price ?? 0;
                const total = qty * price;
                await prisma.$executeRaw`
                    INSERT INTO request_item (
                        id, requestId, description, quantity, unit, unitPrice, total, createdAt, updatedAt
                    ) VALUES (
                        ${itemId}, ${id}, ${item.description ?? ''}, ${qty}, ${null}, ${price}, ${total}, ${now}, ${now}
                    )
                `;
            }
        }

        const formName = 'Store Use Request Form';
        const allVerifiers: any[] = await prisma.$queryRaw`
            SELECT id, permissions FROM user_permission 
            WHERE isActive = true AND formPermissions = 'Verifier'
        `;

        const notifiedVerifiers = allVerifiers.filter(v => {
            try {
                const perms = JSON.parse(v.permissions || '[]');
                return perms.includes(formName);
            } catch { return false; }
        });

        for (const verifier of notifiedVerifiers) {
            const notifId = crypto.randomUUID();
            await prisma.$executeRaw`
                INSERT INTO notification (id, type, title, message, entityId, userId, isRead, createdAt)
                VALUES (${notifId}, 'REQUEST_VERIFICATION', 'New Request to Verify', ${`A new ${formName} (${requestNumber}) requires your verification.`}, ${id}, ${verifier.id}, false, ${now})
            `;
        }

        console.log("Success!")
    } catch (e) {
        console.error("Error Details:", e);
    } finally {
        await prisma.$disconnect()
    }
}

main();
