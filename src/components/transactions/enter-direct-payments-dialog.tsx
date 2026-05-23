"use client";

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
import { 
  CalendarIcon, 
  UserPlus, 
  Pencil, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  History, 
  Info,
  X,
  ShieldCheck,
  Plus,
  Activity,
  Calculator,
  Trash2,
  Building2,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import format from '@/lib/date-format';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccounts } from '@/hooks/use-accounts';

interface AllocationRow {
  id: string;
  account: string;
  amount: string;
  type: 'CR' | 'DR';
}

export function EnterDirectPaymentsDialog() {
  const { openDialogs, closeDialog } = useDialog();
  const { data: accounts = [] } = useAccounts();
  const [transactionDate, setTransactionDate] = useState<Date | undefined>(new Date());
  const [payTo, setPayTo] = useState<string>('');
  const [accountPaidFrom, setAccountPaidFrom] = useState<string>('');
  const [journalMemo, setJournalMemo] = useState<string>('Direct Fund Allocation');
  const [method, setMethod] = useState<string>('Cash');
  const [amount, setAmount] = useState<string>('0.00');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [checkNumber, setCheckNumber] = useState<string>('');
  const [allocations, setAllocations] = useState<AllocationRow[]>([]);

  const handleAddAllocation = () => {
    const newId = `allocation-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setAllocations(prev => [
      ...prev,
      {
        id: newId,
        account: '',
        amount: '0.00',
        type: 'DR',
      }
    ]);
  };

  const handleAccountChange = (id: string, accountName: string) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, account: accountName }
          : allocation
      )
    );
  };

  const handleAmountChange = (id: string, newAmount: string) => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, amount: newAmount }
          : allocation
      )
    );
  };

  const handleTypeChange = (id: string, newType: 'CR' | 'DR') => {
    setAllocations(prev =>
      prev.map(allocation =>
        allocation.id === id
          ? { ...allocation, type: newType }
          : allocation
      )
    );
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(a => a.id !== id));
  };

  const totalAllocated = useMemo(() => 
    allocations.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
  , [allocations]);

  return (
    <Dialog open={openDialogs['enter-direct-payments']} onOpenChange={(open) => !open && closeDialog('enter-direct-payments')}>
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Premium Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.1)]">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">Direct Disbursement Protocol</DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">Instant Liquidity</span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">Transaction Module v3.1</span>
              </div>
            </div>
          </div>

          
        </div>

        <ScrollArea className="flex-1">
          <div className="p-8 space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
                  <Calculator className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Disbursement Total</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-blue-400/60 uppercase">PHP</span>
                  <span className="text-3xl font-black italic tracking-tighter text-blue-400">
                    {Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-400">
                  <Building2 className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Source Accountability</p>
                <span className="text-2xl font-black italic tracking-tighter text-emerald-400 uppercase truncate block">
                  {accountPaidFrom ? accounts.find(a => a.id === accountPaidFrom)?.account_name : "IDENTIFY SOURCE"}
                </span>
              </div>

              <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-400">
                  <Activity className="h-10 w-10" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40 mb-1">Allocation Drift</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-xs font-bold text-amber-400/60 uppercase">PHP</span>
                  <span className={cn(
                    "text-3xl font-black italic tracking-tighter transition-colors",
                    Math.abs(Number(amount || 0) - totalAllocated) < 0.01 ? "text-emerald-400" : "text-amber-400"
                  )}>
                    {(Number(amount || 0) - totalAllocated).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Transaction Identification */}
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Capture Parameters</h3>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-foreground/5 border-foreground/10 hover:bg-foreground/10 text-foreground rounded-xl">
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                            <span className="font-bold text-xs uppercase tracking-tighter">{transactionDate ? format(transactionDate, "MMM dd, yyyy") : "Select Date"}</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-card border-foreground/10 shadow-2xl backdrop-blur-xl">
                          <Calendar mode="single" selected={transactionDate} onSelect={setTransactionDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Source Account</Label>
                      <Select value={accountPaidFrom} onValueChange={setAccountPaidFrom}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                          <SelectValue placeholder="Identify Channel" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          {accounts.filter(a => a.account_type === 'Asset').map(account => (
                            <SelectItem key={account.id} value={account.id || ''} className="text-xs font-bold uppercase">
                              {account.account_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Payee Node</Label>
                    <div className="flex gap-2">
                      <Select value={payTo} onValueChange={setPayTo}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                          <SelectValue placeholder="Identify Payee Entity" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          {accounts.map(account => (
                            <SelectItem key={account.id} value={account.id || ''} className="text-xs font-bold uppercase">
                              {account.account_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="icon" className="w-11 shrink-0 rounded-xl border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all">
                        <UserPlus className="h-4 w-4 text-blue-400" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Methodology</Label>
                      <Select value={method} onValueChange={setMethod}>
                        <SelectTrigger className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl text-xs font-bold uppercase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-foreground/10 text-foreground">
                          <SelectItem value="Cash" className="text-xs font-bold uppercase">Cash Protocol</SelectItem>
                          <SelectItem value="Check" className="text-xs font-bold uppercase">Check Settlement</SelectItem>
                          <SelectItem value="Bank Transfer" className="text-xs font-bold uppercase">Digital Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Check Serial</Label>
                      <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)}
                        placeholder="SN-000000"
                        disabled={method !== 'Check'}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Fiscal Allocation */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Fund Distribution</h3>
                </div>

                <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Reference Protocol</Label>
                      <Input className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="EXT-REF-000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Aggregate Value</Label>
                      <Input className="bg-foreground/5 border-foreground/10 text-blue-400 rounded-xl font-black italic text-sm" value={amount} onChange={(e) => setAmount(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Journal Commentary</Label>
                    <Textarea className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl min-h-[142px] resize-none text-sm placeholder:text-foreground/10" value={journalMemo} onChange={(e) => setJournalMemo(e.target.value)}
                      placeholder="Add line-item particulars and audit notes..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Expense Distribution Matrix</h3>
                </div>
                <Button onClick={handleAddAllocation} variant="outline" className="rounded-xl bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all gap-2" >
                  <Plus className="h-4 w-4" />
                  <span className="font-black uppercase tracking-widest text-[10px]">Initialize Node</span>
                </Button>
              </div>

              <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-foreground/5">
                    <TableRow className="border-foreground/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Target Ledger Account</TableHead>
                      <TableHead className="w-48 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Allocated Value</TableHead>
                      <TableHead className="w-32 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-center">Type</TableHead>
                      <TableHead className="w-16"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-foreground/20 gap-2">
                            <Activity className="h-8 w-8 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Distribution Data</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map(row => (
                        <TableRow key={row.id} className="border-foreground/5 hover:bg-foreground/[0.02] group transition-colors">
                          <TableCell className="">
                            <Select value={row.account} onValueChange={(value) => handleAccountChange(row.id, value)}>
                              <SelectTrigger className="bg-transparent border-0 shadow-none text-foreground font-black h-8 text-[11px] uppercase italic tracking-tight focus:ring-0">
                                <SelectValue placeholder="Identify Target Node" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-foreground/10 text-foreground">
                                {accounts.map(account => (
                                  <SelectItem key={account.id} value={account.account_name} className="text-[11px] font-bold uppercase">
                                    {account.account_name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Input type="number" value={row.amount} onChange={(e) => handleAmountChange(row.id, e.target.value)}
                              className="bg-transparent border-0 shadow-none text-right text-emerald-400 font-black italic h-8 text-sm focus:ring-0"
                            />
                          </TableCell>
                          <TableCell className="">
                            <div className="flex justify-center">
                              <Select value={row.type} onValueChange={(value) => handleTypeChange(row.id, value as 'CR' | 'DR')}>
                                <SelectTrigger className={cn( "w-20 mx-auto h-8 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all focus:ring-0 shadow-none", row.type === 'DR' ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" : "bg-red-400/10 text-red-400 border-red-400/20" )}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-foreground/10 text-foreground">
                                  <SelectItem value="CR" className="text-[10px] font-black tracking-widest uppercase text-red-400">CR</SelectItem>
                                  <SelectItem value="DR" className="text-[10px] font-black tracking-widest uppercase text-emerald-400">DR</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                          <TableCell className="text-center pr-6">
                            <button
                              className="p-2 text-foreground/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                              onClick={() => handleDeleteAllocation(row.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Footer */}
        <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Protocol Integrity</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  Math.abs(Number(amount || 0) - totalAllocated) < 0.01 ? "bg-emerald-400 animate-pulse" : "bg-foreground/10"
                )} />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                  {Math.abs(Number(amount || 0) - totalAllocated) < 0.01 ? "Ledger Verified" : "Drift Detected"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Aggregate Settlement</span>
              <span className="text-2xl font-black italic tracking-tighter text-blue-400">
                ₱{Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => closeDialog('enter-direct-payments')}
              className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]"
            >
              Abort Protocol
            </Button>
            <Button className="px-10 rounded-xl bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-400/20 transition-all gap-2" disabled={Math.abs(Number(amount || 0) - totalAllocated) > 0.01 || totalAllocated === 0}
            >
              <ShieldCheck className="h-4 w-4" />
              Commit Disbursement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
