"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, PiggyBank, CreditCard, Wallet } from "lucide-react";

export function AccountBalances() {
    const { data: accounts, isLoading } = useAccounts();

    const balances = useMemo(() => {
        if (!accounts) return null;

        const getBalance = (match: (name: string, type: string) => boolean) =>
            accounts
                .filter(acc => match(acc.account_name || '', acc.account_type || ''))
                .reduce((sum, acc) => sum + (acc.balance || 0), 0);

        const checking = getBalance((name, type) =>
            name.toLowerCase().includes('checking') || (type === 'Bank' && !name.toLowerCase().includes('saving'))
        );
        const savings = getBalance((name) => name.toLowerCase().includes('saving'));
        const creditCard = getBalance((name, type) =>
            name.toLowerCase().includes('credit card') || type === 'Credit Card'
        );

        return { checking, savings, creditCard };
    }, [accounts]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    if (isLoading || !balances) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-5 w-36" />
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[90px] rounded-xl" />)}
                </div>
            </div>
        );
    }

    const accts = [
        {
            label: "Checking",
            value: balances.checking,
            icon: Building2,
            gradient: "from-blue-500/15 to-blue-500/0",
            border: "border-blue-500/25",
            accent: "bg-blue-500",
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-400",
            valueColor: "text-black dark:text-white",
        },
        {
            label: "Savings",
            value: balances.savings,
            icon: PiggyBank,
            gradient: "from-emerald-500/15 to-emerald-500/0",
            border: "border-emerald-500/25",
            accent: "bg-emerald-500",
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-400",
            valueColor: "text-black dark:text-white",
        },
        {
            label: "Credit Card",
            value: balances.creditCard,
            icon: CreditCard,
            gradient: "from-rose-500/15 to-rose-500/0",
            border: "border-rose-500/25",
            accent: "bg-rose-500",
            iconBg: "bg-rose-500/10",
            iconColor: "text-rose-400",
            valueColor: "text-red-600 dark:text-red-400",
        },
    ];

    const total = balances.checking + balances.savings;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
                <h3 className="font-headline font-bold text-base text-foreground/90 flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    Account Balances
                </h3>
                <span className="text-xs text-muted-foreground font-mono">{formatCurrency(total)} total</span>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                {accts.map((acct) => (
                    <Card key={acct.label} className={`overflow-hidden border ${acct.border} bg-gradient-to-b ${acct.gradient} backdrop-blur-sm hover:scale-[1.02] transition-all shadow-sm`}>
                        <div className={`h-0.5 w-full ${acct.accent} opacity-50`} />
                        <CardHeader className="p-3 pb-1">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{acct.label}</CardTitle>
                                <div className={`p-1.5 rounded-lg ${acct.iconBg}`}>
                                    <acct.icon className={`h-3.5 w-3.5 ${acct.iconColor}`} />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-1 pb-3">
                            <div className={`text-lg font-bold font-headline ${acct.valueColor}`}>{formatCurrency(acct.value)}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
