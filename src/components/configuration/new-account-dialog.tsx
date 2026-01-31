
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



type AccountType = 'Cash' | 'Cash On Hand' | 'Fund Transfer' | 'Store Equipments' | 'Office Equipment' | 'Income' | 'Expense';

export default function NewAccountDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { refetch } = useAccounts();

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [accntTypeNo, setAccntTypeNo] = useState('');
  const [description, setDescription] = useState('');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [accountCategory, setAccountCategory] = useState('');
  const [fsCategory, setFsCategory] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [type, setType] = useState<AccountType>('Cash');

  const baseTypeMapping: Record<AccountType, string> = {
    'Cash': 'Asset',
    'Cash On Hand': 'Asset',
    'Fund Transfer': 'Asset',
    'Store Equipments': 'Asset',
    'Office Equipment': 'Asset',
    'Income': 'Income',
    'Expense': 'Expense'
  };

  // Generate unique account number and type number based on type
  const generateAccountNumber = async (accountType: AccountType) => {
    try {
      const baseType = baseTypeMapping[accountType];
      const response = await fetch('/api/accounts');
      const accounts = await response.json();

      const typeRanges: Record<string, [number, number]> = {
        Asset: [1000, 1999],
        Liability: [2000, 2999],
        Equity: [3000, 3999],
        Income: [4000, 4999],
        Expense: [5000, 5999],
      };

      const [min, max] = typeRanges[baseType];
      const accountsOfType = accounts.filter((acc: any) => acc.account_type === baseType);
      const existingNumbers = accountsOfType
        .map((acc: any) => acc.account_no)
        .sort((a: number, b: number) => a - b);

      // Find the next available number in the range
      for (let num = min; num <= max; num++) {
        if (!existingNumbers.includes(num)) {
          return { account_no: num, account_type_no: accountsOfType.length + 1 };
        }
      }

      // If all numbers in range are taken, use the next available
      const nextNum = Math.max(...existingNumbers, max) + 1;
      return { account_no: nextNum, account_type_no: accountsOfType.length + 1 };
    } catch (error) {
      // Fallback to basic numbering
      const baseType = baseTypeMapping[accountType];
      const baseNumbers: Record<string, number> = { Asset: 1000, Liability: 2000, Equity: 3000, Income: 4000, Expense: 5000 };
      return { account_no: baseNumbers[baseType] || 1000, account_type_no: 1 };
    }
  };

  // Update account number when type changes
  const handleTypeChange = async (newType: AccountType) => {
    setType(newType);
    const { account_no, account_type_no } = await generateAccountNumber(newType);
    setNumber(account_no.toString());
    setAccntTypeNo(account_type_no.toString());
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
          account_name: name,
          account_no: parseInt(number, 10),
          account_type_no: parseInt(accntTypeNo, 10),
          account_type: baseTypeMapping[type],
          header: 'No',
          bank: ['Cash', 'Cash On Hand', 'Fund Transfer'].includes(type) ? 'Yes' : 'No',
          account_category: type, // Use the specific label as category
          balance: parseFloat(openingBalance) || 0,
          account_description: description || null,
          account_status: accountStatus,
          fs_category: fsCategory || type,
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
      setDescription('');
      setAccountStatus('Active');
      setAccountCategory('');
      setFsCategory('');
      setOpeningBalance('0.00');
      setType('Cash');

      toast({
        title: "Account Added",
        description: `Account "${newAccount.account_name}" has been successfully created.`,
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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>New Account Dialog</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6 -mr-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Create New Account</h3>

              {/* Two-column grid layout */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {/* Left Column - Account No. */}
                <div className="space-y-2">
                  <Label htmlFor="account-number">
                    Account No.<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="account-number"
                    value={number}
                    readOnly
                    placeholder="Auto-generated"
                  />
                </div>

                {/* Right Column - Account Name */}
                <div className="space-y-2">
                  <Label htmlFor="account-name">
                    Account Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="account-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter account name"
                  />
                </div>

                {/* Left Column - Account Description */}
                <div className="space-y-2">
                  <Label htmlFor="account-description">
                    Account Description
                  </Label>
                  <Input
                    id="account-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description (optional)"
                  />
                </div>

                {/* Right Column - Date Created */}
                <div className="space-y-2">
                  <Label htmlFor="date-created">
                    Date Created
                  </Label>
                  <Input
                    id="date-created"
                    value={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    readOnly
                  />
                </div>

                {/* Left Column - Account Type */}

                <div className="space-y-2">
                  <Label htmlFor="account-type">
                    Account Type<span className="text-destructive">*</span>
                  </Label>
                  <Select value={type} onValueChange={(v) => handleTypeChange(v as AccountType)}>
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Cash On Hand">Cash On Hand</SelectItem>
                      <SelectItem value="Fund Transfer">Fund Transfer</SelectItem>
                      <SelectItem value="Store Equipments">Store Equipments</SelectItem>
                      <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>


                {/* Right Column - Account Category */}
                <div className="space-y-2">
                  <Label htmlFor="account-category">
                    Account Category
                  </Label>
                  <Select value={accountCategory} onValueChange={setAccountCategory}>
                    <SelectTrigger id="account-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                      <SelectItem value="Equity">Equity</SelectItem>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Cost of Sales">Cost of Sales</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Left Column - FS Category */}
                <div className="space-y-2">
                  <Label htmlFor="fs-category">
                    FS Category
                  </Label>
                  <Select value={fsCategory} onValueChange={setFsCategory}>
                    <SelectTrigger id="fs-category">
                      <SelectValue placeholder="Select FS category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BS">BS</SelectItem>
                      <SelectItem value="IS">IS</SelectItem>
                      <SelectItem value="CFS">CFS</SelectItem>
                      <SelectItem value="SCE">SCE</SelectItem>
                      <SelectItem value="NFS">NFS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Right Column - Opening Balance */}
                <div className="space-y-2">
                  <Label htmlFor="opening-balance">
                    Opening Balance
                  </Label>
                  <Input
                    id="opening-balance"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Account Status Section */}
              <div className="pt-4 border-t mt-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-status">
                      Account Status
                    </Label>
                    <Select value={accountStatus} onValueChange={setAccountStatus}>
                      <SelectTrigger id="account-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <div className="flex-grow" />
          <Button onClick={handleAddAccount} disabled={!isFormValid}>Add</Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
}
