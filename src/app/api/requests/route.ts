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

        if (isSuperAdmin && !isVerifier) {
            // Only Super Admins who are NOT specifically verifiers see everything
            const requests = await prisma.$queryRaw`SELECT * FROM request ORDER BY createdAt DESC`;
            return NextResponse.json(requests);
        }

        if (isAdmin && !isVerifier) {
            // Other Admins who are NOT verifiers currently also see everything 
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
                formName, status, createdAt, updatedAt, date
            ) VALUES (
                ${id}, ${requestNumber}, ${body.requesterName || 'Unknown'}, ${body.position}, ${body.businessUnit}, ${body.chargeTo},
                ${body.accountNo}, ${body.purpose}, ${body.amount || 0}, ${body.verifiedBy}, ${body.approvedBy}, ${body.processedBy},
                ${body.formName}, 'To Verify', ${now}, ${now}, ${now}
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

        // Create Notifications for Verifiers
        const formName = body.formName || 'General Request';
        const allVerifiers: any[] = await prisma.$queryRaw`
            SELECT id, permissions FROM user_permission 
            WHERE isActive = 1 AND formPermissions = 'Verifier'
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
                VALUES (${notifId}, 'REQUEST_VERIFICATION', 'New Request to Verify', ${`A new ${formName} (${requestNumber}) requires your verification.`}, ${id}, ${verifier.id}, 0, ${now})
            `;
        }

        return NextResponse.json({ id, requestNumber });
    } catch (error) {
        console.error('Error creating request:', error);
        return NextResponse.json({ error: `Failed to create request: ${String(error)}` }, { status: 500 });
    }
}
