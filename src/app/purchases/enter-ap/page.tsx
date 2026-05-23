
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
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
import { useBranches } from '@/hooks/use-branches';
import { calculateProration, AllocationStrategy } from '@/lib/proration';
import { isProfitCenterEligible, PROFIT_CENTER_ELIGIBLE_TYPES } from '@/lib/profit-center-rules';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AllocationRow {
  id: string;
  account_no: string;
  account_name: string;
  amount: string;
  type: 'CR' | 'DR';
  branch_id?: string;
  profit_center_id?: string | null;
}

export default function EnterApPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { data: accounts } = useAccounts();
  const { data: branches } = useBranches();
  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date(2025, 9, 13));
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(2025, 10, 12));
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [selectedApAccount, setSelectedApAccount] = useState<string>('');
  const [accountBalance, setAccountBalance] = useState<string>('₱0.00');
  const [amount, setAmount] = useState<string>('0.00');
  const [refNumber, setRefNumber] = useState<string>('');
  const [memo, setMemo] = useState<string>('Purchases');
  const [accountNameFilter, setAccountNameFilter] = useState<string>('');
  const [allocationStrategy, setAllocationStrategy] = useState<AllocationStrategy>('none');
  const [selectedCOA, setSelectedCOA] = useState<{ account_no: string, account_name: string, account_type: string } | null>(null);

  const handleRowDoubleClick = () => {
    if (allocations.length === 0) {
      const newAllocations: AllocationRow[] = [
        {
          id: 'debit-1',
          account_no: '',
          account_name: '',
          amount: '',
          type: 'DR',
        },
        {
          id: 'credit-1',
          account_no: '',
          account_name: '',
          amount: '',
          type: 'CR',
        },
      ];
      setAllocations(newAllocations);
    }
  };

  const handleAccountChange = (id: string, accountNumber: string) => {
    const account = accounts.find(acc => acc.account_no?.toString() === accountNumber);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account_no: accountNumber, account_name: account?.account_name || '' }
          : allocation
      )
    );
  };

  const handleNameChange = (id: string, accountName: string) => {
    const account = accounts.find(acc => acc.account_name === accountName);
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account_no: account?.account_no?.toString() ?? '', account_name: accountName }
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

  const handleApplyAllocation = (strategy: AllocationStrategy) => {
    setAllocationStrategy(strategy);
    if (!selectedCOA || !amount || strategy === 'none') return;

    const totalAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    if (isNaN(totalAmount)) return;

    const activeBranches = branches.filter(b => b.isActive);
    const prorationRes = calculateProration(totalAmount, strategy, activeBranches as any);

    const eligible = isProfitCenterEligible(selectedCOA.account_type);
    const newAllocations: AllocationRow[] = prorationRes.map((res, index) => ({
      id: `alloc-${index}-${Date.now()}`,
      account_no: selectedCOA.account_no,
      account_name: selectedCOA.account_name,
      amount: res.amount.toString(),
      type: 'DR',
      branch_id: res.branchId,
      profit_center_id: eligible ? res.profit_center_id : undefined,
    }));

    // Add back the credit line for AP if it's a balanced entry
    // But usually in this UI, multiple DR lines map to one total AP.
    setAllocations(newAllocations);
  };

  const handleRecord = async () => {
    try {
      if (!selectedApAccount || !amount || allocations.length === 0) {
        toast.error('Please complete the AP details and allocations.');
        return;
      }

      const totalAmount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
      const transNo = refNumber || `AP-${Date.now()}`;

      // 1. Prepare Credit Line (Accounts Payable)
      const apAccount = accounts.find(a => a.account_no?.toString() === selectedApAccount);
      const creditLine = {
        date: date || new Date(),
        code: 'AP',
        transNo,
        accountNumber: selectedApAccount,
        accountName: apAccount?.account_name || '',
        particulars: memo,
        debit: 0,
        credit: totalAmount,
        user: 'System', // Replace with actual user
      };

      // 2. Prepare Debit Lines (Allocations)
      // Only eligible account types get profit_center_id tagged
      const debitLines = allocations.map(a => {
        const matchedAccount = accounts.find(acc => acc.account_no?.toString() === a.account_no);
        const eligible = isProfitCenterEligible(matchedAccount?.account_type);
        return {
          date: date || new Date(),
          code: 'AP',
          transNo,
          accountNumber: a.account_no,
          accountName: a.account_name,
          particulars: memo,
          debit: parseFloat(a.amount) || 0,
          credit: 0,
          branchId: a.branch_id,
          profit_center_id: eligible ? a.profit_center_id : undefined,
          user: 'System',
        };
      });

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions: [creditLine, ...debitLines] }),
      });

      if (!response.ok) throw new Error('Failed to record transaction');

      toast.success('Accounts Payable recorded successfully!');
      closeDialog('enter-ap');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Error recording transaction.');
    }
  };

  const handleApAccountChange = (accountNumber: string) => {
    setSelectedApAccount(accountNumber);
    const account = accounts.find(acc => acc.account_no?.toString() === accountNumber);
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
                      <Button variant={'outline'} id="date" className={cn( 'w-full justify-start text-left font-normal col-span-2', !date && 'text-muted-foreground' )} >
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
                      <Button variant={'outline'} id="due-date" className={cn( 'w-full justify-start text-left font-normal col-span-2', !dueDate && 'text-muted-foreground' )} >
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
                        {accounts.filter(account => account.account_type === 'Liability' && account.account_no).map(account => (
                          <SelectItem key={account.id ?? account.account_no} value={account.account_no!.toString()}>
                            {account.account_name}
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
                      {accounts.filter(account => account.account_no).map(account => (
                        <SelectItem key={account.id ?? account.account_no} value={account.account_no!.toString()}>
                          {account.account_name}
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
                  <Input id="ref-number" value={refNumber} onChange={(e) => setRefNumber(e.target.value)} className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="memo">Memo:</Label>
                  <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} className="col-span-2" rows={3} />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-black/20 space-y-4">
              <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider">Expense Source & Proration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Account (COA)</Label>
                  <Select onValueChange={(val) => {
                    const acc = accounts.find(a => a.account_no?.toString() === val);
                    if (acc) setSelectedCOA({ account_no: val, account_name: acc.account_name, account_type: acc.account_type });
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.filter(a => PROFIT_CENTER_ELIGIBLE_TYPES.has(a.account_type) && a.account_no).map(a => (
                        <SelectItem key={a.id} value={a.account_no!.toString()}>
                          {a.account_no} - {a.account_name}
                          <span className="ml-2 text-xs text-muted-foreground">({a.account_type})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Allocation Strategy</Label>
                  <RadioGroup
                    value={allocationStrategy}
                    onValueChange={(val) => handleApplyAllocation(val as AllocationStrategy)}
                    className="flex flex-row gap-4 pt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none" className="cursor-pointer">No allocation</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal" id="equal" />
                      <Label htmlFor="equal" className="cursor-pointer">Equal split</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weighted" id="weighted" />
                      <Label htmlFor="weighted" className="cursor-pointer">Weighted split</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-foreground">Account Allocation</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Profit Center</TableHead>
                      <TableHead className="w-[150px] text-right">Amount</TableHead>
                      <TableHead className="w-[80px] text-right">CR/DR</TableHead>
                    </TableRow>

                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow onDoubleClick={handleRowDoubleClick} className="cursor-pointer">
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          Double-click here to allocate an amount to account(s).
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map(allocation => (
                        <TableRow key={allocation.id}>
                          <TableCell>
                            <Select value={allocation.account_no || undefined} onValueChange={(value) => handleAccountChange(allocation.id, value)}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts
                                  .filter(account =>
                                    account.account_name.toLowerCase().includes(accountNameFilter.toLowerCase()) && account.account_no
                                  )
                                  .map(account => (
                                    <SelectItem key={account.id ?? account.account_no} value={account.account_no!.toString()}>
                                      {account.account_no}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={allocation.account_name}
                              onValueChange={(value) => handleNameChange(allocation.id, value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select account name" />
                              </SelectTrigger>
                              <SelectContent>
                                {accounts
                                  .filter(account =>
                                    account.account_name.toLowerCase().includes(accountNameFilter.toLowerCase())
                                  )
                                  .map(account => (
                                    <SelectItem key={account.id ?? account.account_no ?? account.account_name} value={account.account_name}>
                                      {account.account_name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground/50">
                              {branches.find(b => b.id === allocation.branch_id)?.name || '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground/50">
                              {(() => {
                                const matchedAcc = accounts.find(acc => acc.account_no?.toString() === allocation.account_no);
                                return isProfitCenterEligible(matchedAcc?.account_type)
                                  ? (allocation.profit_center_id || '-')
                                  : <span className="text-foreground/20 italic">N/A</span>;
                              })()}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input type="number" value={allocation.amount} onChange={(e) => handleAmountChange(allocation.id, e.target.value)}
                              className="w-full text-right"
                              placeholder="0.00"
                            />
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <span>{allocation.type}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteAllocation(allocation.id)}
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
