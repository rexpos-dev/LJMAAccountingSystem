import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const notifications = await prisma.notification.findMany({
            where: { isRead: false },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(notifications);
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, isRead } = body;

        if (!id) {
            // Option to mark ALL as read?
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const notification = await prisma.notification.update({
            where: { id },
            data: { isRead },
        });

        return NextResponse.json(notification);
    } catch (error: any) {
        console.error('Error updating notification:', error);
        return NextResponse.json(
            { error: 'Failed to update notification' },
            { status: 500 }
        );
    }
}
