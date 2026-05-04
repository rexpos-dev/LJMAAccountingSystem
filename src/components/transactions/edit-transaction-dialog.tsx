'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
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
import { 
  CalendarIcon, 
  Edit3, 
  Save, 
  X, 
  User, 
  Hash, 
  Layers, 
  CheckCircle2,
  Clock,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import format from '@/lib/date-format';
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
  };

  const handleSave = () => {
    console.log('Mock transaction edit saved:', formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({});
    closeDialog('edit-transaction');
  };

  if (!transaction) return null;

  return (
    <Dialog open={openDialogs['edit-transaction']} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20">
              <Edit3 className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase text-white">Modify Record</DialogTitle>
              <p className="text-sm text-white/40 font-medium tracking-wide mt-0.5">Editing transaction #{transaction.seq || '---'}</p>
            </div>
          </div>

          <div className="relative z-10">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-xl text-white/40 hover:bg-white/10 hover:text-white transition-all"
                onClick={handleClose}
              >
                <X className="h-5 w-5" />
              </Button>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Account Info */}
            <div className="glass-card p-6 border-white/5 space-y-6 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Account Parameters</span>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="account-number" className="text-[10px] font-black uppercase tracking-widest text-white/40">Account Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      id="account-number" 
                      value={formData.accountNumber || ''} 
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)} 
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-name" className="text-[10px] font-black uppercase tracking-widest text-white/40">Account Name</Label>
                  <Input 
                    id="account-name" 
                    value={formData.accountName || ''} 
                    onChange={(e) => handleInputChange('accountName', e.target.value)} 
                    className="h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group" className="text-[10px] font-black uppercase tracking-widest text-white/40">Ledger Group</Label>
                  <Select value={formData.ledger} onValueChange={(value) => handleInputChange('ledger', value)}>
                    <SelectTrigger id="group" className="h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white">
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Cash & Checks">Cash & Checks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column: Meta Info */}
            <div className="glass-card p-6 border-white/5 space-y-6 bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">System Metadata</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctrl-number" className="text-[10px] font-black uppercase tracking-widest text-white/40">Control No.</Label>
                    <Input 
                      id="ctrl-number" 
                      value={formData.transNo || ''} 
                      onChange={(e) => handleInputChange('transNo', e.target.value)} 
                      className="h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-created" className="text-[10px] font-black uppercase tracking-widest text-white/40">Record Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={'outline'}
                          id="date-created"
                          className={cn(
                            'w-full h-12 justify-start text-left font-normal bg-white/5 border-white/10 rounded-xl hover:bg-white/10',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {date ? format(date, 'MM/dd/yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-status" className="text-[10px] font-black uppercase tracking-widest text-white/40">Approval Status</Label>
                  <Select value={formData.approval || undefined} onValueChange={(value) => handleInputChange('approval', value)}>
                    <SelectTrigger id="account-status" className="h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user" className="text-[10px] font-black uppercase tracking-widest text-white/40">Authored By</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      id="user" 
                      value={formData.user || ''} 
                      onChange={(e) => handleInputChange('user', e.target.value)} 
                      className="pl-10 h-12 bg-white/5 border-white/10 focus:border-primary transition-all rounded-xl text-white/60 italic"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-white/5 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Last Modified</span>
                <div className="flex items-center gap-1.5 text-white/60">
                   <Clock className="h-3 w-3" />
                   <span className="text-[10px] font-bold">Auto-saving enabled</span>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={handleClose}
                className="h-12 text-white/40 hover:text-white hover:bg-white/10 rounded-xl px-6 text-xs font-black uppercase tracking-widest"
              >
                Discard Changes
              </Button>
              <Button 
                onClick={handleSave}
                className="h-12 bg-primary text-black hover:bg-primary/90 font-black rounded-xl px-8 text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <Save className="h-4 w-4 mr-2" />
                Commit Updates
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
