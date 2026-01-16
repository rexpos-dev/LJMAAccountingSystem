"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingBillsWidget() {
    const { data: accounts, isLoading } = useAccounts();

    const data = useMemo(() => {
        if (!accounts) return { count: 0, total: 0 };

        // Sum of all Payable accounts
        const payables = accounts
            .filter(acc =>
                (acc.type === 'Liability' && acc.name.toLowerCase().includes('payable')) ||
                acc.name.toLowerCase() === 'accounts payable'
            );

        const total = payables.reduce((sum, acc) => sum + (acc.balance || 0), 0);

        return { count: null, total };
    }, [accounts]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return <Skeleton className="h-[120px] w-full" />;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Bills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold font-headline">{formatCurrency(data.total)}</div>
                <div className="text-xs text-muted-foreground mt-1 text-right font-medium">Total Payables</div>
                {/* <div className="text-xs text-blue-500 mt-2 cursor-pointer hover:underline text-right">View All</div> */}
            </CardContent>
        </Card>
    );
}
