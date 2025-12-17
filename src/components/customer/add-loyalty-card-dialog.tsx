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

export function AddLoyaltyCardDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();

  const [customers, setCustomers] = useState<Array<any>>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [loyaltyCardNumber, setLoyaltyCardNumber] = useState('');
  const [code, setCode] = useState('');
  const [expiryDate, setExpiryDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [pointSetting, setPointSetting] = useState<string>('');
  const [initialPoints, setInitialPoints] = useState<string>('0');
  const [loyaltySettings, setLoyaltySettings] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!openDialogs['add-loyalty-card']) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/customers');
        if (!res.ok) throw new Error('Failed to load customers');
        const data = await res.json();
        if (mounted) setCustomers(Array.isArray(data) ? data : []);

        // Fetch loyalty settings (optional)
        try {
          const s = await fetch('/api/loyalty-point-settings');
          if (s.ok) {
            const sd = await s.json();
            if (mounted) setLoyaltySettings(Array.isArray(sd) ? sd : []);
          }
        } catch (e) {
          // ignore loyalty settings failure; not critical for UI
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message || 'Could not load customers', variant: 'destructive' });
      }
    })();

    return () => {
      mounted = false;
      setSelectedCustomerId(null);
      setLoyaltyCardNumber('');
      setCode('');
      setExpiryDate(new Date().toISOString().slice(0, 10));
      setPointSetting('');
      setInitialPoints('0');
    };
  }, [openDialogs['add-loyalty-card']]);

  const generateCardNumber = () => {
    const cardNumber = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('');
    setLoyaltyCardNumber(cardNumber);
  };

  // Auto-populate code and loyalty fields when a customer is selected
  useEffect(() => {
    if (!selectedCustomerId) {
      setCode('');
      return;
    }
    const c = customers.find((x) => x.id === selectedCustomerId);
    if (c) {
      setCode(c.code || c.customerCode || '');
      if (c.pointSetting) setPointSetting(c.pointSetting);
      if (c.loyaltyCardNumber) setLoyaltyCardNumber(c.loyaltyCardNumber);
    }
  }, [selectedCustomerId, customers]);

  const handleSave = async () => {
    if (!selectedCustomerId) {
      toast({ title: 'Validation', description: 'Please select a customer', variant: 'destructive' });
      return;
    }
    if (!loyaltyCardNumber.trim()) {
      toast({ title: 'Validation', description: 'Please enter or generate a loyalty card number', variant: 'destructive' });
      return;
    }
    if (!pointSetting) {
      toast({ title: 'Validation', description: 'Please select a point setting', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        customerId: selectedCustomerId,
        loyaltyCardId: loyaltyCardNumber.trim(),
        totalPoints: parseFloat(initialPoints || '0') || 0,
        pointSettingId: pointSetting,
        expiryDate: expiryDate || null,
      };

      const res = await fetch('/api/loyalty-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || 'Failed to save loyalty points');

      toast({ title: 'Success', description: 'Loyalty points added successfully' });
      closeDialog('add-loyalty-card');
      // notify list to refresh
      window.dispatchEvent(new CustomEvent('loyalty-points-refresh'));
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to add loyalty points', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openDialogs['add-loyalty-card']} onOpenChange={() => closeDialog('add-loyalty-card')}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Loyalty Card</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={selectedCustomerId || ''} onValueChange={(v) => setSelectedCustomerId(v || null)}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{`${c.code || c.id} - ${c.customerName || c.name}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="point-setting">Point Setting</Label>
              <Select value={pointSetting} onValueChange={setPointSetting}>
                <SelectTrigger id="point-setting">
                  <SelectValue placeholder="Select a setting" />
                </SelectTrigger>
                <SelectContent>
                  {loyaltySettings.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="initial-points">Initial Points</Label>
              <Input id="initial-points" type="number" value={initialPoints} onChange={(e) => setInitialPoints(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="loyalty-card">Loyalty Card Number</Label>
              <div className="flex gap-2">
                <Input id="loyalty-card" value={loyaltyCardNumber} onChange={(e) => setLoyaltyCardNumber(e.target.value)} className="flex-1" />
                <Button variant="outline" onClick={generateCardNumber}>Generate</Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog('add-loyalty-card')} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddLoyaltyCardDialog;
