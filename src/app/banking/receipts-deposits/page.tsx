
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import format from '@/lib/date-format';
import { useBankAccounts, useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Account } from '@/types/account';

export default function ReceiptsDepositsPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { accounts: bankAccounts, isLoading: isLoadingBanks } = useBankAccounts();
  const { data: allAccounts } = useAccounts();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.00');
  const [reference, setReference] = useState<string>('');
  const [journalMemo, setJournalMemo] = useState<string>('Receipt');
  const [checkNo, setCheckNo] = useState<string>('');

  const [allocations, setAllocations] = useState<{ accountId: string; amount: number; memo: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBank = bankAccounts.find(a => a.id === selectedBankId);

  const addAllocation = () => {
    setAllocations([...allocations, { accountId: '', amount: 0, memo: '' }]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: string, value: any) => {
    const newAllocations = [...allocations];
    (newAllocations[index] as any)[field] = value;
    setAllocations(newAllocations);
  };

  const totalAllocated = allocations.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);

  const handleRecord = async () => {
    if (!selectedBankId || parseFloat(amount) <= 0 || allocations.length === 0) {
      toast({ title: 'Error', description: 'Please fill out all required fields and add at least one allocation.', variant: 'destructive' });
      return;
    }

    if (Math.abs(totalAllocated - parseFloat(amount)) > 0.01) {
      toast({ title: 'Error', description: 'Total allocations must equal the deposit amount.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/banking/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankGlId: selectedBankId,
          amount: parseFloat(amount),
          date: date?.toISOString(),
          reference,
          memo: journalMemo,
          allocations,
          user: 'admin'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to record deposit');
      }

      toast({ title: 'Success', description: 'Deposit recorded successfully.' });
      window.dispatchEvent(new CustomEvent('bank-accounts-refresh'));
      closeDialog('receipts-deposits');
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Dialog open={openDialogs['receipts-deposits']} onOpenChange={() => closeDialog('receipts-deposits')}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Receipts and Deposits</DialogTitle>
          <CardDescription>
            For a receipt or deposit transaction enter the details of the transaction and then allocate the amount to one or more accounts.
          </CardDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="date" className="text-right">Transaction date:</Label>
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
              <Label htmlFor="deposit-account" className="text-right">Deposit account:</Label>
              <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                <SelectTrigger id="deposit-account" className="col-span-2">
                  <SelectValue placeholder="Select Bank Account" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingBanks ? (
                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                  ) : (
                    bankAccounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id!}>{acc.account_name}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="account-balance" className="text-right">Account Balance:</Label>
              <Input id="account-balance" value={selectedBank ? `₱${selectedBank.balance?.toFixed(2) || '0.00'}` : '₱0.00'} disabled className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="amount" className="text-right">Amount:</Label>
              <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="ref-number" className="text-right">Reference number:</Label>
              <Input id="ref-number" value={reference} onChange={(e) => setReference(e.target.value)} className="col-span-2" />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="transaction-reference" className="text-right">Transaction reference:</Label>
              <div className="col-span-2 flex items-center gap-2">
                <Input id="transaction-reference" defaultValue="REC [AUTO]" readOnly />
                <Label htmlFor="check-no" className="whitespace-nowrap">Check no.:</Label>
                <Input id="check-no" value={checkNo} onChange={(e) => setCheckNo(e.target.value)} className="w-20" />
              </div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <Label htmlFor="journal-memo" className="text-right">Journal memo:</Label>
              <Textarea
                id="journal-memo"
                value={journalMemo}
                onChange={(e) => setJournalMemo(e.target.value)}
                className="col-span-2"
              />
            </div>
          </div>

          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-white">Account Allocation</h3>
              <Button size="sm" variant="outline" onClick={addAllocation}><Plus className="h-4 w-4 mr-1" /> Add Account</Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="w-[150px] text-right">Amount</TableHead>
                    <TableHead className="w-[100px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        Click "Add Account" to allocate an amount to account(s).
                      </TableCell>
                    </TableRow>
                  ) : (
                    allocations.map((alloc, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select value={alloc.accountId} onValueChange={(val: string) => updateAllocation(index, 'accountId', val)}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                              {allAccounts.map((acc: Account) => (
                                <SelectItem key={acc.id} value={acc.id!}>{acc.account_name} ({acc.account_no})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={alloc.amount}
                            onChange={(e) => updateAllocation(index, 'amount', parseFloat(e.target.value))}
                            className="h-8 text-right"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeAllocation(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                  {allocations.length > 0 && (
                    <TableRow className="font-bold">
                      <TableCell className="text-right">Total Allocated:</TableCell>
                      <TableCell className="text-right">₱{totalAllocated.toFixed(2)}</TableCell>
                      <TableCell />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="text-sm text-right mt-2">
              Remaining: <span className={Math.abs(parseFloat(amount) - totalAllocated) > 0.01 ? "text-red-500" : "text-green-500"}>
                ₱{(parseFloat(amount) - totalAllocated).toFixed(2)}
              </span>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline">Use Template...</Button>
          <div className="flex-grow" />
          <Button onClick={handleRecord} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Record
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
