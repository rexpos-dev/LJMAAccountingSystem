"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowUpCircle, ArrowDownCircle, Info } from "lucide-react";

export function LatestBankTransactions() {
    const { data, isLoading } = useBankingStats();

    if (isLoading) {
        return (
            <Card className="col-span-1 lg:col-span-3">
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const transactions = data?.latestTransactions || [];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <Card className="col-span-1 lg:col-span-3 border-none bg-background/50 dark:bg-white/5 backdrop-blur-sm shadow-sm hover:shadow transition-all">
            <CardHeader>
                <CardTitle className="font-headline text-foreground text-lg">Latest 10 Transactions</CardTitle>
                <CardDescription className="text-muted-foreground">Recent movements across all bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground italic">
                            <Info className="h-8 w-8 mb-2 opacity-20" />
                            <p>No recent transactions</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {transactions.map((tx: any) => {
                                const isInflow = ['CASH_IN', 'TRANSFER_IN', 'ADJUSTMENT'].includes(tx.type) && tx.amount > 0;
                                return (
                                    <div key={tx.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${isInflow ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                                {isInflow ? (
                                                    <ArrowUpCircle className={`h-4 w-4 ${isInflow ? 'text-emerald-500' : 'text-red-500'}`} />
                                                ) : (
                                                    <ArrowDownCircle className={`h-4 w-4 text-red-500`} />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground max-w-[180px] truncate">
                                                    {tx.particulars || tx.reference || "No details"}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                                                        {tx.bankAccount?.bank_name}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">•</span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {format(new Date(tx.date), "MMM d, h:mm a")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-bold ${isInflow ? 'text-emerald-500 dark:text-emerald-400' : 'text-foreground'}`}>
                                                {isInflow ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground mt-0.5 uppercase">
                                                {tx.type.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
