"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Landmark,
    ClipboardCheck,
    ArrowUpCircle,
    ArrowDownCircle,
    TrendingUp,
    TrendingDown
} from "lucide-react";
import { useBankingStats } from "@/hooks/use-banking-stats";
import { Skeleton } from "@/components/ui/skeleton";

export function BankingStatsRow() {
    const { data, isLoading } = useBankingStats();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading || !data) {
        return (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>
        );
    }

    const items = [
        {
            title: "Total Bank Balance",
            value: formatCurrency(data.totalBankBalance),
            icon: Landmark,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            description: "Aggregate of all bank accounts"
        },
        {
            title: "Pending Audit",
            value: data.pendingAudits.toString(),
            icon: ClipboardCheck,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            description: "Transactions awaiting review"
        },
        {
            title: "Inflow Today",
            value: formatCurrency(data.inflowToday),
            icon: ArrowUpCircle,
            secondaryIcon: TrendingUp,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            description: "Total deposits today"
        },
        {
            title: "Outflow Today",
            value: formatCurrency(data.outflowToday),
            icon: ArrowDownCircle,
            secondaryIcon: TrendingDown,
            color: "text-red-500",
            bg: "bg-red-500/10",
            description: "Total withdrawals today"
        }
    ];

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
                <Card key={index} className="overflow-hidden border-none bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-300">
                            {item.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg ${item.bg}`}>
                            <item.icon className={`h-4 w-4 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-headline text-white mt-1">
                            {item.value}
                        </div>
                        <div className="flex items-center mt-2">
                            {item.secondaryIcon && (
                                <item.secondaryIcon className={`h-3 w-3 mr-1 ${item.color}`} />
                            )}
                            <p className="text-xs text-slate-400">
                                {item.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
