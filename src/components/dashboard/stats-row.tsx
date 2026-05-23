"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, Wallet, CreditCard, Activity, PhilippinePesoIcon } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useTransactions } from "@/hooks/use-transactions";
import { useMemo, useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PosStats {
    totalRevenueAllTime: number;
    totalRevenueMonth: number;
    totalSalesMonth: number;
    productsSoldMonth: number;
    lowStockItems: number;
    totalItems: number;
}

export function StatsRow() {
    const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
    const { transactions, isLoading: isTransactionsLoading } = useTransactions();
    const { toast } = useToast();

    const [isSyncing, setIsSyncing] = useState(false);
    const [posStats, setPosStats] = useState<PosStats | null>(null);
    const [isPosLoading, setIsPosLoading] = useState(true);

    const isLoading = isAccountsLoading || isTransactionsLoading || isPosLoading;

    const fetchPosStats = async () => {
        setIsPosLoading(true);
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch('/api/pos/stats', { signal: controller.signal }).catch(() => null);
            clearTimeout(timeoutId);
            
            if (!response || !response.ok) {
                console.warn('Silent fallback: Failed to fetch POS stats');
                setPosStats(null);
                return;
            }
            const data = await response.json();

            if (data && data.summary) {
                setPosStats(data.summary);
            } else {
                setPosStats(data as PosStats);
            }
        } catch (error) {
            console.warn('Silent fallback catch: Error fetching POS stats for dashboard:', error);
        } finally {
            setIsPosLoading(false);
        }
    };

    useEffect(() => {
        fetchPosStats();
    }, []);

    const handleSyncPos = async () => {
        setIsSyncing(true);
        try {
            const response = await fetch('/api/sync/pos', {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to sync POS data');
            }
            toast({
                title: "Sync Successful",
                description: "POS data has been successfully synchronized.",
            });
            // Re-fetch pos stats after sync
            await fetchPosStats();
        } catch (error: any) {
            toast({
                title: "Sync Failed",
                description: error.message || "An error occurred during synchronization.",
                variant: "destructive"
            });
        } finally {
            setIsSyncing(false);
        }
    };

    const stats = useMemo(() => {
        if (!accounts || !transactions) return null;

        let totalIncome = 0;
        let totalExpenses = 0;
        let receivables = 0;
        let payables = 0;

        // Group transactions by account
        const accountTransactions = new Map<string, { debit: number, credit: number }>();
        transactions.forEach(t => {
            const accNo = t.accountNumber?.toString();
            if (!accNo) return;
            const current = accountTransactions.get(accNo) || { debit: 0, credit: 0 };
            accountTransactions.set(accNo, {
                debit: current.debit + (t.debit || 0),
                credit: current.credit + (t.credit || 0)
            });
        });

        accounts.forEach((account) => {
            const accNo = account.account_no.toString();
            const txs = accountTransactions.get(accNo);
            if (!txs) return;

            const debit = txs.debit;
            const credit = txs.credit;
            const type = account.account_type;
            const name = account.account_name.toLowerCase();

            // Normal Balance Logic based on baseType or common accounting rules
            // Asset/Expense: Debit + , Credit -
            // Liability/Equity/Income: Credit + , Debit -

            // We use the account_type to categorization
            if (type === 'Income') {
                totalIncome += (credit - debit);
            } else if (type === 'Expense' || type === 'Cost of Sales') {
                totalExpenses += (debit - credit);
            } else if (type === 'Asset' || type === 'Bank') {
                if (name.includes('receivable')) {
                    receivables += (debit - credit);
                }
            } else if (type === 'Liability') {
                if (name.includes('payable')) {
                    payables += (credit - debit);
                }
            }
        });

        const netProfit = totalIncome - totalExpenses;

        return {
            totalIncome,
            totalExpenses,
            netProfit,
            receivables,
            payables
        };
    }, [accounts, transactions]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading || !stats) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>
        );
    }

    const items = [
        {
            title: "Total Income",
            value: stats.totalIncome,
            icon: PhilippinePesoIcon,
            color: "text-emerald-500",
            trend: "+12% This Month", // Mock trend for now
            trendColor: "text-emerald-500",
            trendIcon: ArrowUpIcon
        },
        {
            title: "Total Expenses",
            value: stats.totalExpenses,
            icon: Wallet,
            color: "text-red-500",
            trend: "+8% This Month",
            trendColor: "text-red-500",
            trendIcon: ArrowUpIcon
        },
        {
            title: "Net Profit",
            value: stats.netProfit,
            icon: Activity,
            color: "text-emerald-500",
            trend: "+15% This Month",
            trendColor: "text-emerald-500",
            trendIcon: ArrowUpIcon
        },
        {
            title: "Outstanding Receivables",
            value: stats.receivables,
            icon: CreditCard,
            color: "text-blue-500",
            subtitle: "Pending Collections"
        },
        {
            title: "Outstanding Payables",
            value: stats.payables,
            icon: CreditCard,
            color: "text-amber-500",
            subtitle: "Upcoming Payments"
        }
    ];

    const posItems = [
        {
            title: "POS All Time Revenue",
            value: posStats?.totalRevenueAllTime ?? 0,
            icon: PhilippinePesoIcon,
            color: "text-indigo-600",
            subtitle: posStats ? "Total Synchronized from POS" : "No POS Connection (Offline)"
        },
        {
            title: "POS Monthly Revenue",
            value: posStats?.totalRevenueMonth ?? 0,
            icon: PhilippinePesoIcon,
            color: "text-indigo-500",
            subtitle: posStats ? "Sales from POS System" : "No POS Connection (Offline)"
        },
        {
            title: "POS Products Sold",
            value: posStats?.productsSoldMonth ?? 0,
            icon: Activity,
            color: "text-purple-500",
            subtitle: posStats ? "Units Moved This Month" : "No POS Connection (Offline)",
            isNumber: true
        }
    ];

    const iconBg: Record<string, string> = {
        "text-emerald-500": "bg-emerald-500/10",
        "text-red-500": "bg-red-500/10",
        "text-blue-500": "bg-blue-500/10",
        "text-amber-500": "bg-amber-500/10",
        "text-indigo-600": "bg-indigo-500/10",
        "text-indigo-500": "bg-indigo-500/10",
        "text-purple-500": "bg-purple-500/10",
    };

    const cardGradient: Record<string, string> = {
        "text-emerald-500": "from-emerald-500/10 to-emerald-500/0 border-emerald-500/20",
        "text-red-500": "from-red-500/10 to-red-500/0 border-red-500/20",
        "text-blue-500": "from-blue-500/10 to-blue-500/0 border-blue-500/20",
        "text-amber-500": "from-amber-500/10 to-amber-500/0 border-amber-500/20",
        "text-indigo-600": "from-indigo-500/10 to-indigo-500/0 border-indigo-500/20",
        "text-indigo-500": "from-indigo-500/10 to-indigo-500/0 border-indigo-500/20",
        "text-purple-500": "from-purple-500/10 to-purple-500/0 border-purple-500/20",
    };

    const topAccent: Record<string, string> = {
        "text-emerald-500": "bg-emerald-500",
        "text-red-500": "bg-red-500",
        "text-blue-500": "bg-blue-500",
        "text-amber-500": "bg-amber-500",
        "text-indigo-600": "bg-indigo-500",
        "text-indigo-500": "bg-indigo-500",
        "text-purple-500": "bg-purple-500",
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-foreground/5 p-4 rounded-xl border border-foreground/10 shadow-sm backdrop-blur-sm">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Financial Overview</h2>
                    <p className="text-sm text-muted-foreground">Monitor your key financial metrics</p>
                </div>
                <Button onClick={handleSyncPos} disabled={isSyncing} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" >
                    {isSyncing ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full mr-2" />
                            Syncing...
                        </>
                    ) : (
                        <>
                            <Activity className="h-4 w-4 mr-2" />
                            Sync POS
                        </>
                    )}
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {items.map((item, index) => (
                        <Card key={index} className={`overflow-hidden border bg-gradient-to-b ${cardGradient[item.color] || 'border-foreground/10'} backdrop-blur-sm hover:scale-[1.02] transition-all shadow-sm`}>
                            <div className={`h-0.5 w-full ${topAccent[item.color] || 'bg-primary'} opacity-60`} />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
                                <CardTitle className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                    {item.title}
                                </CardTitle>
                                <div className={`p-1.5 rounded-lg ${iconBg[item.color] || 'bg-foreground/10'}`}>
                                    <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <div className={`text-xl font-bold font-headline ${item.color}`}>
                                    {('isNumber' in item && item.isNumber) ? item.value.toLocaleString() : formatCurrency(item.value)}
                                </div>
                                {('trend' in item && item.trend) ? (
                                    <div className={`text-[10px] flex items-center mt-1.5 font-medium ${('trendColor' in item ? item.trendColor : '')}`}>
                                        {('trendIcon' in item && item.trendIcon) ? (
                                            <item.trendIcon className="h-3 w-3 mr-1" />
                                        ) : null}
                                        {item.trend}
                                    </div>
                                ) : null}
                                {item.subtitle && (
                                    <p className="text-[10px] text-muted-foreground mt-1.5">{item.subtitle}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {posItems.length > 0 && (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {posItems.map((item, index) => (
                            <Card key={`pos-${index}`} className={`overflow-hidden border bg-gradient-to-b ${cardGradient[item.color] || 'border-indigo-500/20'} backdrop-blur-sm hover:scale-[1.02] transition-all shadow-sm`}>
                                <div className={`h-0.5 w-full ${topAccent[item.color] || 'bg-indigo-500'} opacity-60`} />
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
                                    <CardTitle className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                        {item.title}
                                    </CardTitle>
                                    <div className={`p-1.5 rounded-lg ${iconBg[item.color] || 'bg-indigo-500/10'}`}>
                                        <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                                    </div>
                                </CardHeader>
                                <CardContent className="px-4 pb-4">
                                    <div className={`text-xl font-bold font-headline ${item.color}`}>
                                        {item.isNumber ? item.value.toLocaleString() : formatCurrency(item.value)}
                                    </div>
                                    {item.subtitle && (
                                        <p className="text-[10px] text-muted-foreground mt-1.5">{item.subtitle}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
