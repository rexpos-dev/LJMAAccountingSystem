
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-provider';
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Transaction } from '@/types/transaction';

import { Timestamp } from 'firebase/firestore';

export default function EditTransactionDialog({ transaction }: { transaction?: Transaction | null }) {
  const { openDialogs, closeDialog } = useDialog();

  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [date, setDate] = useState<Date | undefined>();

  useEffect(() => {
    if (transaction) {
      setFormData(transaction);
      if (transaction.date) {
        setDate(transaction.date.toDate());
      }
    } else {
      setFormData({});
      setDate(undefined);
    }
  }, [transaction]);

  const handleInputChange = (field: keyof Transaction, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
        handleInputChange('date', Timestamp.fromDate(newDate));
    }
  }

  const handleSave = () => {
    // For mock data, just log and close
    console.log('Mock transaction edit saved:', formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({});
    closeDialog('edit-transaction');
  };

  return (
    <Dialog open={openDialogs['edit-transaction']} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>EDIT-Checks Information</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="account-number" className="text-right">Account#</Label>
                    <Input id="account-number" value={formData.accountNumber || ''} onChange={(e) => handleInputChange('accountNumber', e.target.value)} className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="account-name" className="text-right">Account Name</Label>
                    <Input id="account-name" value={formData.accountName || ''} onChange={(e) => handleInputChange('accountName', e.target.value)} className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="group" className="text-right">Group</Label>
                    <Select value={formData.ledger} onValueChange={(value) => handleInputChange('ledger', value)}>
                        <SelectTrigger id="group" className="col-span-2">
                            <SelectValue placeholder="Select a group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Check">Check</SelectItem>
                            <SelectItem value="Cash & Checks">Cash & Checks</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="ctrl-number" className="text-right">Ctrl#</Label>
                    <Input id="ctrl-number" value={formData.transNo || ''} onChange={(e) => handleInputChange('transNo', e.target.value)} className="col-span-2" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="date-created" className="text-right">DateCreated</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            id="date-created"
                            className={cn(
                            'w-full justify-start text-left font-normal col-span-2',
                            !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="account-status" className="text-right">Account Status</Label>
                    <Select value={formData.approval || undefined} onValueChange={(value) => handleInputChange('approval', value)}>
                        <SelectTrigger id="account-status" className="col-span-2">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="user" className="text-right">User</Label>
                    <Input id="user" value={formData.user || ''} onChange={(e) => handleInputChange('user', e.target.value)} className="col-span-2" />
                </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
