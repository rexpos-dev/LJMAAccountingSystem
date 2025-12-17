
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
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardDescription } from '@/components/ui/card';

export default function ReconcileAccountPage() {
  const { openDialogs, closeDialog, openDialog } = useDialog();
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 13));
  const [newStatementBalance, setNewStatementBalance] = useState("₱0.00");


  return (
    <Dialog
      open={openDialogs['reconcile-account']}
      onOpenChange={() => closeDialog('reconcile-account')}
    >
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Reconcile Account</DialogTitle>
           <CardDescription>
            Bank Accounts can be reconciled with Journal entries. Journal entries not yet reconciled will be displayed allowing you to tick off those that can be reconciled.
          </CardDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-6">
            <div className="border p-4 rounded-md space-y-4">
                <h3 className='font-semibold text-white'>Local Ledger Transactions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="account">Account:</Label>
                            <Select>
                                <SelectTrigger id="account" className="col-span-2">
                                <SelectValue placeholder="Checking Account" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="checking">Checking Account</SelectItem>
                                <SelectItem value="savings">Savings Account</SelectItem>
                                <SelectItem value="undeposited">Undeposited Funds</SelectItem>
                                <SelectItem value="petty-cash">Petty Cash</SelectItem>
                                <SelectItem value="credit-card">Credit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="last-reconciled">Last Reconciled Date:</Label>
                            <Input id="last-reconciled" disabled className="col-span-2" />
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
                            <Input id="new-statement-balance" value={newStatementBalance} onChange={(e) => setNewStatementBalance(e.target.value)} className="col-span-2 text-right"/>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="calculated-statement-balance">Calculated Statement Balance:</Label>
                            <Input id="calculated-statement-balance" defaultValue="₱0.00" disabled className="col-span-2 text-right"/>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="out-of-balance">Out of Balance:</Label>
                            <Input id="out-of-balance" defaultValue="₱0.00" disabled className="col-span-2 text-right"/>
                        </div>
                    </div>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Transaction</TableHead>
                                <TableHead>Journal Memo</TableHead>
                                <TableHead>Deposits</TableHead>
                                <TableHead>Payments</TableHead>
                                <TableHead>Bank's Memo</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                                    All account entries have been reconciled
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                 <div className="flex gap-4">
                    <Button variant="outline" className="w-full" onClick={() => openDialog('enter-payment')}>Add a new payment transaction</Button>
                    <Button variant="outline" className="w-full" onClick={() => openDialog('receipts-deposits')}>Add a new receipt transaction</Button>
                </div>
            </div>

             <div className="border p-4 rounded-md space-y-4">
                <h3 className='font-semibold text-white'>Bank Statement's Transactions</h3>
                <div className="flex justify-between text-sm">
                    <span>Number of Transactions: None</span>
                    <span>Number of Matched Transactions: None</span>
                </div>
                 <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Journal Memo</TableHead>
                                <TableHead>Deposits</TableHead>
                                <TableHead>Payments</TableHead>
                                <TableHead>Ledger's Ref</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                           {/* Add rows here */}
                        </TableBody>
                    </Table>
                </div>
                 <div className="flex gap-4">
                    <Button variant="outline" className="w-full">Load a bank statement</Button>
                    <Button variant="outline" className="w-full">Add Transaction</Button>
                </div>
            </div>

          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary">Rollback to Previous</Button>
          <div className="flex-grow" />
          <Button>Reconcile</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
