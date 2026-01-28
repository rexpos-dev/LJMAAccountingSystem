'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useReminders } from '@/hooks/use-reminders';
import { isSameDay, format } from 'date-fns';
import { Bell, Trash2, Clock, StickyNote } from 'lucide-react';
import type { Reminder } from '@/types/reminder';

interface CalendarModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CalendarModal({ open, onOpenChange }: CalendarModalProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { reminders, addReminder, updateReminder, deleteReminder } = useReminders();

    // Form State
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [time, setTime] = useState('09:00');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Reset form when date changes or dialog opens
    useEffect(() => {
        if (open) {
            resetForm();
        }
    }, [open, date]);

    const resetForm = () => {
        setTitle('');
        setMemo('');
        setTime('09:00');
        setEditingId(null);
    };

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        // Don't auto-reset form here if we want to allow user to copy-paste or similar? 
        // But usually selecting a new date implies working on that date.
    };

    const getRemindersForDate = (targetDate: Date) => {
        return reminders.filter(r => isSameDay(new Date(r.date), targetDate));
    };

    const daysWithReminders = reminders.map(r => new Date(r.date));
    const selectedDateReminders = date ? getRemindersForDate(date) : [];

    const handleEdit = (reminder: Reminder) => {
        setTitle(reminder.title);
        setMemo(reminder.memo || '');
        const d = new Date(reminder.date);
        const h = d.getHours().toString().padStart(2, '0');
        const m = d.getMinutes().toString().padStart(2, '0');
        setTime(`${h}:${m}`);
        setEditingId(reminder.id);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;

        const [hours, minutes] = time.split(':').map(Number);
        const finalDate = new Date(date);
        finalDate.setHours(hours);
        finalDate.setMinutes(minutes);

        try {
            if (editingId) {
                await updateReminder(editingId, {
                    title,
                    memo,
                    date: finalDate,
                });
            } else {
                await addReminder({
                    title,
                    memo,
                    date: finalDate,
                });
            }
            resetForm();
        } catch (error) {
            console.error("Failed to save reminder", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[900px] w-full p-0 overflow-hidden h-[600px] flex flex-col md:flex-row">

                {/* Left Column: Calendar */}
                <div className="p-6 md:w-1/2 flex flex-col border-r">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            Calendar
                        </DialogTitle>
                        <DialogDescription>
                            Select a date to view or manage events.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleSelect}
                            className="rounded-md w-full border-none"
                            classNames={{
                                months: "flex flex-col w-full",
                                month: "space-y-4 w-full",
                                table: "w-full border-collapse space-y-1",
                                head_row: "flex w-full",
                                head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]",
                                row: "flex w-full mt-2",
                                cell: "h-9 w-9 text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                day: "h-9 w-full p-0 font-normal aria-selected:opacity-100",
                                caption: "flex justify-center pt-1 relative items-center mb-4",
                                caption_label: "text-sm font-medium",
                                nav: "space-x-1 flex items-center",
                                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border rounded hover:bg-muted",
                                nav_button_previous: "absolute left-1",
                                nav_button_next: "absolute right-1",
                            }}
                            modifiers={{
                                hasReminder: daysWithReminders
                            }}
                            modifiersClassNames={{
                                hasReminder: "font-bold text-primary relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                            }}
                        />
                    </div>
                </div>

                {/* Right Column: Event Settings */}
                <div className="p-6 md:w-1/2 flex flex-col bg-muted/10 h-full overflow-hidden">
                    <DialogHeader className="mb-4 flex-shrink-0">
                        <DialogTitle>
                            {date ? format(date, 'MMMM d, yyyy') : 'No Date Selected'}
                        </DialogTitle>
                        <DialogDescription>
                            Events & Reminders
                        </DialogDescription>
                    </DialogHeader>

                    {date ? (
                        <div className="flex-1 flex flex-col gap-6 overflow-hidden">

                            {/* List of Existing Reminders */}
                            <div className="flex-1 min-h-0 flex flex-col">
                                <Label className="mb-2 text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> Scheduled Events
                                </Label>
                                <ScrollArea className="flex-1 rounded-md border bg-background p-2">
                                    {selectedDateReminders.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm p-4 text-center">
                                            <StickyNote className="w-8 h-8 mb-2 opacity-20" />
                                            <p>No events for this day.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedDateReminders.map(rem => (
                                                <div key={rem.id} className="group flex items-start gap-3 bg-muted/40 p-3 rounded-md border hover:bg-muted/60 transition-colors">
                                                    <div className="flex-1 cursor-pointer" onClick={() => handleEdit(rem)}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-semibold text-sm">{rem.title}</span>
                                                            <span className="text-xs font-mono bg-background px-1.5 py-0.5 rounded border text-muted-foreground">
                                                                {format(new Date(rem.date), 'HH:mm')}
                                                            </span>
                                                        </div>
                                                        {rem.memo && <p className="text-xs text-muted-foreground line-clamp-2">{rem.memo}</p>}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => deleteReminder(rem.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>

                            {/* Add/Edit Form */}
                            <div className="flex-shrink-0 border-t pt-4">
                                <Label className="mb-3 block font-medium">
                                    {editingId ? 'Edit Event' : 'Add New Event'}
                                </Label>
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-[1fr_100px] gap-2">
                                        <div className="space-y-1">
                                            <Input
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Event Title"
                                                required
                                                className="bg-background"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                required
                                                className="bg-background"
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        value={memo}
                                        onChange={(e) => setMemo(e.target.value)}
                                        placeholder="Notes (optional)"
                                        className="bg-background resize-none h-16"
                                    />
                                    <div className="flex justify-end gap-2">
                                        {editingId && (
                                            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" size="sm">
                                            {editingId ? 'Update Event' : 'Add Event'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Select a date to manage events
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
