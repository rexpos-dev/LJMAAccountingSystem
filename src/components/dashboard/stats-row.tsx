"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, DollarSign, Wallet, CreditCard, Activity, PhilippinePesoIcon } from "lucide-react";
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
            const response = await fetch('/api/pos/stats').catch(() => null);
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

    const posItems = posStats ? [
        {
            title: "POS All Time Revenue",
            value: posStats.totalRevenueAllTime,
            icon: PhilippinePesoIcon,
            color: "text-indigo-600",
            subtitle: "Total Synchronized from POS"
        },
        {
            title: "POS Monthly Revenue",
            value: posStats.totalRevenueMonth,
            icon: PhilippinePesoIcon,
            color: "text-indigo-500",
            subtitle: "Sales from POS System"
        },
        {
            title: "POS Products Sold",
            value: posStats.productsSoldMonth,
            icon: Activity,
            color: "text-purple-500",
            subtitle: "Units Moved This Month",
            isNumber: true
        }
    ] : [];

    // Provide a default isNumber for items object
    const allItems = [...items, ...posItems];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-sm">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight">Financial Overview</h2>
                    <p className="text-sm text-muted-foreground">Monitor your key financial metrics</p>
                </div>
                <Button
                    onClick={handleSyncPos}
                    disabled={isSyncing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                    {isSyncing ? (
                        <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-b-transparent rounded-full mr-2" />
                            Syncing POS...
                        </>
                    ) : (
                        <>
                            <Activity className="h-4 w-4 mr-2" />
                            Force Sync POS
                        </>
                    )}
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                    {items.map((item, index) => (
                        <Card key={index} className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {item.title}
                                </CardTitle>
                                <item.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-xl font-bold ${item.color}`}>
                                    {('isNumber' in item && item.isNumber) ? item.value.toLocaleString() : formatCurrency(item.value)}
                                </div>
                                {('trend' in item && item.trend) ? (
                                    <div className={`text-xs flex items-center mt-1 ${('trendColor' in item ? item.trendColor : '')}`}>
                                        {('trendIcon' in item && item.trendIcon) ? (
                                            <item.trendIcon className="h-3 w-3 mr-1" />
                                        ) : null}
                                        {item.trend}
                                    </div>
                                ) : null}
                                {item.subtitle && (
                                    <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {posItems.length > 0 && (
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                        {posItems.map((item, index) => (
                            <Card key={`pos-${index}`} className="overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {item.title}
                                    </CardTitle>
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-xl font-bold ${item.color}`}>
                                        {item.isNumber ? item.value.toLocaleString() : formatCurrency(item.value)}
                                    </div>
                                    {item.subtitle && (
                                        <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
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
