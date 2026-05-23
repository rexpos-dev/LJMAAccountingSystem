'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-context';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useAccounts } from '@/hooks/use-accounts';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown } from 'lucide-react';

export default function GeneralLedgerDialog() {
    const { openDialogs, closeDialog, openDialog, setDialogData } = useDialog();
    const { data: accounts, isLoading: accountsLoading } = useAccounts();

    // Default to start of current month and today
    const [fromDate, setFromDate] = useState<Date | undefined>(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });
    const [toDate, setToDate] = useState<Date | undefined>(new Date());
    const [accountId, setAccountId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAccountPopoverOpen, setIsAccountPopoverOpen] = useState(false);

    const handleRunReport = () => {
        setDialogData('general-ledger-report' as any, {
            fromDate: fromDate?.toISOString(),
            toDate: toDate?.toISOString(),
            accountId
        });
        closeDialog('general-ledger-dialog' as any);
        openDialog('general-ledger-report' as any);
    };

    const filteredAccounts = accounts?.filter(acc =>
        acc.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.account_no.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedAccount = accountId === 'all'
        ? null
        : accounts?.find(acc => acc.id === accountId);

    return (
        <Dialog open={openDialogs['general-ledger-dialog'] || false} onOpenChange={() => closeDialog('general-ledger-dialog' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>General Ledger Report Options</DialogTitle>
                    <DialogDescription>
                        Select the date range and account to generate the General Ledger.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Select Account</Label>
                        <Popover open={isAccountPopoverOpen} onOpenChange={setIsAccountPopoverOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" aria-expanded={isAccountPopoverOpen} className="w-full justify-between font-normal" disabled={accountsLoading} >
                                    <span className="truncate">
                                        {accountId === 'all'
                                            ? "All Accounts"
                                            : selectedAccount
                                                ? `${selectedAccount.account_no} - ${selectedAccount.account_name}`
                                                : "Select account..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                <div className="p-2 border-b">
                                    <div className="flex items-center px-2 bg-muted/50 rounded-md">
                                        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <Input placeholder="Search account..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                            className="h-9 border-0 bg-transparent focus-visible:ring-0 px-0"
                                        />
                                    </div>
                                </div>
                                <ScrollArea className="h-72">
                                    <div className="p-1">
                                        <Button variant="ghost" className="w-full justify-start font-normal" onClick={() => {
                                                setAccountId('all');
                                                setIsAccountPopoverOpen(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    accountId === 'all' ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            -- All Accounts --
                                        </Button>
                                        {filteredAccounts?.map((acc) => (
                                            <Button key={acc.id} variant="ghost" className="w-full justify-start font-normal" onClick={() => {
                                                    setAccountId(acc.id || '');
                                                    setIsAccountPopoverOpen(false);
                                                    setSearchQuery('');
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        accountId === acc.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <span className="truncate">{acc.account_no} - {acc.account_name}</span>
                                            </Button>
                                        ))}
                                        {filteredAccounts?.length === 0 && (
                                            <div className="py-6 text-center text-sm text-muted-foreground">
                                                No account found.
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground" )} >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {fromDate ? format(fromDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={fromDate}
                                        onSelect={setFromDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>To Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className={cn( "w-full justify-start text-left font-normal", !toDate && "text-muted-foreground" )} >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {toDate ? format(toDate, "MM/dd/yyyy") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={toDate}
                                        onSelect={setToDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end gap-2">
                        <Button variant="outline" onClick={() => closeDialog('general-ledger-dialog' as any)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleRunReport} disabled={!fromDate || !toDate} >
                            Run Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
