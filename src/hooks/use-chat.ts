'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

export interface ChatRoom {
    id: string;
    name: string | null;
    isGroup: boolean;
    participants: {
        user: {
            id: string;
            firstName: string;
            lastName: string;
        }
    }[];
    messages?: ChatMessage[];
    updatedAt: string;
}

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    attachments?: ChatAttachment[];
}

export interface ChatAttachment {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
}

export function useChat() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

    // Fetch all rooms for the current user
    const { data: rooms = [], isLoading: isLoadingRooms } = useQuery<ChatRoom[]>({
        queryKey: ['chat-rooms'],
        queryFn: async () => {
            const res = await fetch('/api/chat/rooms');
            if (!res.ok) throw new Error('Failed to fetch rooms');
            return res.json();
        },
        refetchInterval: 10000, // Poll rooms every 10 seconds
    });

    // Fetch messages for the active room
    const { data: messages = [], isLoading: isLoadingMessages } = useQuery<ChatMessage[]>({
        queryKey: ['chat-messages', activeRoomId],
        queryFn: async () => {
            if (!activeRoomId) return [];
            const res = await fetch(`/api/chat/rooms/${activeRoomId}/messages`);
            if (!res.ok) throw new Error('Failed to fetch messages');
            return res.json();
        },
        enabled: !!activeRoomId,
        refetchInterval: 3000, // Poll messages every 3 seconds
    });

    // Create or switch to a room
    const createRoomMutation = useMutation({
        mutationFn: async (data: { participantIds: string[], isGroup: boolean, name?: string }) => {
            const res = await fetch('/api/chat/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create room');
            return res.json();
        },
        onSuccess: (newRoom) => {
            queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
            setActiveRoomId(newRoom.id);
        },
    });

    // Send message
    const sendMessageMutation = useMutation({
        mutationFn: async (data: { content: string, attachments?: Partial<ChatAttachment>[] }) => {
            if (!activeRoomId) throw new Error('No active room');
            const res = await fetch(`/api/chat/rooms/${activeRoomId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: data.content,
                    attachments: data.attachments || []
                }),
            });
            if (!res.ok) throw new Error('Failed to send message');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-messages', activeRoomId] });
            queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
        },
    });

    // Rename room
    const renameRoomMutation = useMutation({
        mutationFn: async ({ roomId, name }: { roomId: string, name: string }) => {
            const res = await fetch(`/api/chat/rooms/${roomId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) throw new Error('Failed to rename room');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-rooms'] });
        },
    });

    // Helper for file upload
    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/chat/upload', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Upload failed');
        return res.json();
    };

    // Track last seen messages per room
    const [lastSeen, setLastSeen] = useState<Record<string, string>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('chat_last_seen');
            return saved ? JSON.parse(saved) : {};
        }
        return {};
    });

    // Helper to persist last seen
    const markAsRead = useCallback((roomId: string) => {
        setLastSeen(prev => {
            const room = rooms.find(r => r.id === roomId);
            if (!room || !room.messages?.[0]) return prev;

            // Only update if the message is newer than what we've seen
            if (prev[roomId] === room.messages[0].createdAt) return prev;

            const newLastSeen = {
                ...prev,
                [roomId]: room.messages[0].createdAt
            };
            localStorage.setItem('chat_last_seen', JSON.stringify(newLastSeen));
            return newLastSeen;
        });
    }, [rooms]);

    // Calculate unread counts
    const unreadCount = rooms.reduce((total, room) => {
        const lastMsg = room.messages?.[0];
        if (!lastMsg || lastMsg.senderId === user?.id) return total;

        const lastSeenTime = lastSeen[room.id];
        if (!lastSeenTime || new Date(lastMsg.createdAt) > new Date(lastSeenTime)) {
            return total + 1;
        }
        return total;
    }, 0);

    return {
        rooms,
        activeRoomId,
        setActiveRoomId: (id: string | null) => {
            setActiveRoomId(id);
            if (id) markAsRead(id);
        },
        messages,
        isLoadingRooms,
        isLoadingMessages,
        createRoom: createRoomMutation.mutate,
        sendMessage: (content: string, attachments?: Partial<ChatAttachment>[]) =>
            sendMessageMutation.mutate({ content, attachments }),
        renameRoom: (roomId: string, name: string) =>
            renameRoomMutation.mutate({ roomId, name }),
        uploadFile,
        isSending: sendMessageMutation.isPending,
        isCreatingRoom: createRoomMutation.isPending,
        unreadCount,
        markAsRead,
    };
}
