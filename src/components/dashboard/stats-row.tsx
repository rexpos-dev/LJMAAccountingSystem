"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, DollarSign, Wallet, CreditCard, Activity, PhilippinePesoIcon } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useTransactions } from "@/hooks/use-transactions";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsRow() {
    const { data: accounts, isLoading: isAccountsLoading } = useAccounts();
    const { transactions, isLoading: isTransactionsLoading } = useTransactions();
    const isLoading = isAccountsLoading || isTransactionsLoading;

    const stats = useMemo(() => {
        if (!accounts || !transactions) return null;

        let totalIncome = 0;
        let totalExpenses = 0;
        let receivables = 0;
        let payables = 0;

        transactions.forEach((t) => {
            // Find linked account
            const account = accounts.find(acc => acc.account_no?.toString() === t.accountNumber?.toString());
            if (!account) return;

            const debit = t.debit || 0;
            const credit = t.credit || 0;

            // Income (Credit Income increases Income)
            if (account.account_type === 'Income') {
                totalIncome += (credit - debit);
            }
            // Expense (Debit increases Expense)
            else if (account.account_type === 'Expense') {
                totalExpenses += (debit - credit);
            }
            // Assets (specifically Receivables) - Debit increases
            else if (account.account_type === 'Asset') {
                if (account.account_name.toLowerCase().includes('receivable')) {
                    receivables += (debit - credit);
                }
            }
            // Liabilities (specifically Payables) - Credit increases
            else if (account.account_type === 'Liability') {
                if (account.account_name.toLowerCase().includes('payable')) {
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

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {items.map((item, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {item.title}
                        </CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${item.color}`}>{formatCurrency(item.value)}</div>
                        {item.trend && (
                            <div className={`text-xs flex items-center mt-1 ${item.trendColor}`}>
                                <item.trendIcon className="h-3 w-3 mr-1" />
                                {item.trend}
                            </div>
                        )}
                        {item.subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{item.subtitle}</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
