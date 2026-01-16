"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function PendingInvoicesWidget() {
    const { data: accounts, isLoading } = useAccounts();

    const data = useMemo(() => {
        if (!accounts) return { count: 0, total: 0 };

        // Sum of all Receivable accounts
        const receivables = accounts
            .filter(acc =>
                (acc.type === 'Asset' && acc.name.toLowerCase().includes('receivable')) ||
                acc.name.toLowerCase() === 'accounts receivable'
            );

        const total = receivables.reduce((sum, acc) => sum + (acc.balance || 0), 0);

        // We don't have a reliable "count" of invoices from just the account balance.
        // We can either show "-" or maybe hidden. 
        // However, to match the design we need a number. 
        // If we can't get it, we could query transactions, but for now let's just show the Balance clearly.
        // I'll leave count as N/A or remove it to avoid misinformation. 

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
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
                {/* If we had a count, we would show it here. For now, focus on Value. */}
                <div className="text-2xl font-bold font-headline">{formatCurrency(data.total)}</div>
                <div className="text-xs text-muted-foreground mt-1 text-right font-medium">
                    Total Receivables
                </div>
                {/* <div className="text-xs text-blue-500 mt-2 cursor-pointer hover:underline text-right">View All</div> */}
            </CardContent>
        </Card>
    );
}
