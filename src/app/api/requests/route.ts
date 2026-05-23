import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch latest user data from DB to avoid stale session permissions
        const user = await prisma.userPermission.findUnique({
            where: { username: (session as any).username }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isVerifier = user.formPermissions === 'Verifier';
        const isSuperAdmin = user.accountType === 'Super Admin';
        const isAdmin = ['Administrator', 'Admin'].includes(user.accountType);
        const isTreasurer = user.accountType === 'Treasurer';

        if (isSuperAdmin && !isVerifier) {
            // Only Super Admins who are NOT specifically verifiers see everything
            const requests = await prisma.$queryRaw`SELECT * FROM request ORDER BY createdAt DESC`;
            return NextResponse.json(requests);
        }

        if ((isAdmin || isTreasurer) && !isVerifier) {
            // Other Admins and Treasurers who are NOT verifiers currently also see everything 
            // but the user wants them to be restricted if they are verifiers.
            // Let's keep this as seeing everything UNLESS they are a verifier.
            const requests = await prisma.$queryRaw`SELECT * FROM request ORDER BY createdAt DESC`;
            return NextResponse.json(requests);
        }

        // For Verifiers (regardless of Admin/Administrator account type) 
        // and non-admin users, filter by assigned forms in their permissions array.
        let userPermissions: string[] = [];
        try {
            userPermissions = typeof user.permissions === 'string'
                ? JSON.parse(user.permissions)
                : (user.permissions as any as string[]);
        } catch (e) {
            userPermissions = [];
        }

        if (!userPermissions || userPermissions.length === 0) {
            return NextResponse.json([]);
        }

        // Use Prisma raw query to handle filtering since Prisma Client might be out of sync
        // Prisma expands arrays in template literals for IN clauses
        const requests = await prisma.$queryRaw`
            SELECT * FROM request 
            WHERE formName IN (${userPermissions}) 
            ORDER BY createdAt DESC
        `;

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

        // Find highest existing requestNumber
        const latestRequest = await prisma.request.findFirst({
            orderBy: { requestNumber: 'desc' },
            select: { requestNumber: true }
        });

        let nextNum = 1;
        if (latestRequest?.requestNumber) {
            const match = latestRequest.requestNumber.match(/\d+$/);
            if (match) {
                nextNum = parseInt(match[0], 10) + 1;
            }
        }

        const requestNumber = `REQ-${nextNum.toString().padStart(5, '0')}`;

        const id = crypto.randomUUID();
        const now = new Date();

        await prisma.$executeRaw`
            INSERT INTO request (
                id, requestNumber, requesterName, position, businessUnit, chargeTo, 
                accountNo, depositAccount, purpose, amount, verifiedBy, approvedBy, processedBy, 
                formName, status, createdAt, updatedAt, date
            ) VALUES (
                ${id}, ${requestNumber}, ${body.requesterName ?? 'Unknown'}, ${body.position ?? null}, ${body.businessUnit ?? null}, ${body.chargeTo ?? null},
                ${body.accountNo ?? body.employeeId ?? null}, ${body.depositAccount ?? null}, ${body.purpose ?? null}, ${body.amount ?? 0}, ${body.verifiedBy ?? null}, ${body.approvedBy ?? null}, ${body.processedBy ?? null},
                ${body.formName ?? null}, 'To Verify', ${now}, ${now}, ${now}
            )
        `;

        // Insert Items
        if (body.items && body.items.length > 0) {
            for (const item of body.items) {
                const itemId = crypto.randomUUID();
                const qty = item.quantity ?? 0;
                const price = item.unitPrice ?? 0;
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

        // Create Notifications for Verifiers
        const formName = body.formName || 'General Request';
        let notifiedVerifiers: any[] = [];

        // Find all active users and their full names
        const allUsers: any[] = await prisma.$queryRaw`
            SELECT id, firstName, lastName, permissions, accountType, formPermissions 
            FROM user_permission 
            WHERE isActive = true
        `;

        if (body.verifiedBy) {
            // If a specific verifier was assigned in the frontend
            const matchedUser = allUsers.find(u => `${u.firstName} ${u.lastName}` === body.verifiedBy);
            if (matchedUser) {
                notifiedVerifiers.push(matchedUser);
            }
        } else {
            // Fallback: Notify all eligible verifiers for this form
            notifiedVerifiers = allUsers.filter(u => {
                const isAdmin = ['Admin', 'Administrator', 'Super Admin'].includes(u.accountType);
                if (isAdmin) return true; // Admins can verify anything
                try {
                    const perms = JSON.parse(u.permissions || '[]');
                    return u.formPermissions === 'Verifier' && perms.includes(formName);
                } catch { return false; }
            });
        }

        for (const verifier of notifiedVerifiers) {
            const notifId = crypto.randomUUID();
            await prisma.$executeRaw`
                INSERT INTO notification (id, type, title, message, entityId, userId, isRead, createdAt)
                VALUES (${notifId}, 'REQUEST_VERIFICATION', 'New Request to Verify', ${`A new ${formName} (${requestNumber}) requires your verification.`}, ${id}, ${verifier.id}, false, ${now})
            `;
        }

        return NextResponse.json({ id, requestNumber });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json({ error: `Failed to create request: ${String(error)}` }, { status: 500 });
    }
}
