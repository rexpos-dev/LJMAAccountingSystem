"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useReminders } from "@/hooks/use-reminders";
import { useDialog } from "@/components/layout/dialog-provider";
import { CalendarDays } from "lucide-react";

export function CalendarCard() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const { reminders } = useReminders();
    const { openDialog } = useDialog();

    const daysWithReminders = reminders.map(r => new Date(r.date));

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        if (selectedDate) {
            openDialog('calendar-modal');
        }
    };

    return (
        <Card className="overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/10 to-primary/0 backdrop-blur-sm shadow-sm">
            <div className="h-0.5 w-full bg-gradient-to-r from-primary via-violet-500 to-blue-500 opacity-70" />
            <CardHeader className="pb-0 pt-4 px-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <CalendarDays className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-foreground text-base">Calendar</CardTitle>
                            <CardDescription className="text-slate-400 text-xs">Events & Reminders</CardDescription>
                        </div>
                    </div>
                    {daysWithReminders.length > 0 && (
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                            {daysWithReminders.length} reminder{daysWithReminders.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center pb-2">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleSelect}
                    className="rounded-md w-full border-none p-2"
                    classNames={{
                        months: "flex flex-col w-full",
                        month: "space-y-2 w-full",
                        table: "w-full border-collapse space-y-0.5",
                        head_row: "flex w-full",
                        head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.7rem]",
                        row: "flex w-full mt-1",
                        cell: "h-7 w-7 text-center text-sm p-0 relative flex-1 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-7 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-primary/20 transition-colors rounded-md text-xs",
                        caption: "flex justify-center pt-0 relative items-center mb-1",
                        caption_label: "text-xs font-semibold text-foreground",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 border border-foreground/10 rounded-md hover:bg-foreground/10 transition-colors",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        day_selected: "bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white rounded-md",
                        day_today: "bg-foreground/10 text-foreground font-bold rounded-md",
                    }}
                    modifiers={{ hasReminder: daysWithReminders }}
                    modifiersClassNames={{
                        hasReminder: "font-bold text-primary relative after:content-[''] after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full"
                    }}
                />
            </CardContent>
        </Card>
    );
}
