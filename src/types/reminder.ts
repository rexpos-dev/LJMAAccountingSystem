
export interface Reminder {
    id: string;
    title: string;
    memo: string | null;
    date: string | Date; // API returns string (ISO), but we might work with Date
    endDate: string | Date | null;
    isActive: boolean;
    isRead: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
