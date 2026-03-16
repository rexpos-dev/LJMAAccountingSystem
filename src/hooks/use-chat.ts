import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
}

export function useChat() {
    const queryClient = useQueryClient();

    const { data: messages = [], isLoading, error } = useQuery<ChatMessage[]>({
        queryKey: ['chat-messages'],
        queryFn: async () => {
            const res = await fetch('/api/chat');
            if (!res.ok) throw new Error('Failed to fetch messages');
            return res.json();
        },
        refetchInterval: 3000, // Poll every 3 seconds for near-real-time
        staleTime: 2000,
    });

    const sendMessageMutation = useMutation({
        mutationFn: async (content: string) => {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });
            if (!res.ok) throw new Error('Failed to send message');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
        },
    });

    return {
        messages,
        isLoading,
        error,
        sendMessage: sendMessageMutation.mutate,
        isSending: sendMessageMutation.isPending,
    };
}
