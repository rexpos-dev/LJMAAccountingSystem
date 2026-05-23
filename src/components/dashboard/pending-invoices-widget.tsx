"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccounts } from "@/hooks/use-accounts";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ChevronRight } from "lucide-react";
import { useDialog } from "@/components/layout/dialog-context";

export function PendingInvoicesWidget() {
    const { data: accounts, isLoading } = useAccounts();
    const { openDialog } = useDialog();

    const data = useMemo(() => {
        if (!accounts) return { total: 0 };
        const total = accounts
            .filter(acc =>
                (acc.account_type === 'Asset' && acc.account_name.toLowerCase().includes('receivable')) ||
                acc.account_name.toLowerCase() === 'accounts receivable'
            )
            .reduce((sum, acc) => sum + (acc.balance || 0), 0);
        return { total };
    }, [accounts]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

    if (isLoading) return <Skeleton className="h-[140px] w-full rounded-xl" />;

    return (
        <Card className="overflow-hidden border border-blue-500/20 bg-gradient-to-b from-blue-500/10 to-blue-500/0 backdrop-blur-sm shadow-sm hover:scale-[1.02] transition-all">
            <div className="h-0.5 w-full bg-blue-500 opacity-60" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-3 px-4">
                <CardTitle className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Receivables
                </CardTitle>
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="text-xl font-bold font-headline text-blue-400">{formatCurrency(data.total)}</div>
                <p className="text-[10px] text-muted-foreground mt-1">Total Pending</p>
                <button
                    className="flex items-center gap-0.5 text-[10px] text-blue-400 mt-2 hover:opacity-80 font-semibold transition-opacity"
                    onClick={() => openDialog('invoice-list')}
                >
                    View All <ChevronRight className="h-3 w-3" />
                </button>
            </CardContent>
        </Card>
    );
}
