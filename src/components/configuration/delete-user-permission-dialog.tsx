'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';
import { useDeleteUserPermission } from '@/hooks/use-user-permissions';
import { useToast } from '@/hooks/use-toast';
import { UserPermission } from '@/types/user-permission';

export default function DeleteUserPermissionDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();
  const deleteUserPermission = useDeleteUserPermission();
  
  const [userPermission, setUserPermission] = useState<UserPermission | null>(null);

  const userData = getDialogData('delete-user-permission');

  useEffect(() => {
    if (userData) {
      setUserPermission(userData);
    }
  }, [userData]);

  const handleClose = () => {
    if (deleteUserPermission.isPending) return;
    closeDialog('delete-user-permission');
    setUserPermission(null);
  };

  const handleDelete = async () => {
    if (!userPermission) return;

    try {
      await deleteUserPermission.mutateAsync(userPermission.id);

      toast({
        title: "User Permission Deleted",
        description: `User permission for ${userPermission.username} has been deleted successfully.`,
      });
      handleClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete user permission",
      });
    }
  };

  return (
    <Dialog open={openDialogs['delete-user-permission']} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User Permission</DialogTitle>
        </DialogHeader>

        {userPermission ? (
          <div className="space-y-2">
            <p>Are you sure you want to delete the user permission for:</p>
            <p className="font-medium">
              {userPermission.firstName} {userPermission.middleName} {userPermission.lastName} 
              {' '}({userPermission.username})?
            </p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
          </div>
        ) : (
          <p>Loading user permission details...</p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={deleteUserPermission.isPending}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={deleteUserPermission.isPending}
          >
            {deleteUserPermission.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}