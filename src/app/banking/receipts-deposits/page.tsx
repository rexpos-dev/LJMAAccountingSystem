
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useDialog } from '@/components/layout/dialog-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import format from '@/lib/date-format';
import { useBankAccounts, useAccounts } from '@/hooks/use-accounts';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CardDescription } from '@/components/ui/card';
import { Loader2, Plus, Trash2, ShieldCheck } from 'lucide-react';
import type { Account } from '@/types/account';

export default function ReceiptsDepositsPage() {
  const { openDialogs, closeDialog } = useDialog();
  const { toast } = useToast();
  const { accounts: bankAccounts, isLoading: isLoadingBanks } = useBankAccounts();
  const { data: allAccounts } = useAccounts();

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.00');
  const [reference, setReference] = useState<string>('');
  const [journalMemo, setJournalMemo] = useState<string>('Receipt');
  const [checkNo, setCheckNo] = useState<string>('');

  const [allocations, setAllocations] = useState<{ accountId: string; amount: number; memo: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedBank = bankAccounts.find(a => a.id === selectedBankId);

  const addAllocation = () => {
    setAllocations([...allocations, { accountId: '', amount: 0, memo: '' }]);
  };

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, field: string, value: any) => {
    const newAllocations = [...allocations];
    (newAllocations[index] as any)[field] = value;
    setAllocations(newAllocations);
  };

  const totalAllocated = allocations.reduce((sum: number, a: any) => sum + (a.amount || 0), 0);

  const handleRecord = async () => {
    if (!selectedBankId || parseFloat(amount) <= 0 || allocations.length === 0) {
      toast({ title: 'Error', description: 'Please fill out all required fields and add at least one allocation.', variant: 'destructive' });
      return;
    }

    if (Math.abs(totalAllocated - parseFloat(amount)) > 0.01) {
      toast({ title: 'Error', description: 'Total allocations must equal the deposit amount.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/banking/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankGlId: selectedBankId,
          amount: parseFloat(amount),
          date: date?.toISOString(),
          reference,
          memo: journalMemo,
          allocations,
          user: 'admin'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to record deposit');
      }

      toast({ title: 'Success', description: 'Deposit recorded successfully.' });
      window.dispatchEvent(new CustomEvent('bank-accounts-refresh'));
      closeDialog('receipts-deposits');
    } catch (error: any) {
      console.error(error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Dialog open={openDialogs['receipts-deposits']} onOpenChange={() => closeDialog('receipts-deposits')}>
      <DialogContent className="max-w-[1200px] w-[95vw] p-0 overflow-hidden bg-slate-950/98 border-white/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-400/20 text-emerald-400 border border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.2)]">
              <Plus className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none text-white">
                Receipts & Deposits
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-400/20 text-emerald-400 border border-emerald-400/20">Banking</span>
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Transaction Entry Interface</span>
              </div>
            </div>
          </div>

          <DialogClose asChild>
            <button className="relative z-10 p-2 rounded-xl hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <Plus className="h-5 w-5 rotate-45" />
            </button>
          </DialogClose>
        </div>

        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Transaction Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left bg-white/5 border-white/10 hover:bg-white/10 text-white h-11 rounded-xl font-bold text-xs',
                              !date && 'text-white/20'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-emerald-400" />
                            {date ? format(date, 'MMM dd, yyyy') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="bg-slate-900 text-white rounded-xl border-0"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Deposit Account</Label>
                      <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-emerald-400/20">
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/10 text-white">
                          {isLoadingBanks ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : (
                            bankAccounts.map(acc => (
                              <SelectItem key={acc.id} value={acc.id!} className="focus:bg-emerald-400/10 focus:text-emerald-400">
                                {acc.account_name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Account Balance</Label>
                      <Input 
                        value={selectedBank ? `₱${selectedBank.balance?.toFixed(2) || '0.00'}` : '₱0.00'} 
                        disabled 
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl disabled:opacity-50" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 ml-1">Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 font-black">₱</span>
                        <Input 
                          value={amount} 
                          onChange={(e) => setAmount(e.target.value)} 
                          className="pl-8 bg-white/5 border-emerald-400/20 text-emerald-400 h-11 rounded-xl focus:ring-emerald-400/20 font-black text-lg" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Reference Number</Label>
                      <Input 
                        value={reference} 
                        onChange={(e) => setReference(e.target.value)} 
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-emerald-400/20" 
                        placeholder="e.g. DEP-2023-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Check Number</Label>
                      <Input 
                        value={checkNo} 
                        onChange={(e) => setCheckNo(e.target.value)} 
                        className="bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-emerald-400/20" 
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Journal Memo</Label>
                    <Textarea
                      value={journalMemo}
                      onChange={(e) => setJournalMemo(e.target.value)}
                      className="min-h-[80px] bg-white/5 border-white/10 text-white rounded-xl focus:ring-emerald-400/20 resize-none p-4"
                      placeholder="Transaction description..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Account Allocation</h3>
                </div>
                <Button 
                  onClick={addAllocation}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-9 px-4 text-[10px] font-black uppercase tracking-widest"
                >
                  <Plus className="h-3.5 w-3.5 mr-2" /> 
                  Add Account
                </Button>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm shadow-xl">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14">Target Account</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40 h-14 text-right w-[200px]">Amount Allocation</TableHead>
                      <TableHead className="w-[60px] h-14"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="h-32 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Initialize allocation to proceed</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map((alloc, index: number) => (
                        <TableRow key={index} className="border-white/5 group hover:bg-white/[0.02] transition-colors">
                          <TableCell className="py-4">
                            <Select value={alloc.accountId} onValueChange={(val: string) => updateAllocation(index, 'accountId', val)}>
                              <SelectTrigger className="w-full bg-white/5 border-white/10 text-white h-11 rounded-xl focus:ring-emerald-400/20">
                                <SelectValue placeholder="Select Target Account" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-white/10 text-white max-h-[300px]">
                                {allAccounts.map((acc: Account) => (
                                  <SelectItem key={acc.id} value={acc.id!} className="focus:bg-emerald-400/10 focus:text-emerald-400">
                                    <div className="flex flex-col items-start gap-1">
                                      <span>{acc.account_name}</span>
                                      <span className="text-[10px] font-mono text-white/40">{acc.account_no}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs font-black">₱</span>
                              <Input
                                type="number"
                                value={alloc.amount}
                                onChange={(e) => updateAllocation(index, 'amount', parseFloat(e.target.value))}
                                className="pl-7 h-11 bg-white/5 border-white/10 text-white rounded-xl text-right font-bold focus:ring-emerald-400/20"
                                placeholder="0.00"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-10 w-10 text-red-400/40 hover:text-red-400 hover:bg-red-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all" 
                              onClick={() => removeAllocation(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {/* Summary Footer */}
                <div className="bg-white/5 border-t border-white/5 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Total Target</span>
                      <span className="text-xl font-black italic text-emerald-400 tracking-tighter">₱{parseFloat(amount || '0').toFixed(2)}</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Allocated</span>
                      <span className="text-xl font-black italic text-white tracking-tighter">₱{totalAllocated.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Variance</span>
                    <span className={cn(
                      "text-2xl font-black italic tracking-tighter",
                      Math.abs(parseFloat(amount || '0') - totalAllocated) > 0.01 ? "text-red-400" : "text-emerald-400"
                    )}>
                      {Math.abs(parseFloat(amount || '0') - totalAllocated) > 0.01 ? '+' : ''}₱{(parseFloat(amount || '0') - totalAllocated).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-white/5 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Secure Transaction Gateway</span>
          </div>
          <div className="flex gap-4">
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                className="text-white/60 hover:text-white hover:bg-white/10 font-black uppercase tracking-widest text-[10px] px-6 h-12 rounded-xl transition-all"
              >
                Abort Protocol
              </Button>
            </DialogClose>
            <Button 
              onClick={handleRecord} 
              disabled={isSubmitting || Math.abs(parseFloat(amount || '0') - totalAllocated) > 0.01}
              className="bg-emerald-400 hover:bg-emerald-400/90 text-black font-black uppercase tracking-widest text-[10px] px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Commit Transaction'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
