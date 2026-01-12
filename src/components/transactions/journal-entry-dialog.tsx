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
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardDescription } from '@/components/ui/card';
import { useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import type { Account } from '@/types/account';

interface JournalEntryLine {
    id: string;
    accountId: string;
    accountName: string;
    amount: number;
    type: 'debit' | 'credit';
}

export default function JournalEntryDialog() {
    const { openDialogs, closeDialog } = useDialog();
    const { toast } = useToast();
    const { data: accounts, isLoading: accountsLoading } = useAccounts();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [journal, setJournal] = useState('general');
    const [reference, setReference] = useState('GJ[AUTO]');
    const [journalMemo, setJournalMemo] = useState('Journal Entry');
    const [lines, setLines] = useState<JournalEntryLine[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const addLine = () => {
        const newLine: JournalEntryLine = {
            id: `line-${Date.now()}-${Math.random()}`,
            accountId: '',
            accountName: '',
            amount: 0,
            type: 'debit',
        };
        setLines([...lines, newLine]);
    };

    const removeLine = (id: string) => {
        setLines(lines.filter(line => line.id !== id));
    }; const fetchNextReference = async () => {
        try {
            const response = await fetch('/api/transactions/next-reference');
            if (response.ok) {
                const data = await response.json();
                setReference(data.nextReference);
            }
        } catch (error) {
            console.error('Error fetching next reference:', error);
        }
    };

    useEffect(() => {
        if (openDialogs['journal-entry']) {
            fetchNextReference();
            if (!date) {
                setDate(new Date());
            }
        }
    }, [openDialogs['journal-entry']]);


    const updateLine = (id: string, updates: Partial<JournalEntryLine>) => {
        setLines(lines.map(line => {
            if (line.id === id) {
                const updated = { ...line, ...updates };
                // Update account name when account ID changes
                if (updates.accountId && accounts) {
                    const account = accounts.find(acc => acc.id === updates.accountId);
                    if (account) {
                        updated.accountName = account.name;
                    }
                }
                return updated;
            }
            return line;
        }));
    };

    const handleRecord = async () => {
        if (!date) {
            toast({
                title: 'Validation Error',
                description: 'Please select a date',
                variant: 'destructive',
            });
            return;
        }

        if (lines.length === 0) {
            toast({
                title: 'Validation Error',
                description: 'Please add at least one account allocation',
                variant: 'destructive',
            });
            return;
        }

        // Validate all lines have account and amount
        const invalidLines = lines.filter(line => !line.accountId || line.amount <= 0);
        if (invalidLines.length > 0) {
            toast({
                title: 'Validation Error',
                description: 'Please ensure all lines have an account selected and amount greater than 0',
                variant: 'destructive',
            });
            return;
        }

        // Check if debits equal credits
        const totalDebits = lines.filter(l => l.type === 'debit').reduce((sum, l) => sum + l.amount, 0);
        const totalCredits = lines.filter(l => l.type === 'credit').reduce((sum, l) => sum + l.amount, 0);

        if (Math.abs(totalDebits - totalCredits) > 0.01) {
            toast({
                title: 'Validation Error',
                description: `Total debits (₱${totalDebits.toFixed(2)}) must equal total credits (₱${totalCredits.toFixed(2)})`,
                variant: 'destructive',
            });
            return;
        }

        setIsSaving(true);
        try {
            // Create transaction entries for each line
            const transactions = lines.map((line, index) => {
                const account = accounts?.find(acc => acc.id === line.accountId);
                return {
                    ledger: journal === 'general' ? 'General Ledger' : journal.charAt(0).toUpperCase() + journal.slice(1) + ' Ledger',
                    transNo: reference,
                    code: account?.accnt_no?.toString() || '',
                    accountNumber: account?.accnt_no?.toString() || '',
                    date: date.toISOString(),
                    invoiceNumber: reference,
                    particulars: journalMemo,
                    debit: line.type === 'debit' ? line.amount : 0,
                    credit: line.type === 'credit' ? line.amount : 0,
                    balance: 0, // Will be calculated by backend
                    accountName: account?.name || '',
                    user: 'System', // TODO: Get from auth context
                };
            });

            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ transactions }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to record journal entry');
            }

            toast({
                title: 'Success',
                description: 'Journal entry recorded successfully',
            });

            // Refresh journal entries table
            window.dispatchEvent(new CustomEvent('journal-refresh'));

            setDate(new Date());
            setJournal('general');
            fetchNextReference();
            setJournalMemo('Journal Entry');
            setLines([]);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to record journal entry',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        if (!isSaving) {
            setDate(new Date());
            setJournal('general');
            fetchNextReference();
            setJournalMemo('Journal Entry');
            setLines([]);
            closeDialog('journal-entry');
        }
    };

    return (
        <Dialog open={openDialogs['journal-entry']} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-3xl flex flex-col h-[85vh]">
                <DialogHeader>
                    <DialogTitle>Journal Entry</DialogTitle>
                    <CardDescription>
                        For a manual journal entry enter the details of the transaction and then allocate the amount to accounts.
                    </CardDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-6 -mr-6">
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="date" className="text-right">Date:</Label>
                            <div className="col-span-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={'outline'}
                                            id="date"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
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
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="journal" className="text-right">Journal:</Label>
                            <Select value={journal} onValueChange={setJournal}>
                                <SelectTrigger id="journal" className="col-span-2">
                                    <SelectValue placeholder="General" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General</SelectItem>
                                    <SelectItem value="payments">Payments</SelectItem>
                                    <SelectItem value="receipts">Receipts</SelectItem>
                                    <SelectItem value="sales">Sales</SelectItem>
                                    <SelectItem value="purchases">Purchases</SelectItem>
                                    <SelectItem value="inventory">Inventory</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="reference" className="text-right">Reference:</Label>
                            <Input
                                id="reference"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                                className="col-span-2"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-start gap-4">
                            <Label htmlFor="journal-memo" className="text-right pt-2">Journal memo:</Label>
                            <Textarea
                                id="journal-memo"
                                value={journalMemo}
                                onChange={(e) => setJournalMemo(e.target.value)}
                                className="col-span-2"
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Account Allocation</h3>
                            <Button size="sm" onClick={addLine}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Line
                            </Button>
                        </div>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Account</TableHead>
                                        <TableHead className="w-[150px] text-right">Amount</TableHead>
                                        <TableHead className="w-[100px] text-right">CR/DR</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lines.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                                Click "Add Line" to allocate amounts to accounts.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        lines.map((line) => (
                                            <TableRow key={line.id}>
                                                <TableCell>
                                                    <Select
                                                        value={line.accountId}
                                                        onValueChange={(value) => updateLine(line.id, { accountId: value })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select account" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {accountsLoading ? (
                                                                <SelectItem value="loading" disabled>Loading accounts...</SelectItem>
                                                            ) : (
                                                                accounts?.map((account) => (
                                                                    <SelectItem key={account.id} value={account.id || ''}>
                                                                        {account.accnt_no} - {account.name}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={line.amount || ''}
                                                        onChange={(e) => updateLine(line.id, { amount: parseFloat(e.target.value) || 0 })}
                                                        className="text-right"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={line.type}
                                                        onValueChange={(value: 'debit' | 'credit') => updateLine(line.id, { type: value })}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="debit">DR</SelectItem>
                                                            <SelectItem value="credit">CR</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeLine(line.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {lines.length > 0 && (
                            <div className="flex justify-end gap-4 pt-2 text-sm">
                                <span>
                                    Total Debits: <strong>₱{lines.filter(l => l.type === 'debit').reduce((sum, l) => sum + l.amount, 0).toFixed(2)}</strong>
                                </span>
                                <span>
                                    Total Credits: <strong>₱{lines.filter(l => l.type === 'credit').reduce((sum, l) => sum + l.amount, 0).toFixed(2)}</strong>
                                </span>
                            </div>
                        )}
                    </div>

                </ScrollArea>
                <DialogFooter className="mt-4">
                    <Button variant="outline">Use Template...</Button>
                    <div className="flex-grow" />
                    <Button onClick={handleRecord} disabled={isSaving}>
                        {isSaving ? 'Recording...' : 'Record'}
                    </Button>
                    <Button variant="outline" onClick={handleClose} disabled={isSaving}>Cancel</Button>
                    <Button variant="secondary">Help</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
