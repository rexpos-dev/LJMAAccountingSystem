
'use client';

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '../ui/scroll-area';

import { useToast } from '@/hooks/use-toast';
import { useAccounts } from '@/hooks/use-accounts';

const standardAccounts = [
  {
    number: 1542,
    name: 'Checking Account #1',
    type: 'Asset',
    header: 'No',
    bank: 'Yes',
    cr: '',
    dr: '',
  },
  {
    number: 1542,
    name: 'Cheque Account #1',
    type: 'Asset',
    header: 'No',
    bank: 'Yes',
    cr: '',
    dr: '',
  },
  {
    number: 3998,
    name: 'Issued Capital #1',
    type: 'Equity',
    header: 'No',
    bank: 'No',
    cr: '',
    dr: '',
  },
  {
    number: 4911,
    name: 'General Sales #1',
    type: 'Income',
    header: 'No',
    bank: 'No',
    cr: '',
    dr: '',
  },
  {
    number: 6921,
    name: 'General Products Purchased #1',
    type: 'Expense',
    header: 'No',
    bank: 'No',
    cr: '',
    dr: '',
  },
];

type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export default function NewAccountDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { refetch } = useAccounts();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [type, setType] = useState<AccountType>('Asset');
  const [subType, setSubType] = useState('');
  const [isHeader, setIsHeader] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<'cr' | 'dr' | null>(null);
  const [accounts, setAccounts] = useState(standardAccounts);

  const handleAddAccount = async () => {
    if (!name || !number || !type) {
        toast({
            variant: "destructive",
            title: "Missing required fields",
            description: "Please fill in all required fields to create a new account.",
        });
        return;
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          number: parseInt(number, 10),
          type,
          header: isHeader ? 'Yes' : 'No',
          bank: isBank ? 'Yes' : 'No',
          category: type, // Using main type as category for simplicity
          balance: 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create account');
      }

      const newAccount = await response.json();

      // Reset form
      setName('');
      setNumber('');
      setType('Asset');
      setSubType('');
      setIsHeader(false);
      setIsBank(false);

      toast({
        title: "Account Added",
        description: `Account "${newAccount.name}" has been successfully created.`,
      });

      // Refresh accounts list
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
    }
  };

  const isFormValid = name.trim() !== '' && number.trim() !== '';

  const handleRowDoubleClick = (index: number) => {
    setEditingRow(index);
    setEditingField('cr'); // Start with CR field
  };

  const handleCrChange = (index: number, value: string) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].cr = value;
    // Auto-set DR to the same value as CR
    updatedAccounts[index].dr = value;
    setAccounts(updatedAccounts);
    // Move to DR field after CR is set
    setEditingField('dr');
  };

  const handleDrChange = (index: number, value: string) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index].dr = value;
    // Auto-set CR to the same value as DR
    updatedAccounts[index].cr = value;
    setAccounts(updatedAccounts);
  };

  const handleInputBlur = () => {
    setEditingRow(null);
    setEditingField(null);
  };

  return (
    <Dialog open={openDialogs['new-account']} onOpenChange={() => closeDialog('new-account')}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Account Dialog</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Use Standard Default Accounts</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Header</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>CR</TableHead>
                      <TableHead>DR</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accounts.map((account, index) => (
                      <TableRow key={account.name} onDoubleClick={() => handleRowDoubleClick(index)}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{account.number}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{account.type}</TableCell>
                        <TableCell>{account.header}</TableCell>
                        <TableCell>{account.bank}</TableCell>
                        <TableCell>
                          {editingRow === index && editingField === 'cr' ? (
                            <Input
                              defaultValue={account.cr}
                              onChange={(e) => handleCrChange(index, e.target.value)}
                              onBlur={handleInputBlur}
                              autoFocus
                              className="w-20"
                            />
                          ) : (
                            account.cr
                          )}
                        </TableCell>
                        <TableCell>
                          {editingRow === index && editingField === 'dr' ? (
                            <Input
                              defaultValue={account.dr}
                              onChange={(e) => handleDrChange(index, e.target.value)}
                              onBlur={handleInputBlur}
                              className="w-20"
                            />
                          ) : (
                            account.dr
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button disabled className="mt-4">
                Add Account(s)
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-white mb-4">Create New Account</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-name" className="text-right">
                    Account Name:
                  </Label>
                  <Input id="account-name" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">Type</Label>
                  <div className="col-span-3">
                    <RadioGroup
                      value={type}
                      onValueChange={(value) => setType(value as AccountType)}
                      className="space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Asset" id="asset" />
                        <Label htmlFor="asset" className="font-normal flex-1">
                          Asset
                        </Label>
                        <Select disabled={type !== 'Asset'} onValueChange={setSubType} value={subType}>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Select Type ---" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bank">Bank Account</SelectItem>
                            <SelectItem value="other-asset">Other Asset</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Liability" id="liability" />
                        <Label htmlFor="liability" className="font-normal flex-1">
                          Liability
                        </Label>
                        <Select disabled={type !== 'Liability'} onValueChange={setSubType} value={subType}>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Select Type ---" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="credit-card">Credit Card</SelectItem>
                            <SelectItem value="loan">Loan Account</SelectItem>
                            <SelectItem value="other-liability">Other Liability</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Equity" id="equity" />
                        <Label htmlFor="equity" className="font-normal flex-1">
                          Equity
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Income" id="income" />
                        <Label htmlFor="income" className="font-normal flex-1">
                          Income
                        </Label>
                        <Select disabled={type !== 'Income'} onValueChange={setSubType} value={subType}>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Select Type ---" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operating-income">Operating Income (Sales)</SelectItem>
                            <SelectItem value="non-operating-income">Non-Operating Income</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Expense" id="expenses" />
                        <Label htmlFor="expenses" className="font-normal flex-1">
                          Expenses
                        </Label>
                        <Select disabled={type !== 'Expense'} onValueChange={setSubType} value={subType}>
                          <SelectTrigger>
                            <SelectValue placeholder="--- Select Type ---" />
                          </SelectTrigger>
                           <SelectContent>
                            <SelectItem value="cost-of-sales">Cost of Sales</SelectItem>
                            <SelectItem value="operating-expenses">Operating Expenses</SelectItem>
                            <SelectItem value="non-operating-expense">Non-Operating Expense</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cash-flow" className="text-right">
                    Classification for Cash Flow:
                  </Label>
                  <Select disabled={type !== 'Equity'}>
                    <SelectTrigger id="cash-flow" className="col-span-3">
                      <SelectValue placeholder="--- Select Classification ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operating">Operating</SelectItem>
                      <SelectItem value="investing">Investing</SelectItem>
                       <SelectItem value="financing">Financing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account-number" className="text-right">
                    Account Number:
                  </Label>
                  <Input id="account-number" className="col-span-3" value={number} onChange={(e) => setNumber(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linked-account" className="text-right">
                    Default Linked Account for:
                  </Label>
                   <Select>
                    <SelectTrigger id="linked-account" className="col-span-3">
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">--- None ---</SelectItem>
                      <SelectItem value="deposit-account">DEPOSIT ACCOUNT</SelectItem>
                      <SelectItem value="accounts-receivable">ACCOUNTS RECEIVABLE</SelectItem>
                      <SelectItem value="sales-tax-paid">SALES TAX PAID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="opening-balance" className="text-right">
                    Opening Balance:
                  </Label>
                  <Input id="opening-balance" defaultValue="₱0.00" className="col-span-3" readOnly />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                    <div/>
                    <div className="col-span-3 space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox id="header-account" checked={isHeader} onCheckedChange={(checked) => setIsHeader(checked as boolean)} />
                                <Label htmlFor="header-account" className="font-normal">Account is just a Header Account</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <Checkbox id="cash-postable" checked={isBank} onCheckedChange={(checked) => setIsBank(checked as boolean)} />
                                <Label htmlFor="cash-postable" className="font-normal">Cash Postable</Label>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="tax-included" />
                            <Label htmlFor="tax-included" className="font-normal">Tax Included</Label>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="secondary">Help</Button>
          <div className="flex-grow" />
          <Button onClick={handleAddAccount} disabled={!isFormValid}>Add</Button>
          <DialogClose asChild>
            <Button>Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
