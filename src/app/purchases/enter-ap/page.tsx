
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
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('@/components/ui/calendar').then(m => m.Calendar), { ssr: false });
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccounts } from '@/hooks/use-accounts';

interface AllocationRow {
  id: string;
  number: string;
  name: string;
  amount: string;
  type: 'CR' | 'DR';
}

export default function EnterApPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { data: accounts } = useAccounts();
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 13));
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(2025, 10, 12));
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedApAccount, setSelectedApAccount] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('₱0.00');
  const [amount, setAmount] = useState<string>('₱0.00');
  const [accountNameFilter, setAccountNameFilter] = useState<string>('');

  const handleRowDoubleClick = () => {
    if (allocations.length === 0) {
      const newAllocations: AllocationRow[] = [
        {
          id: 'debit-1',
          number: '',
          name: '',
          amount: '',
          type: 'DR',
        },
        {
          id: 'credit-1',
          number: '',
          name: '',
          amount: '',
          type: 'CR',
        },
      ];
      setAllocations(newAllocations);
    }
  };

  const handleAccountChange = (id: string, accountNumber: string) => {
    const account = accounts.find(acc => acc.number?.toString() === accountNumber);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, number: accountNumber, name: account?.name || '' }
          : allocation
      )
    );
  };

  const handleNameChange = (id: string, accountName: string) => {
    const account = accounts.find(acc => acc.name === accountName);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, number: account?.number?.toString() ?? '', name: accountName }
          : allocation
      )
    );
  };

  const handleAmountChange = (id: string, amount: string) => {
    setAllocations(prev =>
      prev.map(allocation => {
        if (allocation.id === id) {
          return { ...allocation, amount };
        }
        return allocation;
      })
    );
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(allocation => allocation.id !== id));
  };

  const handleApAccountChange = (accountNumber: string) => {
    setSelectedApAccount(accountNumber);
    const account = accounts.find(acc => acc.number?.toString() === accountNumber);
    if (account && account.balance !== undefined) {
      setAccountBalance(`₱${account.balance.toFixed(2)}`);
    } else {
      setAccountBalance('₱0.00');
    }
  };

  return (
    <Dialog open={openDialogs['enter-ap']} onOpenChange={() => closeDialog('enter-ap')}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Accounts Payable</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
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
                  <Label htmlFor="due-date">Due Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        id="due-date"
                        className={cn(
                          'w-full justify-start text-left font-normal col-span-2',
                          !dueDate && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, 'MM/dd/yyyy') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label>Supplier:</Label>
                  <div className="col-span-2 flex gap-2">
                    <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.filter(account => account.type === 'Liability').map(account => (
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
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="supplier-address">Supplier address:</Label>
                  <Textarea id="supplier-address" className="col-span-2" rows={3} />
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="ap-account">Accounts Payable:</Label>
                  <Select value={selectedApAccount} onValueChange={handleApAccountChange}>
                    <SelectTrigger id="ap-account" className='col-span-2'>
                      <SelectValue placeholder="Select Accounts Payable account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.number} value={account.number?.toString() ?? ''}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="account-balance">Account Balance:</Label>
                  <Input id="account-balance" value={accountBalance} disabled className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="amount">Amount:</Label>
                  <Input id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="ref-number">Reference number:</Label>
                  <Input id="ref-number" className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="memo">Memo:</Label>
                  <Textarea id="memo" placeholder="Purchases" className="col-span-2" rows={3} />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">Account Allocation</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[150px] text-right">Amount</TableHead>
                      <TableHead className="w-[120px] text-right">CR/DR</TableHead>
                    </TableRow>

                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow onDoubleClick={handleRowDoubleClick} className="cursor-pointer">
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          Double-click here to allocate an amount to account(s).
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map(allocation => (
                        <TableRow key={allocation.id}>
                          <TableCell>
                            <Select value={allocation.number || undefined} onValueChange={(value) => handleAccountChange(allocation.id, value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts
                                  .filter(account =>
                                    account.name.toLowerCase().includes(accountNameFilter.toLowerCase())
                                  )
                                  .map(account => (
                                    <SelectItem key={account.number} value={account.number?.toString() ?? ''}>
                                      {account.number}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={allocation.name}
                              onValueChange={(value) => handleNameChange(allocation.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account name" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts
                                  .filter(account =>
                                    account.name.toLowerCase().includes(accountNameFilter.toLowerCase())
                                  )
                                  .map(account => (
                                    <SelectItem key={account.name} value={account.name}>
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
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <span>{allocation.type}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAllocation(allocation.id)}
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
