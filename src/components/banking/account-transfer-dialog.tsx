'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { CalendarIcon, ArrowRightLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useBankAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import type { Account } from '@/types/account';

export default function AccountTransferDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { accounts: bankAccounts, isLoading: isLoadingAccounts } = useBankAccounts();
    const { toast } = useToast();

    const [fromAccount, setFromAccount] = useState<string>('');
    const [toAccount, setToAccount] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [memo, setMemo] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nextReference, setNextReference] = useState<string>('');

    // Fetch next reference when dialog opens
    useEffect(() => {
        if (openDialogs['account-transfer']) {
            fetch('/api/transactions/next-reference')
                .then(res => res.json())
                .then(data => {
                    if (data.nextReference) {
                        setNextReference(data.nextReference);
                    }
                })
                .catch(console.error);
        }
    }, [openDialogs['account-transfer']]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fromAccount || !toAccount || !amount || !date) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields.",
                variant: "destructive"
            });
            return;
        }

        if (fromAccount === toAccount) {
            toast({
                title: "Validation Error",
                description: "Source and Destination accounts cannot be the same.",
                variant: "destructive"
            });
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({
                title: "Validation Error",
                description: "Please enter a valid amount greater than 0.",
                variant: "destructive"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const fromAcc = bankAccounts.find(a => a.id === fromAccount);
            const toAcc = bankAccounts.find(a => a.id === toAccount);

            if (!fromAcc || !toAcc) throw new Error("Account details not found");

            // Prepare transaction payload (2 lines)
            const transactions = [
                {
                    transNo: nextReference,
                    accountNumber: fromAcc.account_no.toString(),
                    accountName: fromAcc.account_name,
                    date: date,
                    particulars: memo || `Transfer to ${toAcc.account_name}`,
                    debit: 0,
                    credit: numericAmount, // Credit source (Asset decreases)
                    user: 'System', // Replace with actual user if available
                    // Add other fields as needed based on schema
                },
                {
                    transNo: nextReference,
                    accountNumber: toAcc.account_no.toString(),
                    accountName: toAcc.account_name,
                    date: date,
                    particulars: memo || `Transfer from ${fromAcc.account_name}`,
                    debit: numericAmount, // Debit destination (Asset increases)
                    credit: 0,
                    user: 'System',
                }
            ];

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactions }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to process transfer");
            }

            toast({
                title: "Transfer Successful",
                description: `Successfully transferred ${new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(numericAmount)} from ${fromAcc.account_name} to ${toAcc.account_name}.`,
            });

            // Refresh accounts references
            window.dispatchEvent(new CustomEvent('accounts-refresh'));
            window.dispatchEvent(new CustomEvent('journal-refresh'));

            resetForm();
            closeDialog('account-transfer');

        } catch (error: any) {
            console.error(error);
            toast({
                title: "Transfer Failed",
                description: error.message || "An error occurred while processing the transfer.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFromAccount('');
        setToAccount('');
        setAmount('');
        setDate(new Date());
        setMemo('');
    };

    // Filter out selected account from other dropdown
    const availableToAccounts = bankAccounts.filter(a => a.id !== fromAccount);
    const availableFromAccounts = bankAccounts.filter(a => a.id !== toAccount);

    return (
        <Dialog open={openDialogs['account-transfer']} onOpenChange={() => closeDialog('account-transfer')}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Account Transfer</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Account</Label>
                            <Select value={fromAccount} onValueChange={setFromAccount}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Source" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableFromAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>To Account</Label>
                            <Select value={toAccount} onValueChange={setToAccount}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Dest" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableToAccounts.map(acc => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.account_name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex justify-center text-muted-foreground">
                        <ArrowRightLeft className="w-5 h-5 rotate-90 sm:rotate-0" />
                    </div>

                    <div className="space-y-2">
                        <Label>Amount</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">₱</span>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="pl-7"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Reference</Label>
                            <Input value={nextReference} disabled className="bg-muted" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Memo (Optional)</Label>
                        <Input value={memo} onChange={e => setMemo(e.target.value)} placeholder="e.g., Monthly Transfer" />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <Button type="button" variant="outline" onClick={() => closeDialog('account-transfer')}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Transfer Funds
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
