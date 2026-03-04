"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRecentTransactions } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentTransactions() {
    const { transactions: recentTransactions, isLoading } = useRecentTransactions(10);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return <Skeleton className="h-[500px] w-full" />;
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">Recent Transactions</CardTitle>
                <CardDescription>Latest financial activity</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Header */}
                    <div className="grid grid-cols-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b">
                        <div className="col-span-1">Date</div>
                        <div className="col-span-2">Description</div>
                        <div className="col-span-1 text-right">Amount</div>
                    </div>

                    {/* List */}
                    {recentTransactions.map((t, i) => {
                        let date: Date;
                        if (typeof t.date === 'string') {
                            date = new Date(t.date);
                        } else if (typeof t.date === 'object' && t.date && 'seconds' in (t.date as any)) {
                            date = new Date((t.date as any).seconds * 1000);
                        } else {
                            date = new Date(t.date as any || new Date());
                        }

                        const isIncome = (t.debit || 0) > 0;
                        const amount = isIncome ? t.debit : t.credit;
                        const displayAmount = amount || 0;

                        return (
                            <div key={i} className="grid grid-cols-4 items-center gap-4 text-sm">
                                <div className="col-span-1 text-muted-foreground hidden lg:block">
                                    {format(date, "MM/dd/yyyy")}
                                </div>
                                <div className="col-span-1 text-muted-foreground lg:hidden">
                                    {format(date, "MM/dd")}
                                </div>
                                <div className="col-span-2 font-medium truncate">
                                    {t.particulars || t.accountName || t.code || "Transaction"}
                                </div>
                                <div className={`col-span-1 text-right font-bold ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {isIncome ? '+' : '-'} {formatCurrency(displayAmount)}
                                </div>
                            </div>
                        )
                    })}
                    {recentTransactions.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">No recent transactions</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
