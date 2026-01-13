'use client';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmailButtonProps {
    count?: number;
}

export function EmailButton({ count = 0 }: EmailButtonProps) {
    return (
        <Button variant="ghost" size="icon" className="relative">
            <Mail className="h-5 w-5" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center">
                    {count}
                </span>
            )}
            <span className="sr-only">Email notifications</span>
        </Button>
    );
}
