"use client";

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
import { CalendarIcon, UserPlus, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAccounts } from '@/app/configuration/chart-of-accounts/mock-accounts';

interface AllocationRow {
  id: string;
  account: string;
  amount: string;
  type: 'CR' | 'DR';
}

export function EnterDirectPaymentsDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date(2025, 9, 7));
  const [payTo, setPayTo] = useState<string>('');
  const [accountPaidFrom, setAccountPaidFrom] = useState<string>('');
  const [journalMemo, setJournalMemo] = useState<string>('Payment');
  const [method, setMethod] = useState<string>('Cash');
  const [amount, setAmount] = useState<string>('0.00');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [checkNumber, setCheckNumber] = useState<string>('1');
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);

  const handleRowDoubleClick = () => {
    if (allocations.length === 0) {
      const newAllocations: AllocationRow[] = [
        {
          id: 'allocation-1',
          account: '',
          amount: '',
          type: 'DR', // Default to Debit
        },
      ];
      setAllocations(newAllocations);
    }
  };

  const handleAccountChange = (id: string, accountName: string) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account: accountName }
          : allocation
      )
    );
  };

  const handleAmountChange = (id: string, newAmount: string) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, amount: newAmount }
          : allocation
      )
    );
  };

  const handleTypeChange = (id: string, newType: 'CR' | 'DR') => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, type: newType }
          : allocation
      )
    );
  };

  return (
    <Dialog open={openDialogs['enter-direct-payments']} onOpenChange={() => closeDialog('enter-direct-payments')}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Payments and Purchases</DialogTitle>
          <div className="text-sm text-muted-foreground">
            For a payment or purchase transaction enter the details of the transaction and then allocate the amount to one or more accounts.
          </div>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 border rounded-md">
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="transaction-date">Transaction date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        id="transaction-date"
                        className={cn(
                          'w-full justify-start text-left font-normal col-span-2',
                          !transactionDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transactionDate ? format(transactionDate, 'MMMM do, yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={transactionDate}
                        onSelect={setTransactionDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="pay-to">Pay to:</Label>
                  <div className="col-span-2 flex gap-2">
                    <Select value={payTo} onValueChange={setPayTo}>
                      <SelectTrigger id="pay-to">
                        <SelectValue placeholder="Select a payee" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.map(account => (
                          <SelectItem key={account.number} value={account.number?.toString() ?? ''}>
                            {account.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="account-paid-from">Account paid from:</Label>
                  <Select value={accountPaidFrom} onValueChange={setAccountPaidFrom}>
                    <SelectTrigger id="account-paid-from" className='col-span-2'>
                      <SelectValue placeholder="Checking Account" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.filter(account => account.bank === 'Yes').map(account => (
                        <SelectItem key={account.number} value={account.number?.toString() ?? ''}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="account-balance">Account Balance:</Label>
                  <Input id="account-balance" value="₱0.00" disabled className="col-span-2"/>
                </div>
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="journal-memo">Journal memo:</Label>
                  <Textarea id="journal-memo" className="col-span-2" rows={3} value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="method">Method:</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger id="method" className='col-span-2'>
                      <SelectValue placeholder="Cash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="amount">Amount:</Label>
                  <Input id="amount" value={`₱${amount}`} onChange={(e) => setAmount(e.target.value.replace('₱', ''))} className="col-span-2"/>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="reference-number">Reference number:</Label>
                  <Input id="reference-number" className="col-span-2" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="transaction-reference">Transaction reference:</Label>
                  <Input id="transaction-reference" value="PMT [AUTO]" disabled className="col-span-1"/>
                  <Label htmlFor="check-no" className="text-right">Check no.:</Label>
                  <Input id="check-no" className="col-span-1" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Account Allocation</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="w-[150px] text-right">Amount</TableHead>
                      <TableHead className="w-[120px] text-right">CR/DR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow onDoubleClick={handleRowDoubleClick} className="cursor-pointer">
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                          Click here to allocate an amount to account(s).
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map(allocation => (
                        <TableRow key={allocation.id}>
                          <TableCell>
                            <Select value={allocation.account} onValueChange={(value) => handleAccountChange(allocation.id, value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockAccounts.map(account => (
                                  <SelectItem key={account.number} value={account.name}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={allocation.amount}
                              onChange={(e) => handleAmountChange(allocation.id, e.target.value)}
                              className="w-full text-right"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Select value={allocation.type} onValueChange={(value) => handleTypeChange(allocation.id, value as 'CR' | 'DR')}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CR">CR</SelectItem>
                                <SelectItem value="DR">DR</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline">Use Template...</Button>
          <div className="flex-grow" />
          <Button>Record</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
