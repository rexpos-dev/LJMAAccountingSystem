
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import type { Account } from '@/types/account';
import { useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';


export default function EditAccountDialog({ account }: { account?: Account | null }) {
  const { openDialogs, closeDialog } = useDialog();
  const { refetch } = useAccounts();
  const { toast } = useToast();
  
  // This state will hold the form data and will be updated as the user types.
  const [formData, setFormData] = useState<Partial<Account>>({});

  // This useEffect hook is crucial. It listens for changes to the `account` prop.
  // When a new account is selected in the parent component, this updates the dialog's form data.
  useEffect(() => {
    if (account) {
      setFormData(account);
    } else {
      // If no account is selected (e.g., dialog is closed), reset the form.
      setFormData({});
    }
  }, [account]);

  // Handles changes for regular input fields.
  const handleInputChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handles changes for checkboxes, converting boolean to 'Yes'/'No' string.
  const handleCheckboxChange = (field: keyof Account, checked: boolean) => {
    handleInputChange(field, checked ? 'Yes' : 'No');
  };

  // Saves the updated data to the database.
  const handleSave = async () => {
    if (!formData.id) {
      console.error('No account ID available for update');
      return;
    }

    try {
      const response = await fetch('/api/accounts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          number: formData.number,
          name: formData.name,
          type: formData.type,
          header: formData.header,
          bank: formData.bank,
          category: formData.category,
          balance: formData.balance,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update account');
      }

      const updatedAccount = await response.json();
      console.log('Account updated:', updatedAccount);

      toast({
        title: "Account Updated",
        description: `Account "${updatedAccount.name}" has been successfully updated.`,
      });

      // Refresh accounts list
      refetch();

      handleClose(); // Close the dialog after saving.
    } catch (error: any) {
      console.error('Error updating account:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update account",
      });
    }
  };

  // Closes the dialog and resets the form.
  const handleClose = () => {
    setFormData({}); // Clear form data on close
    closeDialog('edit-account');
  };

  const isEquity = formData.type === 'Equity';

  return (
    <Dialog open={openDialogs['edit-account']} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Account Properties</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="number" className="text-right">
              Number:
            </Label>
            <Input id="number" value={formData.number || ''} readOnly className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type:
            </Label>
            <Input id="type" value={formData.type || ''} disabled className="col-span-2" />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subclass" className="text-right">
              Subclass:
            </Label>
            <Select disabled>
              <SelectTrigger id="subclass" className="col-span-2">
                <SelectValue placeholder="" />
              </SelectTrigger>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="cash-flow" className="text-right">
              Classification for cash flow:
            </Label>
            <Select disabled={!isEquity}>
              <SelectTrigger id="cash-flow" className="col-span-2">
                <SelectValue placeholder="--- Select Classification ---" />
              </SelectTrigger>
               <SelectContent>
                <SelectItem value="operating">Operating</SelectItem>
                <SelectItem value="investing">Investing</SelectItem>
                <SelectItem value="financing">Financing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <Input id="name" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="col-span-2" />
          </div>
          <div className="col-start-2 col-span-2 space-y-2">
             <div className="flex items-center space-x-2">
                <Checkbox id="header-account" checked={formData.header === 'Yes'} onCheckedChange={(checked) => handleCheckboxChange('header', checked as boolean)} disabled={formData.type === 'Income'} />
                <Label htmlFor="header-account" className="font-normal">Header account (for subtotals only, no posting)</Label>
            </div>
            <div className="flex items-center space-x-2">
                <Checkbox id="cash-postable" checked={formData.bank === 'Yes'} onCheckedChange={(checked) => handleCheckboxChange('bank', checked as boolean)} />
                <Label htmlFor="cash-postable" className="font-normal">Cash postable (e.g., bank or credit card)</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="tax-included" disabled={formData.type === 'Liability'} />
                <Label htmlFor="tax-included" className="font-normal">Tax included</Label>
            </div>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="opening-balance" className="text-right">
              Opening balance:
            </Label>
            <Input id="opening-balance" type="number" value={formData.balance ?? 0} onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)} className="col-span-2" />
          </div>
           <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="linked-account" className="text-right">
              Default linked account for:
            </Label>
            <Select>
              <SelectTrigger id="linked-account" className="col-span-2">
                <SelectValue placeholder="--- None ---" />
              </SelectTrigger>
              <SelectContent>
                {formData.type === 'Income' ? (
                  <>
                    <SelectItem value="income-account">Income Account</SelectItem>
                    <SelectItem value="freight-collected">Freight Collected</SelectItem>
                  </>
                ) : formData.type === 'Expense' ? (
                  <>
                    <SelectItem value="sales-tax-paid">Sales Tax Paid</SelectItem>
                    <SelectItem value="freight-paid">Freight Paid</SelectItem>
                    <SelectItem value="expense-account">Expense Account</SelectItem>
                  </>
                ) : formData.type === 'Liability' ? (
                  <>
                    <SelectItem value="sales-tax-collected">Sales Tax Collected</SelectItem>
                    <SelectItem value="sales-tax-paid">Sales Tax Paid</SelectItem>
                    <SelectItem value="accounts-payable">Account Payables</SelectItem>
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
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>OK</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogClose>
          <Button variant="secondary">Help</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
