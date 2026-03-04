
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
import { useAccountTypes } from '@/hooks/use-account-types';



type AccountType = 'Cash' | 'Cash On Hand' | 'Fund Transfer' | 'Store Equipments' | 'Office Equipment' | 'Income' | 'Expense';

export default function NewAccountDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { data: accounts, refetch: refetchAccounts } = useAccounts();
  const { accountTypes, refetch: refetchAccountTypes } = useAccountTypes();

  const uniqueAccountNames = Array.from(
    new Set((accounts || []).map((acc: any) => acc.account_name))
  ).filter(Boolean) as string[];

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [accntTypeNo, setAccntTypeNo] = useState('');
  const [description, setDescription] = useState('');
  const [accountStatus, setAccountStatus] = useState('Active');
  const [accountCategory, setAccountCategory] = useState('');
  const [fsCategory, setFsCategory] = useState('');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [type, setType] = useState<string>('');

  // State for Create New Account Type dialog
  const [isCreatingNewType, setIsCreatingNewType] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeBase, setNewTypeBase] = useState('Asset');

  // Set default type when accountTypes load
  useEffect(() => {
    if (accountTypes.length > 0 && !type) {
      setType(accountTypes[0].name);
      handleTypeChange(accountTypes[0].name, accountTypes[0].baseType);
    }
  }, [accountTypes]);

  // Generate unique account number and type number based on type
  const generateAccountNumber = async (accountTypeName: string, baseType: string) => {
    try {
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
      const baseNumbers: Record<string, number> = { Asset: 1000, Liability: 2000, Equity: 3000, Income: 4000, Expense: 5000 };
      return { account_no: baseNumbers[baseType] || 1000, account_type_no: 1 };
    }
  };

  // Update account number when type changes
  const handleTypeChange = async (newType: string, newBaseType?: string) => {
    if (newType === 'NEW_ACCOUNT_TYPE') {
      setIsCreatingNewType(true);
      return;
    }
    setType(newType);

    // Find the base type from the accounts list if not provided directly
    const baseType = newBaseType || accountTypes.find(t => t.name === newType)?.baseType || 'Asset';

    const { account_no, account_type_no } = await generateAccountNumber(newType, baseType);
    setNumber(account_no.toString());
    setAccntTypeNo(account_type_no.toString());
  };

  const handleCreateNewAccountType = async () => {
    if (!newTypeName) return;
    try {
      const res = await fetch('/api/account-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTypeName, baseType: newTypeBase }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create account type');
      }
      toast({ title: 'Success', description: 'Account Type created successfully.' });
      setIsCreatingNewType(false);
      setNewTypeName('');
      setNewTypeBase('Asset');
      await refetchAccountTypes();
      handleTypeChange(newTypeName, newTypeBase);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
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
      const selectedAccountType = accountTypes.find((t: any) => t.name === type);
      const baseType = selectedAccountType?.baseType || 'Asset';

      const response = await fetch('/api/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_name: name,
          account_no: parseInt(number, 10),
          account_type_no: parseInt(accntTypeNo, 10),
          account_type: baseType,
          account_category: type, // Historically labelled via type
          account_type_id: selectedAccountType?.id, // Important matching piece
          header: 'No',
          bank: ['Cash', 'Cash On Hand', 'Fund Transfer'].includes(type) ? 'Yes' : 'No',
          balance: parseFloat(openingBalance.replace(/,/g, '')) || 0,
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
      if (accountTypes.length > 0) {
        handleTypeChange(accountTypes[0].name, (accountTypes[0] as any).baseType);
      } else {
        setType('');
      }

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
                    list="existing-account-names"
                  />
                  <datalist id="existing-account-names">
                    {uniqueAccountNames.map((n) => (
                      <option key={n} value={n} />
                    ))}
                  </datalist>
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
                  <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger id="account-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        new Set([
                          ...accountTypes.map((t: any) => t.name),
                          ...(accounts || []).map((acc: any) => acc.account_type),
                          ...(accounts || []).map((acc: any) => acc.account_category)
                        ].filter(Boolean))
                      ).sort().map((typeName: any) => (
                        <SelectItem key={typeName} value={typeName}>{typeName}</SelectItem>
                      ))}
                      <div className="border-t my-1" />
                      <SelectItem value="NEW_ACCOUNT_TYPE" className="text-primary font-medium">
                        + Create New Account Type
                      </SelectItem>
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

      {/* Sub-dialog for specific account type creation */}
      <Dialog open={isCreatingNewType} onOpenChange={setIsCreatingNewType}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Account Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Account Type Name</Label>
              <Input
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="e.g. Short Term Investments"
              />
            </div>
            <div className="space-y-2">
              <Label>Base Type</Label>
              <Select value={newTypeBase} onValueChange={setNewTypeBase}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asset">Asset</SelectItem>
                  <SelectItem value="Liability">Liability</SelectItem>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingNewType(false)}>Cancel</Button>
            <Button onClick={handleCreateNewAccountType} disabled={!newTypeName.trim()}>Create Type</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog >
  );
}
