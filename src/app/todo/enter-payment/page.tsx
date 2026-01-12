
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, UserPlus, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import format from '@/lib/date-format';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EnterPaymentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 7));
  const { openDialogs, closeDialog } = useDialog();

  return (
    <Dialog open={openDialogs['enter-payment']} onOpenChange={() => closeDialog('enter-payment')}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Payments and Purchases</DialogTitle>
          <CardDescription>
            For a payment or purchase transaction enter the details of the
            transaction and then allocate the amount to one or more accounts.
          </CardDescription>
        </DialogHeader>
        <ScrollArea className='flex-1 pr-6 -mr-6'>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="date">Transaction date:</Label>
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
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
                <Label>Pay to:</Label>
                <div className="col-span-2 flex gap-2">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a payee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payee1">Payee 1</SelectItem>
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
                <div className="col-span-2">
                  <Select>
                    <SelectTrigger id="account-paid-from">
                      <SelectValue placeholder="Checking Account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="account-balance">Account Balance:</Label>
                <Input
                  id="account-balance"
                  value="₱0.00"
                  disabled
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 items-start gap-4">
                <Label htmlFor="journal-memo">Journal memo:</Label>
                <Textarea
                  id="journal-memo"
                  placeholder="Payment"
                  className="col-span-2"
                />
              </div>

            </div>

            <div className="space-y-4">

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="method">Method:</Label>
                <div className="col-span-2">
                  <Select>
                    <SelectTrigger id="method">
                      <SelectValue placeholder="Cash" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="amount">Amount:</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="₱0.00"
                  className="col-span-2"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="reference-number">Reference number:</Label>
                <Input id="reference-number" className="col-span-2" />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="transaction-reference">
                  Transaction reference:
                </Label>
                <div className="col-span-2 flex items-center gap-2">
                  <Input id="transaction-reference" defaultValue="PMT [AUTO]" />
                  <Label htmlFor="check-no" className="whitespace-nowrap">Check no.:</Label>
                  <Input id="check-no" defaultValue="1" className="w-20" />
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-2 text-white">Account Allocation</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead className="w-[150px] text-right">Amount</TableHead>
                    <TableHead className="w-[100px] text-right">CR/DR</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      Click here to allocate an amount to account(s).
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="border-t pt-4">
          <Button variant="outline">Use Template...</Button>
          <div className="flex gap-2 ml-auto">
            <Button>Record</Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="secondary">Help</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
