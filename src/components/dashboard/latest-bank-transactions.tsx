"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, ListOrdered } from "lucide-react";

export function LatestBankTransactions() {
    const { data, isLoading } = useBankingStats();

    if (isLoading) {
        return (
            <Card className="col-span-1 lg:col-span-3 overflow-hidden border border-foreground/10 bg-foreground/5">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const transactions = data?.latestTransactions || [];

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 2 }).format(amount);

    return (
        <Card className="col-span-1 lg:col-span-3 overflow-hidden border border-emerald-500/15 bg-gradient-to-b from-emerald-500/5 to-transparent backdrop-blur-sm shadow-sm hover:shadow transition-all">
            <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 opacity-60" />
            <CardHeader className="pt-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-emerald-500/10">
                            <ListOrdered className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-foreground text-base">Latest Transactions</CardTitle>
                            <CardDescription className="text-muted-foreground">Recent movements across all banks</CardDescription>
                        </div>
                    </div>
                    <span className="text-[10px] font-semibold text-muted-foreground bg-foreground/10 border border-foreground/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Last 10
                    </span>
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm italic gap-2">
                        <ListOrdered className="h-8 w-8 opacity-20" />
                        No recent transactions
                    </div>
                ) : (
                    <div className="space-y-1">
                        {transactions.map((tx: any) => {
                            const isInflow = ['CASH_IN', 'TRANSFER_IN', 'ADJUSTMENT'].includes(tx.type) && tx.amount > 0;
                            return (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between py-2.5 px-2 rounded-lg hover:bg-foreground/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`p-1.5 rounded-full shrink-0 ${isInflow ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            {isInflow
                                                ? <ArrowUpCircle className="h-3.5 w-3.5 text-emerald-400" />
                                                : <ArrowDownCircle className="h-3.5 w-3.5 text-red-400" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-foreground/80 truncate max-w-[160px] group-hover:text-foreground transition-colors">
                                                {tx.particulars || tx.reference || "No details"}
                                            </p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">
                                                    {tx.bankAccount?.bank_name || "Bank"}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground/40">•</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                    {format(new Date(tx.date), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 pl-2">
                                        <p className={`text-xs font-bold ${isInflow ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {isInflow ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-tight">
                                            {tx.type.replace('_', ' ')}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
