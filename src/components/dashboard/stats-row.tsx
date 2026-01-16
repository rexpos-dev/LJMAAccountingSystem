"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, DollarSign, Wallet, CreditCard, Activity } from "lucide-react";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsRow() {
    const { data: accounts, isLoading } = useAccounts();

    const stats = useMemo(() => {
        if (!accounts) return null;

        const calculateTotal = (type: string) =>
            accounts
                .filter(acc => acc.type === type)
                .reduce((sum, acc) => sum + (acc.balance || 0), 0);

        const totalIncome = calculateTotal('Income');
        const totalExpenses = calculateTotal('Expense');
        const netProfit = totalIncome - totalExpenses;

        // Robust matching for COA variations
        const receivables = accounts
            .filter(acc =>
                (acc.type === 'Asset' && acc.name.toLowerCase().includes('receivable')) ||
                acc.name.toLowerCase() === 'accounts receivable'
            )
            .reduce((sum, acc) => sum + (acc.balance || 0), 0);

        const payables = accounts
            .filter(acc =>
                (acc.type === 'Liability' && acc.name.toLowerCase().includes('payable')) ||
                acc.name.toLowerCase() === 'accounts payable'
            )
            .reduce((sum, acc) => sum + (acc.balance || 0), 0);

        return {
            totalIncome,
            totalExpenses,
            netProfit,
            receivables,
            payables
        };
    }, [accounts]);

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
            icon: DollarSign,
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
