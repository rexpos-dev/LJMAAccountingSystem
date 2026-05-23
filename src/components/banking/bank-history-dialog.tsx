'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BankTransactionsTable } from '@/components/banking/bank-transactions-table';
import {
    History,
    Search,
    Download,
    Filter as FilterIcon,
    ChevronDown,
    Plus,
    Calendar as CalendarIcon,
    RefreshCw,
    FilePlus,
    ChevronUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useBankAccounts } from '@/hooks/use-accounts';

export default function BankHistoryDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();
    const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(undefined);
    const [filterType, setFilterType] = useState<string>('ALL');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const { accounts: bankAccounts } = useBankAccounts();

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const selectedAccount = bankAccounts.find(a => a.id === selectedAccountId);

    const handleClearFilters = () => {
        setSelectedAccountId(undefined);
        setFilterType('ALL');
        setFilterStatus('ALL');
        setStartDate('');
        setEndDate('');
        setSearchQuery('');
    };

    return (
        <Dialog open={openDialogs['bank-history']} onOpenChange={() => closeDialog('bank-history' as any)}>
            <DialogContent className="max-w-[1400px] h-[92vh] flex flex-col p-6 overflow-hidden bg-background/95 backdrop-blur-sm">
                <DialogHeader className="flex-none pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl shadow-inner border border-primary/5">
                                <History className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Bank Transactions
                                </DialogTitle>
                                <p className="text-xs text-muted-foreground font-medium">
                                    History of all cash movements, transfers, and adjustments.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative w-64 mr-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                                <Input placeholder="Search reference, particular..." className="pl-9 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className="gap-2 shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] active:scale-[0.98] group">
                                        <Plus className="h-4 w-4" /> New Transaction
                                        <ChevronUp className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-xl">
                                    <DropdownMenuItem onClick={() => openDialog('account-transfer' as any)} className="gap-2 cursor-pointer">
                                        <RefreshCw className="h-4 w-4 text-blue-500" /> Bank Transfer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => openDialog('receipts-deposits' as any)} className="gap-2 cursor-pointer">
                                        <Download className="h-4 w-4 text-emerald-500" /> Receipts & Deposits
                                    </DropdownMenuItem>
                                    <div className="h-px bg-muted my-1.5" />
                                    <DropdownMenuItem onClick={() => openDialog('add-bank-transaction' as any)} className="gap-2 cursor-pointer">
                                        <FilePlus className="h-4 w-4 text-amber-500" /> Add Transaction
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button variant="outline" className="gap-2 border-primary/10 bg-primary/5 hover:bg-primary/10" onClick={() => {/* Export Logic */ }}>
                                <Download className="h-4 w-4" /> Export
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-hidden mt-6">
                    {/* Filter Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-6 py-4 bg-muted/20 rounded-2xl border border-foreground/5 shadow-inner">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Account Filter</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="w-full gap-2 justify-between bg-card hover:bg-muted/50 border-foreground/5 shadow-sm">
                                        <span className="truncate font-medium">
                                            {selectedAccount ? `${selectedAccount.account_name}` : "All accounts"}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50 flex-none" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[280px] p-1.5 shadow-2xl">
                                    <DropdownMenuItem onClick={() => setSelectedAccountId(undefined)} className="font-semibold text-primary">
                                        All Bank Accounts
                                    </DropdownMenuItem>
                                    <div className="h-px bg-muted my-1.5" />
                                    {bankAccounts.map((account) => (
                                        <DropdownMenuItem key={account.id} onClick={() => setSelectedAccountId(account.id)} className="flex flex-col items-start gap-0.5 py-2">
                                            <span className="font-medium">{account.account_name}</span>
                                            <span className="text-[10px] text-muted-foreground">{account.bank_name} • {account.bank_account_no}</span>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Type</label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className=" bg-card border-foreground/5 shadow-sm font-medium">
                                    <SelectValue placeholder="All types" />
                                </SelectTrigger>
                                <SelectContent className="p-1">
                                    <SelectItem value="ALL">All types</SelectItem>
                                    <SelectItem value="CASH_IN" className="text-emerald-600">Cash In</SelectItem>
                                    <SelectItem value="CASH_OUT" className="text-rose-600">Cash Out</SelectItem>
                                    <SelectItem value="TRANSFER_IN" className="text-blue-600">Transfer In</SelectItem>
                                    <SelectItem value="TRANSFER_OUT" className="text-slate-600">Transfer Out</SelectItem>
                                    <SelectItem value="ADJUSTMENT" className="text-amber-600">Adjustment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Audit Status</label>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className=" bg-card border-foreground/5 shadow-sm font-medium">
                                    <SelectValue placeholder="All status" />
                                </SelectTrigger>
                                <SelectContent className="p-1">
                                    <SelectItem value="ALL">All status</SelectItem>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="TO_AUDIT">To Audit</SelectItem>
                                    <SelectItem value="APPROVED">Approved</SelectItem>
                                    <SelectItem value="POSTED">Posted</SelectItem>
                                    <SelectItem value="RECONCILED">Reconciled</SelectItem>
                                    <SelectItem value="CANCELLED" className="text-rose-600">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Date range (From)</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                                    className="h-10 pl-9 bg-card border-foreground/5 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider ml-1">Date range (To)</label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70 pointer-events-none" />
                                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                    className="h-10 pl-9 bg-card border-foreground/5 shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table section */}
                    <div className="flex-1 overflow-hidden rounded-2xl border border-foreground/5 bg-card shadow-2xl relative">
                        <div className="absolute inset-0 overflow-auto">
                            <BankTransactionsTable
                                bankAccountId={selectedAccountId}
                                type={filterType}
                                status={filterStatus}
                                search={debouncedSearch}
                                startDate={startDate}
                                endDate={endDate}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-none pt-4 border-t mt-4 gap-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full text-[10px] font-bold text-primary border border-primary/20">
                            <Search className="h-3 w-3" />
                            {debouncedSearch ? `Search active: "${debouncedSearch}"` : "Real-time filtering enabled"}
                        </div>
                        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-wider hover:bg-rose-500/10 hover:text-rose-500" onClick={handleClearFilters} >
                            Reset all filters
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => closeDialog('bank-history' as any)} className="font-semibold text-muted-foreground">
                            Cancel
                        </Button>

                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
