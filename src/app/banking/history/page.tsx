"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { BankTransactionsTable } from "@/components/banking/bank-transactions-table";
import {
    History,
    Search,
    Download,
    Filter as FilterIcon,
    ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useBankAccounts } from "@/hooks/use-accounts";

export default function BankHistoryPage() {
    const { state } = useSidebar();
    const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
    const { accounts: bankAccounts } = useBankAccounts();

    const selectedAccount = bankAccounts.find(a => a.id === selectedAccountId);

    return (
        <div className="flex-1 flex flex-col p-6 space-y-6 bg-background/50">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <History className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Bank Transactions</h1>
                        <p className="text-sm text-muted-foreground">
                            History of all cash movements, transfers, and adjustments.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" /> Export
                    </Button>
                    <Button size="sm" className="gap-2">
                        <FilterIcon className="h-4 w-4" /> Filter
                    </Button>
                </div>
            </div>

            {/* Control bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card rounded-xl border shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search history..." className="pl-9 bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary" />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2 min-w-[180px] justify-between">
                                <span className="truncate">
                                    {selectedAccount ? `${selectedAccount.account_name}` : "All Bank Accounts"}
                                </span>
                                <ChevronDown className="h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[220px]">
                            <DropdownMenuItem onClick={() => setSelectedAccountId(undefined)}>
                                All Bank Accounts
                            </DropdownMenuItem>
                            {bankAccounts.map((account) => (
                                <DropdownMenuItem key={account.id} onClick={() => setSelectedAccountId(account.id)}>
                                    {account.account_name} ({account.bank_account_no})
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="text-xs text-muted-foreground font-medium bg-muted/30 px-3 py-1.5 rounded-full border">
                    Showing {selectedAccount ? "specific" : "all"} account history
                </div>
            </div>

            {/* Table section */}
            <div className="flex-1 overflow-hidden">
                <BankTransactionsTable bankAccountId={selectedAccountId} />
            </div>
        </div>
    );
}
