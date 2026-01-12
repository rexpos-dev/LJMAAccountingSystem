
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useEffect } from 'react';
import format from '@/lib/date-format';
import type { Account } from '@/types/account';
import { useToast } from '@/hooks/use-toast';
import { recordAccountTransfer } from '@/ai/flows/account-transfer-flow';
import { mockAccounts } from '@/app/configuration/chart-of-accounts/mock-accounts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};


export default function AccountTransferPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (openDialogs['account-transfer'] && !date) {
      setDate(new Date());
    }
  }, [openDialogs['account-transfer']]);
  const [amount, setAmount] = useState(0);

  const [fromAccountId, setFromAccountId] = useState<string | undefined>();
  const [toAccountId, setToAccountId] = useState<string | undefined>();

  // Use mock data for bank accounts
  const bankAccounts = mockAccounts.filter(account => account.bank === 'Yes');
  const isLoading = false;


  const selectedFromAccount = useMemo(() => {
    return bankAccounts?.find(acc => acc.id === fromAccountId);
  }, [bankAccounts, fromAccountId]);

  const selectedToAccount = useMemo(() => {
    return bankAccounts?.find(acc => acc.id === toAccountId);
  }, [bankAccounts, toAccountId]);

  const handleRecord = async () => {
    if (!selectedFromAccount || !selectedToAccount || !date || amount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill out all fields and enter a valid amount.',
      });
      return;
    }
    if (selectedFromAccount.balance === undefined || amount > selectedFromAccount.balance) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Transfer amount cannot exceed the source account balance.',
      });
      return;
    }

    try {
      // Mock implementation - just log and show success
      console.log('Mock account transfer:', {
        fromAccountId: selectedFromAccount.id!,
        toAccountId: selectedToAccount.id!,
        amount,
        date,
        fromAccountName: selectedFromAccount.name,
        toAccountName: selectedToAccount.name,
      });

      toast({
        title: 'Success',
        description: 'Account transfer recorded successfully.',
      });

      // Reset form
      setFromAccountId(undefined);
      setToAccountId(undefined);
      setAmount(0);
      setDate(new Date());
      closeDialog('account-transfer');

    } catch (error) {
      console.error('Failed to record transfer:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to record account transfer. Please try again.',
      });
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove non-numeric characters except for a single decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parsedValue = parseFloat(numericValue);
    setAmount(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const formattedAmount = useMemo(() => {
    if (amount === 0) return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, [amount]);


  return (
    <Dialog open={openDialogs['account-transfer']} onOpenChange={() => closeDialog('account-transfer')}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Account Transfer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="from-account" className="text-right">Transfer from account:</Label>
            <div className="col-span-2 flex items-center gap-2">
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger id="from-account" className="flex-1">
                  <SelectValue placeholder="Select an account">{selectedFromAccount?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    bankAccounts?.map(account => (
                      <SelectItem key={account.id} value={account.id!}>{account.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Label htmlFor="from-balance">Balance:</Label>
              <Input id="from-balance" defaultValue={selectedFromAccount?.balance ? formatCurrency(selectedFromAccount.balance) : '₱0.00'} disabled readOnly className="w-32 text-right" />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="to-account" className="text-right">Transfer to account:</Label>
            <div className="col-span-2 flex items-center gap-2">
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger id="to-account" className="flex-1">
                  <SelectValue placeholder="Select an account">{selectedToAccount?.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    bankAccounts?.filter(acc => acc.id !== fromAccountId).map(account => (
                      <SelectItem key={account.id} value={account.id!}>{account.name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Label htmlFor="to-balance">Balance:</Label>
              <Input id="to-balance" defaultValue={selectedToAccount?.balance ? formatCurrency(selectedToAccount.balance) : '₱0.00'} disabled readOnly className="w-32 text-right" />
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount to transfer:</Label>
            <div className="relative col-span-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₱</span>
              <Input id="amount" value={formattedAmount} onChange={handleAmountChange} className="pl-7 text-right" />
            </div>
          </div>
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
        </div>
        <DialogFooter>
          <Button onClick={handleRecord}>Record</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
