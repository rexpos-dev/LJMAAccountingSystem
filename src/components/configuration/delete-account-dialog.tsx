
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDialog } from '@/components/layout/dialog-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';
import type { Account } from '@/types/account';


import { useToast } from '@/hooks/use-toast';
import { useAccounts } from '@/hooks/use-accounts';

export default function DeleteAccountDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();
  const { refetch } = useAccounts();

  const account = getDialogData('delete-account');

  const handleDelete = async () => {
    if (!account?.id) return;

    try {
      const response = await fetch(`/api/accounts?id=${account.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      toast({
        title: "Account Deleted",
        description: `Account "${account.name}" has been successfully deleted.`,
      });

      window.dispatchEvent(new CustomEvent('accounts-refresh'));
      closeDialog('delete-account');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete account",
      });
    }
  };

  const handleClose = () => {
    closeDialog('delete-account');
  };

  return (
    <AlertDialog
      open={openDialogs['delete-account']}
      onOpenChange={handleClose}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm delete</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className='flex items-center gap-4 pt-4'>
              <Info className='w-8 h-8 text-primary flex-shrink-0' />
              <p>
                Are you sure you want to delete account "{account?.accnt_no}"?
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center space-x-2">
          <Checkbox id="dont-show" />
          <Label htmlFor="dont-show" className="font-normal">Don't show this message again</Label>
        </div>
        <AlertDialogFooter className='mt-4'>
          <AlertDialogAction asChild>
            <Button onClick={handleDelete}>Delete</Button>
          </AlertDialogAction>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
