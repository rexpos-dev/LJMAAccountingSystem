'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string | null;
    entityId: string | null;
    isRead: boolean;
    createdAt: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Optional: Poll every minute or listen to sockets (not implemented)
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isRead: true }),
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id)); // Remove from list or mark as read? User said "remove bubble number once viewed". 
                // If I filter it out, it disappears from the list.
                // If I keep it but mark read, it stays in list but badge ignores it.
                // I will filter it out of the "Unread" list mainly, or update state.
                // For now, let's update state to isRead: true
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return { notifications, isLoading, fetchNotifications, markAsRead };
}
