import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session as any).id;

        // Fetch rooms where the user is a participant
        const rooms = await prisma.chatRoom.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        return NextResponse.json(rooms);
    } catch (error) {
        console.error('Failed to fetch chat rooms:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (session as any).id;
        const { name, participantIds, isGroup } = await request.json();

        if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
            return NextResponse.json({ error: 'Participants are required' }, { status: 400 });
        }

        // Ensure current user is in participants
        const allParticipants = Array.from(new Set([...participantIds, userId]));

        // If not a group, check if a DM already exists between these two users
        if (!isGroup && allParticipants.length === 2) {
            const existingRoom = await prisma.chatRoom.findFirst({
                where: {
                    isGroup: false,
                    AND: [
                        { participants: { some: { userId: allParticipants[0] } } },
                        { participants: { some: { userId: allParticipants[1] } } },
                    ],
                },
            });

            if (existingRoom) {
                return NextResponse.json(existingRoom);
            }
        }

        const newRoom = await prisma.chatRoom.create({
            data: {
                name: name || null,
                isGroup: !!isGroup,
                participants: {
                    create: allParticipants.map((id) => ({
                        userId: id,
                    })),
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(newRoom);
    } catch (error) {
        console.error('Failed to create chat room:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
