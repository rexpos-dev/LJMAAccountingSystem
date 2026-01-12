'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';
import { useDeleteSalesUser } from '@/hooks/use-sales-users';
import { useToast } from '@/hooks/use-toast';
import { SalesUser } from '@/types/sales-user';

export default function DeleteSalesUserDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();
  const deleteSalesUser = useDeleteSalesUser();

  const user = getDialogData('delete-sales-user') as SalesUser;

  const handleClose = () => {
    if (deleteSalesUser.isPending) return;
    closeDialog('delete-sales-user');
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      await deleteSalesUser.mutateAsync(user.id);

      toast({
        title: 'Sales user deleted',
        description: 'The sales user has been removed successfully.',
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: 'Error deleting sales user',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={openDialogs['delete-sales-user']} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Sales User</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the sales user "{user?.complete_name || user?.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClose} disabled={deleteSalesUser.isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteSalesUser.isPending}
          >
            {deleteSalesUser.isPending ? 'Deleting...' : 'Delete User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
