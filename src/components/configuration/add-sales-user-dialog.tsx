'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/layout/dialog-provider';
import { useCreateSalesUser } from '@/hooks/use-sales-users';
import { useToast } from '@/hooks/use-toast';

export default function AddSalesUserDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const createSalesUser = useCreateSalesUser();

  const [spId, setSpId] = useState('');
  const [username, setUsername] = useState('');
  const [completeName, setCompleteName] = useState('');
  const [isLoadingId, setIsLoadingId] = useState(false);

  const isOpen = openDialogs['add-sales-user'];

  useEffect(() => {
    if (isOpen) {
      const fetchNextId = async () => {
        setIsLoadingId(true);
        try {
          const response = await fetch('/api/sales-users?action=next-id');
          if (response.ok) {
            const data = await response.json();
            setSpId(data.nextId);
          }
        } catch (error) {
          console.error('Failed to fetch next SP ID', error);
        } finally {
          setIsLoadingId(false);
        }
      };

      fetchNextId();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (createSalesUser.isPending) return;
    closeDialog('add-sales-user');
    setSpId(''); // Will be reset on next open
    setUsername('');
    setCompleteName('');
  };

  const handleSave = async () => {
    if (!spId.trim() || !username.trim() || !completeName.trim()) {
      toast({
        title: 'Validation error',
        description: 'Please fill in SP ID, Username, and Complete Name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createSalesUser.mutateAsync({
        sp_id: spId.trim(),
        username: username.trim(),
        complete_name: completeName.trim(),
      });

      toast({
        title: 'Sales user created',
        description: 'The sales user has been added successfully.',
      });

      handleClose();
    } catch (error: any) {
      toast({
        title: 'Error creating sales user',
        description: error?.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Sales User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="sp-id">SP ID {isLoadingId && <span className="text-xs text-muted-foreground">(Generating...)</span>}</Label>
            <Input
              id="sp-id"
              value={spId}
              readOnly
              disabled
              className="bg-muted font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complete-name">Complete Name</Label>
            <Input
              id="complete-name"
              value={completeName}
              onChange={(e) => setCompleteName(e.target.value)}
              placeholder="Enter complete name"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={createSalesUser.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={createSalesUser.isPending || isLoadingId}>
            {createSalesUser.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
