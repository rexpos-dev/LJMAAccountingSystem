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
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';

export function AddLoyaltySettingDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  
  const [description, setDescription] = useState('');
  const [base, setBase] = useState('Amount');
  const [amount, setAmount] = useState('0');
  const [equivalentPoint, setEquivalentPoint] = useState('0');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (openDialogs['add-loyalty-setting']) {
      setDescription('');
      setBase('Amount');
      setAmount('0');
      setEquivalentPoint('0');
    }
  }, [openDialogs['add-loyalty-setting']]);

  const handleSave = async () => {
    if (!description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a description',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/loyalty-point-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description.trim(),
          base,
          amount: parseFloat(amount) || 0,
          equivalentPoint: parseFloat(equivalentPoint) || 0,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || 'Failed to save loyalty point setting';
        const errorDetails = errorData.details ? `\n\nDetails: ${errorData.details}` : '';
        throw new Error(errorMessage + errorDetails);
      }

      toast({
        title: 'Success',
        description: 'Loyalty point setting saved successfully',
      });

      closeDialog('add-loyalty-setting');
      // Trigger a refresh in the parent component
      window.dispatchEvent(new CustomEvent('loyalty-settings-refresh'));
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save loyalty point setting',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    closeDialog('add-loyalty-setting');
  };

  return (
    <Dialog open={openDialogs['add-loyalty-setting']} onOpenChange={() => closeDialog('add-loyalty-setting')}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Point setting</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base">Base</Label>
            <Select value={base} onValueChange={setBase}>
              <SelectTrigger id="base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Amount">Amount</SelectItem>
                <SelectItem value="Quantity">Quantity</SelectItem>
                <SelectItem value="Percentage">Percentage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="equivalent-point">Equivalent Point</Label>
            <Input
              id="equivalent-point"
              type="number"
              value={equivalentPoint}
              onChange={(e) => setEquivalentPoint(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

