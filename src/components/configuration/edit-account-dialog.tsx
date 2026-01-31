
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
import { ScrollArea } from '@/components/ui/scroll-area';
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

type AccountType = 'Cash' | 'Cash On Hand' | 'Fund Transfer' | 'Store Equipments' | 'Office Equipment' | 'Income' | 'Expense';

const baseTypeMapping: Record<AccountType, string> = {
  'Cash': 'Asset',
  'Cash On Hand': 'Asset',
  'Fund Transfer': 'Asset',
  'Store Equipments': 'Asset',
  'Office Equipment': 'Asset',
  'Income': 'Income',
  'Expense': 'Expense'
};


export default function EditAccountDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { refetch } = useAccounts();
  const { toast } = useToast();

  const account = getDialogData('edit-account');

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
  }, [account, openDialogs['edit-account']]);

  // Handles changes for regular input fields.
  const handleInputChange = (field: keyof Account, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (newType: AccountType) => {
    setFormData(prev => ({
      ...prev,
      account_category: newType,
      account_type: baseTypeMapping[newType] as any,
      bank: ['Cash', 'Cash On Hand', 'Fund Transfer'].includes(newType) ? 'Yes' : 'No',
      fs_category: newType // Update fs_category to match type for consistency
    }));
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
          account_no: formData.account_no,
          account_name: formData.account_name,
          account_type: formData.account_type,
          header: formData.header || 'No',
          bank: formData.bank || 'No',
          account_category: formData.account_category,
          balance: formData.balance,
          account_description: formData.account_description,
          account_status: formData.account_status || 'Active',
          fs_category: formData.fs_category || formData.account_category || formData.account_type,
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
        description: `Account "${updatedAccount.account_name}" has been successfully updated.`,
      });

      // Refresh accounts list
      window.dispatchEvent(new CustomEvent('accounts-refresh'));

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

  return (
    <Dialog open={openDialogs['edit-account']} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold">Account Properties</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <div className="space-y-6">
              {/* Account Details Section */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Account No.</Label>
                  <Input
                    id="number"
                    value={formData.account_no || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    Account Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter account name"
                    value={formData.account_name || ''}
                    onChange={(e) => handleInputChange('account_name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="opening-balance">Opening Balance</Label>
                  <Input
                    id="opening-balance"
                    type="number"
                    placeholder="0.00"
                    value={formData.balance ?? 0}
                    onChange={(e) => handleInputChange('balance', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-status">Status</Label>
                  <Select
                    value={formData.account_status || 'Active'}
                    onValueChange={(v) => handleInputChange('account_status', v)}
                  >
                    <SelectTrigger id="account-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Optional description"
                  value={formData.account_description || ''}
                  onChange={(e) => handleInputChange('account_description', e.target.value)}
                />
              </div>

              {/* Simplified Account Type Section */}
              <div className="pt-4 border-t mt-6">
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-type">
                      Account Type<span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={(formData.account_category as AccountType) || (formData.account_type as any === 'Asset' ? 'Cash' : formData.account_type as any) || 'Cash'}
                      onValueChange={(v) => handleTypeChange(v as AccountType)}
                    >
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
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 pt-2 border-t bg-muted/20">
          <div className="flex gap-2 w-full justify-end">
            <Button onClick={handleSave}>OK</Button>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
            </DialogClose>
            <Button variant="secondary">Help</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
