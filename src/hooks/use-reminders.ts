'use client';

import { useState, useEffect } from 'react';
import type { Reminder } from '@/types/reminder';
import { useToast } from '@/hooks/use-toast';

export function useReminders() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { toast } = useToast();

    const fetchReminders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/reminders');
            if (!response.ok) {
                throw new Error('Failed to fetch reminders');
            }
            const data = await response.json();
            // Ensure dates are parsed as Date objects for easier calendar handling
            const parsedData = Array.isArray(data) ? data.map((r: any) => ({
                ...r,
                date: new Date(r.date),
                endDate: r.endDate ? new Date(r.endDate) : null,
            })) : [];
            setReminders(parsedData);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const addReminder = async (data: Partial<Reminder>) => {
        try {
            const response = await fetch('/api/reminders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add reminder');
            }

            const newReminder = await response.json();
            setReminders((prev) => [...prev, {
                ...newReminder,
                date: new Date(newReminder.date),
                endDate: newReminder.endDate ? new Date(newReminder.endDate) : null
            }]);
            toast({
                title: "Success",
                description: "Reminder added successfully.",
            });
            return newReminder;
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to add reminder.",
                variant: "destructive"
            });
            throw error;
        }
    };

    const updateReminder = async (id: string, data: Partial<Reminder>) => {
        try {
            const response = await fetch('/api/reminders', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...data }),
            });

            if (!response.ok) throw new Error('Failed to update reminder');

            await fetchReminders(); // Refresh to ensure strict sync or just update local
            toast({
                title: "Success",
                description: "Reminder updated successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update reminder.",
                variant: "destructive"
            });
            throw error;
        }
    };

    const deleteReminder = async (id: string) => {
        try {
            const response = await fetch(`/api/reminders?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete reminder');

            setReminders((prev) => prev.filter((r) => r.id !== id));
            toast({
                title: "Success",
                description: "Reminder deleted successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to delete reminder.",
                variant: "destructive"
            });
            throw error;
        }
    };

    return { reminders, isLoading, error, fetchReminders, addReminder, updateReminder, deleteReminder };
}
