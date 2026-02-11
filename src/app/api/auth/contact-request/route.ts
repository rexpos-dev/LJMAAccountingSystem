import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { name, phone } = await request.json();

        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 });
        }

        const now = new Date();

        // 1. Find all Super Admins
        // We use queryRaw because the Prisma Client might not be perfectly in sync with the DB schema
        const superAdmins: any[] = await prisma.$queryRaw`
            SELECT id FROM user_permission 
            WHERE accountType = 'Super Admin' AND isActive = 1
        `;

        if (superAdmins.length === 0) {
            console.log('No Super Admin found to notify.');
            // We still return 200 because the request was "sent" theoretically, but just not notified to anyone specific
            return NextResponse.json({ message: 'Request received' });
        }

        // 2. Create notification for each Super Admin
        for (const admin of superAdmins) {
            const id = crypto.randomUUID();
            await prisma.$executeRaw`
                INSERT INTO notification (id, type, title, message, userId, isRead, createdAt)
                VALUES (${id}, 'ACCESS_REQUEST', 'New Account Request', ${`New account request from ${name} (${phone})`}, ${admin.id}, 0, ${now})
            `;
        }

        return NextResponse.json({ message: 'Request sent successfully' });
    } catch (error) {
        console.error('Error handling contact request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
