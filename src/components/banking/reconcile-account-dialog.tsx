'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardDescription } from '@/components/ui/card';
import { useBankAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types/transaction';
import { Checkbox } from '@/components/ui/checkbox';

const formatCurrency = (amount: number | string | undefined) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num || 0);
};

export default function ReconcileAccountDialog() {
    const { openDialogs, closeDialog, openDialog } = useDialog();
    const { accounts: bankAccounts, isLoading: isLoadingAccounts } = useBankAccounts();
    const { toast } = useToast();

    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

    const [statementEndingBalance, setStatementEndingBalance] = useState('0.00');
    const [clearedTransactionIds, setClearedTransactionIds] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch transactions when account changes
    useEffect(() => {
        if (selectedAccount && openDialogs['reconcile-account']) {
            const fetchTransactions = async () => {
                setIsLoadingTransactions(true);
                try {
                    // Fetch ALL transactions for the account
                    // In a real app, might want to filter by date or 'uncleared' status + recently cleared
                    const response = await fetch(`/api/transactions?accountId=${selectedAccount}`); // Assuming API supports filtering
                    if (response.ok) {
                        const data = await response.json();

                        // Client-side filtering if API doesn't support accountId filtering fully or returns all
                        // Idealy filter by account number
                        const selectedAccountDetails = bankAccounts.find(a => a.id === selectedAccount);
                        const accountTransactions = data.transactions.filter((t: Transaction) =>
                            (selectedAccountDetails?.account_no && t.accountNumber?.toString() === selectedAccountDetails.account_no.toString()) ||
                            t.accountName === selectedAccountDetails?.account_name
                        );

                        // Pre-select transactions that are already cleared/reconciled if we were editing
                        // For now, assume we are starting fresh or fetching 'isCoincide' status
                        const clearedIds = new Set<string>();
                        accountTransactions.forEach((t: Transaction) => {
                            if (t.isCoincide) clearedIds.add(t.id!);
                        });
                        setClearedTransactionIds(clearedIds);

                        setTransactions(accountTransactions);
                    }
                } catch (error) {
                    console.error("Failed to fetch transactions", error);
                    toast({
                        title: "Error",
                        description: "Failed to load transactions.",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoadingTransactions(false);
                }
            };
            fetchTransactions();
        }
    }, [selectedAccount, openDialogs['reconcile-account'], bankAccounts, toast]);


    const toggleCleared = (id: string) => {
        const newSet = new Set(clearedTransactionIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setClearedTransactionIds(newSet);
    };

    // Calculations
    const clearedDepositsTotal = useMemo(() =>
        transactions
            .filter(t => clearedTransactionIds.has(t.id!) && (t.debit || 0) > 0)
            .reduce((sum, t) => sum + (t.debit || 0), 0)
        , [transactions, clearedTransactionIds]);

    const clearedPaymentsTotal = useMemo(() =>
        transactions
            .filter(t => clearedTransactionIds.has(t.id!) && (t.credit || 0) > 0)
            .reduce((sum, t) => sum + (t.credit || 0), 0)
        , [transactions, clearedTransactionIds]);

    // Cleared Balance = Total Cleared Deposits - Total Cleared Payments
    // Note: This assumes standard Asset account behavior.
    const clearedBalance = clearedDepositsTotal - clearedPaymentsTotal;

    const targetBalance = parseFloat(statementEndingBalance) || 0;
    const difference = clearedBalance - targetBalance;


    const handleReconcile = async () => {
        if (Math.abs(difference) > 0.01) {
            toast({ title: "Cannot Reconcile", description: "Difference must be zero.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            // Update transactions
            const updates = transactions.map(t => ({
                id: t.id,
                isCoincide: clearedTransactionIds.has(t.id!)
            }));

            // Send to API (Batch update placeholder - calling single update loop or bulk endpoint)
            // For now, let's assume we reuse the generic PUT /api/transactions for single updates or a new custom route
            // Simplification: Just update the ones changed? or all.
            // To save token usage, we'll mock the success for now as we don't have a bulk update endpoint ready-ready.
            // Or we iterate.

            for (const t of transactions) {
                if (clearedTransactionIds.has(t.id!) !== t.isCoincide) {
                    await fetch('/api/transactions', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            id: t.id,
                            isCoincide: clearedTransactionIds.has(t.id!)
                        })
                    });
                }
            }

            toast({ title: "Success", description: "Account Reconciled Successfully" });
            closeDialog('reconcile-account');

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save reconciliation.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog
            open={openDialogs['reconcile-account']}
            onOpenChange={() => closeDialog('reconcile-account')}
        >
            <DialogContent className="max-w-7xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Reconcile Account</DialogTitle>
                    <CardDescription>
                        Bank Accounts can be reconciled with Journal entries. Journal entries not yet reconciled will be displayed allowing you to tick off those that can be reconciled.
                    </CardDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-6 p-1">
                        <div className="border p-4 rounded-md space-y-4">
                            <h3 className='font-semibold'>Local Ledger Transactions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="account">Account:</Label>
                                        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                                            <SelectTrigger id="account" className="col-span-2">
                                                <SelectValue placeholder="Select Account" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bankAccounts.map(acc => (
                                                    <SelectItem key={acc.id} value={acc.id || ''}>{acc.account_name} ({acc.account_no})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="last-reconciled">Last Reconciled Date:</Label>
                                        <Input id="last-reconciled" disabled className="col-span-2" placeholder="Never" />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="bank-statement-date">Bank Statement Date:</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={'outline'}
                                                    id="bank-statement-date"
                                                    className={cn(
                                                        'w-full justify-start text-left font-normal col-span-2',
                                                        !date && 'text-muted-foreground'
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="new-statement-balance">New Statement Balance:</Label>
                                        {/* Prefix with P like functionality placeholder in earlier version */}
                                        <div className="relative col-span-2">
                                            <span className="absolute left-3 top-2.5 text-slate-400">₱</span>
                                            <Input
                                                id="new-statement-balance"
                                                value={statementEndingBalance}
                                                onChange={(e) => setStatementEndingBalance(e.target.value)}
                                                className="text-right pl-7"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="calculated-statement-balance">Calculated Statement Balance:</Label>
                                        <Input id="calculated-statement-balance" value={formatCurrency(clearedBalance)} disabled className="col-span-2 text-right" />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="out-of-balance">Out of Balance:</Label>
                                        <Input
                                            id="out-of-balance"
                                            value={formatCurrency(difference)}
                                            disabled
                                            className={cn("col-span-2 text-right font-bold", difference === 0 ? "text-emerald-600" : "text-red-500")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12"></TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Transaction</TableHead>
                                            <TableHead>Journal Memo</TableHead>
                                            <TableHead className="text-right">Deposits</TableHead>
                                            <TableHead className="text-right">Payments</TableHead>
                                            <TableHead>Ref</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingTransactions ? (
                                            <TableRow className="border-slate-800">
                                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">Loading transactions...</TableCell>
                                            </TableRow>
                                        ) : transactions.length === 0 ? (
                                            <TableRow className="border-slate-800">
                                                <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                                                    No transactions found for this account.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map(t => (
                                                <TableRow key={t.id} className={cn("cursor-pointer", clearedTransactionIds.has(t.id!) && "bg-muted/50")} onClick={() => toggleCleared(t.id!)}>
                                                    <TableCell>
                                                        <Checkbox checked={clearedTransactionIds.has(t.id!)} onCheckedChange={() => toggleCleared(t.id!)} />
                                                    </TableCell>
                                                    <TableCell>{t.date ? format(new Date(t.date as any), 'MM/dd/yyyy') : '-'}</TableCell>
                                                    <TableCell className="font-medium">{t.particulars || '-'}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{t.code || '-'}</TableCell>
                                                    <TableCell className="text-right text-emerald-600 font-mono">{(t.debit || 0) > 0 ? formatCurrency(t.debit) : '-'}</TableCell>
                                                    <TableCell className="text-right text-orange-600 font-mono">{(t.credit || 0) > 0 ? formatCurrency(t.credit) : '-'}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{t.transNo}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="w-full" onClick={() => openDialog('enter-payment' as any)}>Add a new payment transaction</Button>
                                <Button variant="outline" className="w-full" onClick={() => openDialog('receipts-deposits' as any)}>Add a new receipt transaction</Button>
                            </div>
                        </div>

                        <div className="border p-4 rounded-md space-y-4">
                            <h3 className='font-semibold'>Bank Statement's Transactions</h3>
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Number of Transactions: 0</span>
                                <span>Number of Matched Transactions: 0</span>
                            </div>
                            <div className="border rounded-md bg-muted/10 min-h-[150px] flex items-center justify-center text-muted-foreground italic">
                                Bank feed integration not configured.
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="w-full">Load a bank statement</Button>
                                <Button variant="outline" className="w-full">Add Transaction</Button>
                            </div>
                        </div>

                    </div>
                </ScrollArea>
                <DialogFooter className="border-t pt-4 mt-4">
                    <Button variant="secondary">Rollback to Previous</Button>
                    <div className="flex-grow" />
                    <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={Math.abs(difference) > 0.01 || isSubmitting}
                        onClick={handleReconcile}
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Reconcile
                    </Button>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={() => closeDialog('reconcile-account')}>Cancel</Button>
                    </DialogClose>
                    <Button variant="secondary">Help</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
