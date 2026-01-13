'use client';

import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useReminders } from '@/hooks/use-reminders';
import { ReminderDialog } from './reminder-dialog';
import { isSameDay } from 'date-fns';
import { Bell } from 'lucide-react';

export function CalendarCard() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { reminders, addReminder, updateReminder, deleteReminder } = useReminders();

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            setIsDialogOpen(true);
        }
    };

    const getRemindersForDate = (date: Date) => {
        return reminders.filter(r => isSameDay(new Date(r.date), date));
    };

    // Custom day renderer logic could exist here, but Shadcn Calendar uses DayPicker.
    // We can use the `modifiers` prop to highlight days with reminders.
    const daysWithReminders = reminders.map(r => new Date(r.date));

    return (
        <>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Calendar & Notes
                    </CardTitle>
                    <CardDescription>
                        Manage important dates and reminders.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleSelect}
                        className="rounded-md border-0 w-full"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                            month: "space-y-4 w-full",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            row: "flex w-full mt-2",
                            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 w-full",
                            day: "h-9 w-full p-0 font-normal aria-selected:opacity-100",
                            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                        }}
                        modifiers={{
                            hasReminder: daysWithReminders
                        }}
                        modifiersClassNames={{
                            hasReminder: "font-bold text-primary relative after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                        }}
                    />
                </CardContent>
            </Card>

            <ReminderDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                selectedDate={date}
                onSave={async (data) => {
                    if (data.id) {
                        await updateReminder(data.id, data);
                    } else {
                        await addReminder(data);
                    }
                }}
                onDelete={deleteReminder}
                existingReminders={date ? getRemindersForDate(date) : []}
            />
        </>
    );
}
