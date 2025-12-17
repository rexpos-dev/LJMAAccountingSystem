"use client";

import React, { useEffect, useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDialog } from '@/components/layout/dialog-provider';
import { useToast } from '@/hooks/use-toast';

export function AddPointsDialog() {
  const { openDialogs, closeDialog, getDialogData } = useDialog();
  const { toast } = useToast();

  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [points, setPoints] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [pointSettings, setPointSettings] = useState<any[]>([]);
  const [selectedSettingId, setSelectedSettingId] = useState<string | null>(null);
  const [mode, setMode] = useState<'add' | 'subtract'>('add');
  const [isCustomerLocked, setIsCustomerLocked] = useState(false);
  const [isPointSettingLocked, setIsPointSettingLocked] = useState(false);
  const [loyaltyCardId, setLoyaltyCardId] = useState<string>('');

  useEffect(() => {
    if (!openDialogs['add-loyalty-points']) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to load customers');
        const data = await res.json();
        if (mounted) setCustomers(Array.isArray(data) ? data : []);

        // Set pre-selected customer and mode if provided
        const dialogData = getDialogData('add-loyalty-points');
        if (mounted) {
          if (dialogData?.selectedCustomerId) {
            setSelectedCustomerId(dialogData.selectedCustomerId);
            setIsCustomerLocked(true);
          }
          if (dialogData?.pointSettingId) {
            setSelectedSettingId(dialogData.pointSettingId);
            setIsPointSettingLocked(true);
          }
          if (dialogData?.mode) {
            setMode(dialogData.mode);
          }
        }

        // fetch loyalty settings
        try {
          const s = await fetch('/api/loyalty-point-settings');
          if (s.ok) {
            const sd = await s.json();
            if (mounted) setPointSettings(Array.isArray(sd) ? sd : []);
          }
        } catch (e) {
          // ignore
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Could not load customers', variant: 'destructive' });
      }
    })();

    return () => {
      mounted = false;
      setSelectedCustomerId(null);
      setBalance(0);
      setDate(new Date().toISOString().slice(0, 10));
      setPoints('');
      setSelectedSettingId(null);
      setMode('add');
      setIsCustomerLocked(false);
      setIsPointSettingLocked(false);
      setLoyaltyCardId('');
    };
  }, [openDialogs['add-loyalty-points'], getDialogData]);

  useEffect(() => {
    if (!selectedCustomerId) {
      setBalance(0);
      setLoyaltyCardId('');
      return;
    }

    const customer = customers.find((c) => c.id === selectedCustomerId);
    if (customer) {
      setLoyaltyCardId(customer.loyaltyCardNumber || '');
    }

    // fetch loyalty-points summary for the selected customer
    (async () => {
      try {
        const res = await fetch(`/api/loyalty-points/summary?customerId=${encodeURIComponent(selectedCustomerId)}`);
        if (!res.ok) throw new Error('Failed to load balance');
        const js = await res.json();
        setBalance(Number(js.total ?? 0));
      } catch (e) {
        console.error('Error fetching loyalty summary:', e);
        setBalance(0);
      }
    })();
  }, [selectedCustomerId, customers]);

  const handleSave = async () => {
    if (!selectedCustomerId) {
      toast({ title: 'Validation', description: 'Please select a customer', variant: 'destructive' });
      return;
    }
    if (!selectedSettingId) {
      toast({ title: 'Validation', description: 'Please select a point setting', variant: 'destructive' });
      return;
    }
    if (!points || isNaN(Number(points))) {
      toast({ title: 'Validation', description: `Please enter points to ${mode}`, variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    try {
      const pointsValue = mode === 'subtract' ? -Number(points) : Number(points);
      const payload = {
        customerId: selectedCustomerId,
        loyaltyCardId: loyaltyCardId,
        totalPoints: pointsValue,
        pointSettingId: selectedSettingId,
        expiryDate: date || null,
      };

      const res = await fetch('/api/loyalty-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || `Failed to ${mode} points`);

      toast({ title: 'Success', description: `Points ${mode === 'add' ? 'added' : 'subtracted'}` });
      closeDialog('add-loyalty-points');
      window.dispatchEvent(new CustomEvent('loyalty-points-refresh'));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || `Failed to ${mode} points`, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || null;

  return (
    <Dialog open={openDialogs['add-loyalty-points']} onOpenChange={() => closeDialog('add-loyalty-points')}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Points' : 'Subtract Points'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Customer</Label>
            <Select value={selectedCustomerId || ''} onValueChange={(v) => setSelectedCustomerId(v || null)} disabled={isCustomerLocked}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{`${c.code} - ${c.customerName || c.name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCustomer && (
            <div>
              <div className="text-lg font-medium">{selectedCustomer.customerName || selectedCustomer.name}</div>
              <div className="text-sm text-muted-foreground">Balance: {balance.toFixed(2)}</div>
              <div className="mt-2">
                <Label htmlFor="point-setting">Point Setting</Label>
                <Select value={selectedSettingId || ''} onValueChange={(v) => setSelectedSettingId(v || null)} disabled={isPointSettingLocked}>
                  <SelectTrigger id="point-setting">
                    <SelectValue placeholder="Select point setting..." />
                  </SelectTrigger>
                  <SelectContent>
                    {pointSettings.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.description}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="points">{mode === 'add' ? 'Points to Add' : 'Points to Subtract'}</Label>
            <Input id="points" placeholder={`Enter Points to ${mode === 'add' ? 'Add' : 'Subtract'}`} value={points} onChange={(e) => setPoints(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog('add-loyalty-points')} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddPointsDialog;
