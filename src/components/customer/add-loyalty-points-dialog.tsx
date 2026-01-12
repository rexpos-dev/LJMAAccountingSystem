'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AddLoyaltyPointsDialog() {
    const { openDialogs, closeDialog, getDialogData } = useDialog();
    const { toast } = useToast();
    const [amount, setAmount] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [pointSettings, setPointSettings] = useState<any[]>([]);
    const [selectedSettingId, setSelectedSettingId] = useState('');

    const data = getDialogData('add-loyalty-points' as any);
    const mode = data?.mode || 'add';

    useEffect(() => {
        if (openDialogs['add-loyalty-points' as any]) {
            setAmount('0');
            // Fetch settings
            fetch('/api/loyalty-point-settings')
                .then(res => res.json())
                .then(data => {
                    setPointSettings(data);
                    if (data.length > 0) setSelectedSettingId(data[0].id);
                })
                .catch(err => console.error('Error fetching settings:', err));
        }
    }, [openDialogs['add-loyalty-points' as any]]);

    const handleSave = async () => {
        if (!data?.selectedCustomerId) {
            toast({ title: 'Error', description: 'No customer selected', variant: 'destructive' });
            return;
        }

        if (!selectedSettingId) {
            toast({ title: 'Error', description: 'Please select a point setting', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        try {
            const points = parseFloat(amount);
            const finalPoints = mode === 'subtract' ? -Math.abs(points) : Math.abs(points);

            const response = await fetch('/api/loyalty-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: data.selectedCustomerId,
                    loyaltyCardId: data.loyaltyCardId || 'MANUAL',
                    totalPoints: finalPoints,
                    pointSettingId: selectedSettingId,
                    expiryDate: null,
                }),
            });

            if (!response.ok) throw new Error('Failed to update points');

            toast({ title: 'Success', description: `Points ${mode === 'add' ? 'added' : 'subtracted'} successfully` });
            closeDialog('add-loyalty-points' as any);
            window.dispatchEvent(new CustomEvent('loyalty-points-refresh'));
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to update points', variant: 'destructive' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={openDialogs['add-loyalty-points' as any]} onOpenChange={() => closeDialog('add-loyalty-points' as any)}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{mode === 'add' ? 'Add' : 'Subtract'} Loyalty Points</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="setting">Point Setting</Label>
                        <Select value={selectedSettingId} onValueChange={setSelectedSettingId}>
                            <SelectTrigger id="setting">
                                <SelectValue placeholder="Select a setting" />
                            </SelectTrigger>
                            <SelectContent>
                                {pointSettings.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.description}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount of Points</Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => closeDialog('add-loyalty-points' as any)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
