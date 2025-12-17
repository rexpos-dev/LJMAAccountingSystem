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

export function EnterPaymentsOfAccountsPayableDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 10));
  const [supplier, setSupplier] = useState<string>('');
  const [accountPaidFrom, setAccountPaidFrom] = useState<string>('');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [checkNumber, setCheckNumber] = useState<string>('1');
  const [method, setMethod] = useState<string>('Cash');
  const [amount, setAmount] = useState<string>('0.00');
  const [journalMemo, setJournalMemo] = useState<string>('');

  return (
    <Dialog open={openDialogs['enter-payments-of-accounts-payable']} onOpenChange={() => closeDialog('enter-payments-of-accounts-payable')}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter Payments of Accounts Payable</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 border rounded-md">
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="date">Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        id="date"
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
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="supplier">Supplier:</Label>
                  <div className="col-span-2 flex gap-2">
                    <Select value={supplier} onValueChange={setSupplier}>
                      <SelectTrigger id="supplier">
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAccounts.filter(account => account.type === 'Liability').map(account => (
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
                  <Label htmlFor="reference-number">Reference number:</Label>
                  <Input id="reference-number" className="col-span-1" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                  <Label htmlFor="check-no" className="text-right">Check no.:</Label>
                  <Input id="check-no" className="col-span-1" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)} />
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
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="journal-memo">Journal memo:</Label>
                  <Textarea id="journal-memo" className="col-span-2" rows={4} value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Bills</h3>
              <div className="flex justify-end text-sm text-muted-foreground">
                Unapplied amount remaining: ₱{amount}
              </div>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Bill #</TableHead>
                      <TableHead className="w-[120px]">Date</TableHead>
                      <TableHead className="w-[120px]">Date Due</TableHead>
                      <TableHead className="w-[120px] text-right">Total</TableHead>
                      <TableHead className="w-[120px] text-right">Due</TableHead>
                      <TableHead className="w-[120px] text-right">Applied</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No outstanding bills for this supplier.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
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
