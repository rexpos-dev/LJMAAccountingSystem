
'use client';

import { useState, useEffect } from 'react';
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



type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export default function NewAccountDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { refetch } = useAccounts();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [accntTypeNo, setAccntTypeNo] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [type, setType] = useState<AccountType>('Asset');
  const [subType, setSubType] = useState('');
  const [isHeader, setIsHeader] = useState(false);
  const [isBank, setIsBank] = useState(false);
  const [linkedAccount, setLinkedAccount] = useState('');

  // Effect to handle Income type specific settings
  useEffect(() => {
    if (type === 'Income') {
      setIsHeader(false); // Disable header account
      setIsBank(true); // Select cash postable by default
    } else {
      // Reset for other types
      setIsHeader(false);
      setIsBank(false);
    }
  }, [type]);

  // Generate unique account number and type number based on type
  const generateAccountNumber = async (accountType: AccountType) => {
    try {
      const response = await fetch('/api/accounts');
      const accounts = await response.json();

      const typeRanges = {
        Asset: [1000, 1999],
        Liability: [2000, 2999],
        Equity: [3000, 3999],
        Income: [4000, 4999],
        Expense: [5000, 5999],
      };

      const [min, max] = typeRanges[accountType];
      const accountsOfType = accounts.filter((acc: any) => acc.type === accountType);
      const existingNumbers = accountsOfType
        .map((acc: any) => acc.accnt_no)
        .sort((a: number, b: number) => a - b);

      // Find the next available number in the range
      for (let num = min; num <= max; num++) {
        if (!existingNumbers.includes(num)) {
          return { accnt_no: num, accnt_type_no: accountsOfType.length + 1 };
        }
      }

      // If all numbers in range are taken, use the next available
      const nextNum = Math.max(...existingNumbers, max) + 1;
      return { accnt_no: nextNum, accnt_type_no: accountsOfType.length + 1 };
    } catch (error) {
      // Fallback to basic numbering
      const baseNumbers = { Asset: 1000, Liability: 2000, Equity: 3000, Income: 4000, Expense: 5000 };
      return { accnt_no: baseNumbers[accountType], accnt_type_no: 1 };
    }
  };

  // Update account number when type changes
  const handleTypeChange = async (newType: AccountType) => {
    setType(newType);
    const { accnt_no, accnt_type_no } = await generateAccountNumber(newType);
    setNumber(accnt_no.toString());
    setAccntTypeNo(accnt_type_no.toString());
  };


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
          accnt_no: parseInt(number, 10),
          accnt_type_no: parseInt(accntTypeNo, 10),
          type,
          header: isHeader ? 'Yes' : 'No',
          bank: isBank ? 'Yes' : 'No',
          category: type, // Using main type as category for simplicity
          balance: parseFloat(openingBalance) || 0,
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
      setAccntTypeNo('');
      setOpeningBalance('0.00');
      setType('Asset');
      setSubType('');
      setIsHeader(false);
      setIsBank(false);
      setLinkedAccount('');

      toast({
        title: "Account Added",
        description: `Account "${newAccount.name}" has been successfully created.`,
      });

      // Refresh accounts list
      window.dispatchEvent(new CustomEvent('accounts-refresh'));
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create account",
      });
    }
  };

  const isFormValid = name.trim() !== '' && number.trim() !== '';

  return (
    <Dialog open={openDialogs['new-account']} onOpenChange={() => closeDialog('new-account')}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Account Dialog</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
          <div className="space-y-6">
            <div>
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
                      onValueChange={handleTypeChange}
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
                  <Input id="account-number" className="col-span-3" value={number} readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linked-account" className="text-right">
                    Default Linked Account for:
                  </Label>
                  <Select value={linkedAccount} onValueChange={setLinkedAccount}>
                    <SelectTrigger id="linked-account" className="col-span-3">
                      <SelectValue placeholder="--- None ---" />
                    </SelectTrigger>
                    <SelectContent>
                      {type === 'Income' ? (
                        <>
                          <SelectItem value="income-account">Income Account</SelectItem>
                          <SelectItem value="freight-collected">Freight Collected</SelectItem>
                        </>
                      ) : type === 'Expense' ? (
                        <>
                          <SelectItem value="sales-tax-paid">Sales Tax Paid</SelectItem>
                          <SelectItem value="freight-paid">Freight Paid</SelectItem>
                          <SelectItem value="expense-account">Expense Account</SelectItem>
                        </>
                      ) : type === 'Liability' ? (
                        <>
                          <SelectItem value="sales-tax-collected">Sales Tax Collected</SelectItem>
                          <SelectItem value="sales-tax-paid">Sales Tax Paid</SelectItem>
                          <SelectItem value="accounts-payable">Accounts Payables</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="none">--- None ---</SelectItem>
                          <SelectItem value="deposit-account">DEPOSIT ACCOUNT</SelectItem>
                          <SelectItem value="accounts-receivable">ACCOUNTS RECEIVABLE</SelectItem>
                          <SelectItem value="sales-tax-paid">SALES TAX PAID</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="opening-balance" className="text-right">
                    Opening Balance:
                  </Label>
                  <Input id="opening-balance" value={openingBalance} onChange={(e) => setOpeningBalance(e.target.value)} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <div />
                  <div className="col-span-3 space-y-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="header-account" checked={isHeader} onCheckedChange={(checked) => setIsHeader(checked as boolean)} disabled={type === 'Income'} />
                        <Label htmlFor="header-account" className="font-normal">Account is just a Header Account</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cash-postable" checked={isBank} onCheckedChange={(checked) => setIsBank(checked as boolean)} />
                        <Label htmlFor="cash-postable" className="font-normal">Cash Postable</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tax-included" disabled={type === 'Liability'} />
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
