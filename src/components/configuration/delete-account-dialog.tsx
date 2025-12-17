
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


export default function DeleteAccountDialog({ account, onDeleted }: { account?: Account | null, onDeleted: () => void }) {
  const { openDialogs, closeDialog } = useDialog();

  const handleDelete = () => {
    // For mock data, just log and close
    console.log('Mock account delete:', account?.id);
    onDeleted();
    closeDialog('delete-account');
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
                Are you sure you want to delete account "{account?.number}"?
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
