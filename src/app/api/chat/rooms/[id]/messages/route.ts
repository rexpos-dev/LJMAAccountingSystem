import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;

        const messages = await prisma.chatMessage.findMany({
            where: { roomId: id },
            orderBy: { createdAt: 'asc' },
            include: {
                attachments: true,
            },
            take: 100,
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Failed to fetch messages for room:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { content, attachments } = await request.json();

        const newMessage = await prisma.chatMessage.create({
            data: {
                roomId: id,
                senderId: (session as any).id,
                senderName: `${(session as any).firstName} ${(session as any).lastName}`,
                content: content || '',
                attachments: {
                    create: attachments?.map((att: any) => ({
                        fileName: att.fileName,
                        fileType: att.fileType,
                        fileUrl: att.fileUrl,
                        fileSize: att.fileSize,
                    })),
                },
            },
            include: {
                attachments: true,
            },
        });

        // Update room's updatedAt timestamp
        await prisma.chatRoom.update({
            where: { id },
            data: { updatedAt: new Date() },
        });

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error('Failed to send message:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
