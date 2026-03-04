'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
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

    const handleRunReport = () => {
        setDialogData('general-ledger-report' as any, {
            fromDate: fromDate?.toISOString(),
            toDate: toDate?.toISOString(),
            accountId
        });
        closeDialog('general-ledger-dialog' as any);
        openDialog('general-ledger-report' as any);
    };

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
                        <Select value={accountId} onValueChange={setAccountId} disabled={accountsLoading}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Accounts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">-- All Accounts --</SelectItem>
                                {accounts?.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.account_no} - {acc.account_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>From Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !fromDate && "text-muted-foreground"
                                        )}
                                    >
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
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !toDate && "text-muted-foreground"
                                        )}
                                    >
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
                        <Button
                            variant="outline"
                            onClick={() => closeDialog('general-ledger-dialog' as any)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRunReport}
                            disabled={!fromDate || !toDate}
                        >
                            Run Report
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
