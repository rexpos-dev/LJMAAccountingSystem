"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountBalances() {
    const { data: accounts, isLoading } = useAccounts();

    const balances = useMemo(() => {
        if (!accounts) return null;

        const getBalance = (match: (name: string, type: string) => boolean) =>
            accounts
                .filter(acc => match(acc.account_name || '', acc.account_type || ''))
                .reduce((sum, acc) => sum + (acc.balance || 0), 0);

        // Flexible matching for account names
        const checking = getBalance((name, type) =>
            name.toLowerCase().includes('checking') || type === 'Bank' && !name.toLowerCase().includes('saving')
        );
        const savings = getBalance((name, type) =>
            name.toLowerCase().includes('saving')
        );
        const creditCard = getBalance((name, type) =>
            name.toLowerCase().includes('credit card') || type === 'Credit Card'
        );

        return { checking, savings, creditCard };
    }, [accounts]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading || !balances) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[100px] w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h3 className="font-headline font-semibold text-lg text-primary">Account Balances</h3>
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-blue-500">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Checking Accounts</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{formatCurrency(balances.checking)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-green-500">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Savings Account</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">{formatCurrency(balances.savings)}</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-50 dark:bg-slate-900 border-l-4 border-l-red-500">
                    <CardHeader className="py-4">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Credit Card</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold text-red-900 dark:text-red-100">{formatCurrency(balances.creditCard)}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
