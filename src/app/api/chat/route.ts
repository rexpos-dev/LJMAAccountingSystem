import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    try {
        const messages = await prisma.chatMessage.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            take: 50,
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Failed to fetch chat messages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content } = await request.json();
        if (!content || content.trim() === '') {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const newMessage = await prisma.chatMessage.create({
            data: {
                senderId: (session as any).id,
                senderName: `${(session as any).firstName} ${(session as any).lastName}`,
                content,
            },
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Failed to send chat message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
