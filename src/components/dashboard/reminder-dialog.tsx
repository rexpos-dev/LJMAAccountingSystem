'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import type { Reminder } from '@/types/reminder';
import { Trash2 } from 'lucide-react';

interface ReminderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | undefined;
    onSave: (data: Partial<Reminder>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    existingReminders: Reminder[];
}

export function ReminderDialog({
    isOpen,
    onClose,
    selectedDate,
    onSave,
    onDelete,
    existingReminders,
}: ReminderDialogProps) {
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [time, setTime] = useState('09:00');
    const [editingId, setEditingId] = useState<string | null>(null);

    // If opening for a date that already has a reminder, populate it (simple single-reminder support first, or list)
    // For simplicity: List existing reminders for the date, and allow adding new one.
    // Actually, user requirement: "set a notes and notification".
    // A simple list of notes for that day is best.

    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setMemo('');
            setTime('09:00');
            setEditingId(null);
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        // Merge date and time
        const [hours, minutes] = time.split(':').map(Number);
        const finalDate = new Date(selectedDate);
        finalDate.setHours(hours);
        finalDate.setMinutes(minutes);

        try {
            await onSave({
                id: editingId || undefined,
                title,
                memo,
                date: finalDate,
            });
            setTitle('');
            setMemo('');
            setTime('09:00');
            setEditingId(null);
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleEdit = (reminder: Reminder) => {
        setTitle(reminder.title);
        setMemo(reminder.memo || '');
        // Extract time from reminder date string/object
        const d = new Date(reminder.date);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        setTime(`${h}:${m}`);
        setEditingId(reminder.id);
    }

    const handleCancelEdit = () => {
        setTitle('');
        setMemo('');
        setTime('09:00');
        setEditingId(null);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select Date'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* List existing reminders for this day */}
                    {existingReminders.length > 0 && (
                        <div className="space-y-2 mb-4">
                            <Label className="text-xs text-muted-foreground uppercase">Reminders for this day</Label>
                            <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                {existingReminders.map(rem => (
                                    <div key={rem.id} className="group flex items-start justify-between bg-muted/30 p-2 rounded text-sm border hover:bg-muted/50 transition-colors">
                                        <div onClick={() => handleEdit(rem)} className="cursor-pointer flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-mono bg-background px-1 rounded border">
                                                    {format(new Date(rem.date), 'HH:mm')}
                                                </span>
                                                <p className="font-medium text-foreground">{rem.title}</p>
                                            </div>
                                            {rem.memo && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{rem.memo}</p>}
                                        </div>
                                        <button
                                            onClick={() => onDelete(rem.id)}
                                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <Label className="mb-2 block">{editingId ? 'Edit Reminder' : 'Add Note / Reminder'}</Label>
                        <form id="reminder-form" onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Tax Payment"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="memo">Details (Optional)</Label>
                                <Textarea
                                    id="memo"
                                    value={memo}
                                    onChange={(e) => setMemo(e.target.value)}
                                    placeholder="Add more details..."
                                />
                            </div>
                        </form>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    {editingId && (
                        <Button type="button" variant="ghost" onClick={handleCancelEdit} className="sm:mr-auto">
                            Cancel Edit
                        </Button>
                    )}
                    <Button type="button" variant="secondary" onClick={onClose}>Close</Button>
                    <Button type="submit" form="reminder-form">
                        {editingId ? 'Update' : 'Add Note'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
