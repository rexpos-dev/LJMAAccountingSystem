import { useState, useEffect } from 'react';
import { Bell, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReminders } from '@/hooks/use-reminders';
import { useNotifications } from '@/hooks/use-notifications';
import { isSameDay, format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
// import { ReminderDialog } from '../dashboard/reminder-dialog'; // Removed

export function NotificationBell() {
    const { reminders, updateReminder } = useReminders();
    const { notifications, markAsRead } = useNotifications();

    // We keep this to open the dialog with reminder details
    const [selectedReminder, setSelectedReminder] = useState<typeof reminders[0] | undefined>(undefined);
    // const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const hasNotifications = notifications.length > 0;

    const handleNotificationClick = async (notification: typeof notifications[0]) => {
        // Mark notification as read
        await markAsRead(notification.id);

        // Redirect based on type
        switch (notification.type) {
            case 'reminder_create':
            case 'reminder_update':
            case 'reminder_delete':
                router.push('/dashboard');
                break;
            case 'REQUEST_VERIFICATION':
                if (notification.entityId) {
                    router.push(`/requests?id=${notification.entityId}`);
                } else {
                    router.push('/requests');
                }
                break;
            default:
                // Default fallback
                router.push('/dashboard');
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {hasNotifications && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No new notifications.
                        </div>
                    ) : (
                        <div className="max-h-[300px] overflow-y-auto">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className="cursor-pointer flex flex-col items-start gap-1 p-3 border-b last:border-0"
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        <Info className="h-3 w-3 text-blue-500" />
                                        <span className="font-semibold text-sm flex-1 truncate">{notification.title}</span>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    {notification.message && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 pl-5">
                                            {notification.message}
                                        </p>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-center text-xs text-primary cursor-pointer justify-center"
                        onClick={() => router.push('/dashboard')}
                    >
                        View Calendar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ReminderDialog usage removed as it was deleted. TODO: Integrate with CalendarModal if needed */}
        </>
    );
}
