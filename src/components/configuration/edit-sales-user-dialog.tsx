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
import { Checkbox } from '@/components/ui/checkbox';
import { useDialog } from '@/components/layout/dialog-provider';
import { useUpdateSalesUser } from '@/hooks/use-sales-users';
import { useToast } from '@/hooks/use-toast';
import { SalesUser } from '@/types/sales-user';

export default function EditSalesUserDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const updateSalesUser = useUpdateSalesUser();

    const user = getDialogData('edit-sales-user') as SalesUser;

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (user) {
            setName(user.complete_name || user.name || '');
            setUsername(user.username || '');
            setIsActive(user.isActive);
        }
    }, [user]);

    const handleClose = () => {
        if (updateSalesUser.isPending) return;
        closeDialog('edit-sales-user');
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toast({
                title: 'Validation error',
                description: 'Complete Name is required.',
                variant: 'destructive',
            });
            return;
        }

        try {
            await updateSalesUser.mutateAsync({
                id: user.id,
                name: name.trim(),
                username: username.trim(),
                isActive,
            });

            toast({
                title: 'Sales user updated',
                description: 'The sales user has been updated successfully.',
            });

            handleClose();
        } catch (error: any) {
            toast({
                title: 'Error updating sales user',
                description: error?.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog open={openDialogs['edit-sales-user']} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Sales User</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label>SP ID (Read-only)</Label>
                        <Input
                            value={user?.sp_id || user?.uniqueId || ''}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-username">Username</Label>
                        <Input
                            id="edit-username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="edit-complete-name">Complete Name</Label>
                        <Input
                            id="edit-complete-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter complete name"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="edit-is-active"
                            checked={isActive}
                            onCheckedChange={(checked) => setIsActive(checked as boolean)}
                        />
                        <Label htmlFor="edit-is-active" className="font-normal cursor-pointer">
                            This user is active
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={updateSalesUser.isPending}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={updateSalesUser.isPending}>
                        {updateSalesUser.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
