"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRecentTransactions } from "@/hooks/use-transactions";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";

export function RecentTransactions() {
    const { transactions: recentTransactions, isLoading } = useRecentTransactions(10);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    if (isLoading) {
        return <Skeleton className="h-[400px] w-full rounded-xl" />;
    }

    return (
        <Card className="col-span-1 overflow-hidden border border-foreground/10 bg-foreground/5 backdrop-blur-sm shadow-sm">
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-blue-500 opacity-60" />
            <CardHeader className="pb-3 pt-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-foreground/10">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-foreground">Recent Transactions</CardTitle>
                            <CardDescription className="text-slate-400 mt-0.5">Latest financial activity</CardDescription>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-foreground/10 border border-foreground/10 px-2.5 py-1 rounded-full uppercase tracking-wider">Last 10</span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-0.5">
                    {/* Header */}
                    <div className="grid grid-cols-12 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pb-2 border-b border-foreground/10 px-2">
                        <div className="col-span-3">Date</div>
                        <div className="col-span-6">Description</div>
                        <div className="col-span-3 text-right">Amount</div>
                    </div>

                    {recentTransactions.length === 0 && (
                        <div className="text-center text-muted-foreground py-10 text-sm">No recent transactions</div>
                    )}

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
                        const displayAmount = isIncome ? (t.debit || 0) : (t.credit || 0);

                        return (
                            <div
                                key={i}
                                className="grid grid-cols-12 items-center gap-2 text-sm px-2 py-2.5 rounded-lg hover:bg-foreground/5 transition-colors group"
                            >
                                <div className="col-span-3 text-muted-foreground text-[11px] font-mono">
                                    <span className="hidden lg:inline">{format(date, "MM/dd/yyyy")}</span>
                                    <span className="lg:hidden">{format(date, "MM/dd")}</span>
                                </div>
                                <div className="col-span-6 font-medium truncate text-foreground/80 text-xs group-hover:text-foreground transition-colors">
                                    {t.particulars || t.accountName || t.code || "Transaction"}
                                </div>
                                <div className="col-span-3 flex justify-end">
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {isIncome
                                            ? <ArrowUpRight className="h-3 w-3 shrink-0" />
                                            : <ArrowDownRight className="h-3 w-3 shrink-0" />
                                        }
                                        <span className="hidden sm:inline">{formatCurrency(displayAmount)}</span>
                                        <span className="sm:hidden">
                                            {new Intl.NumberFormat('en-PH', { notation: 'compact', currency: 'PHP' }).format(displayAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
