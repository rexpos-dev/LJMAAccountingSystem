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

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    if (isLoading || !data) {
        return (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[130px] rounded-xl" />
                ))}
            </div>
        );
    }

    const items = [
        {
            title: "Total Bank Balance",
            value: formatCurrency(data.totalBankBalance),
            icon: Landmark,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            accent: "bg-blue-500",
            gradient: "from-blue-500/15 to-blue-500/0 border-blue-500/25",
            description: "Aggregate of all bank accounts",
        },
        {
            title: "Pending Audit",
            value: data.pendingAudits.toString(),
            icon: ClipboardCheck,
            color: "text-amber-400",
            bg: "bg-amber-500/10",
            accent: "bg-amber-500",
            gradient: "from-amber-500/15 to-amber-500/0 border-amber-500/25",
            description: "Transactions awaiting review",
        },
        {
            title: "Inflow Today",
            value: formatCurrency(data.inflowToday),
            icon: ArrowUpCircle,
            secondaryIcon: TrendingUp,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            accent: "bg-emerald-500",
            gradient: "from-emerald-500/15 to-emerald-500/0 border-emerald-500/25",
            description: "Total deposits today",
        },
        {
            title: "Outflow Today",
            value: formatCurrency(data.outflowToday),
            icon: ArrowDownCircle,
            secondaryIcon: TrendingDown,
            color: "text-red-400",
            bg: "bg-red-500/10",
            accent: "bg-red-500",
            gradient: "from-red-500/15 to-red-500/0 border-red-500/25",
            description: "Total withdrawals today",
        }
    ];

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
                <Card key={index} className={`overflow-hidden border bg-gradient-to-b ${item.gradient} backdrop-blur-sm hover:scale-[1.02] transition-all shadow-sm`}>
                    <div className={`h-0.5 w-full ${item.accent} opacity-60`} />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
                        <CardTitle className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            {item.title}
                        </CardTitle>
                        <div className={`p-1.5 rounded-lg ${item.bg}`}>
                            <item.icon className={`h-3.5 w-3.5 ${item.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                        <div className={`text-2xl font-bold font-headline ${item.color}`}>
                            {item.value}
                        </div>
                        <div className="flex items-center mt-2 gap-1">
                            {item.secondaryIcon && (
                                <item.secondaryIcon className={`h-3 w-3 ${item.color} opacity-70`} />
                            )}
                            <p className="text-[10px] text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
