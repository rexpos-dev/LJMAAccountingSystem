"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CalendarIcon,
  UserPlus,
  CreditCard,
  ArrowUpRight,
  Activity,
  Calculator,
  Trash2,
  Building2,
  ShieldCheck,
  Plus,
  RefreshCw,
  History,
  Eye,
  Ban,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useMemo, useCallback, useEffect } from 'react';
import format from '@/lib/date-format';
import { format as dateFnsFormat } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAccounts } from '@/hooks/use-accounts';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AllocationRow {
  id: string;
  account: string;
  amount: string;
  type: 'CR' | 'DR';
}

interface DirectPayment {
  id: string;
  transaction_date: string;
  pay_to: string | null;
  account_paid_from: string;
  method: string;
  amount: number;
  reference_number: string | null;
  check_number: string | null;
  journal_memo: string | null;
  status: string;
  created_at: string;
  allocations: Array<{
    id: string;
    account_name: string;
    amount: number;
    entry_type: string;
  }>;
}

// ─── View Payment Dialog ──────────────────────────────────────────────────────

function ViewPaymentDialog({ payment, open, onClose }: { payment: DirectPayment | null; open: boolean; onClose: () => void }) {
  if (!payment) return null;

  const formatPHP = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl bg-background/98 border-foreground/10 backdrop-blur-3xl">
        <DialogHeader>
          <DialogTitle className="font-black italic uppercase tracking-tighter text-foreground">
            Disbursement Detail
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Date</p>
              <p className="font-bold">{dateFnsFormat(new Date(payment.transaction_date), 'MMM dd, yyyy')}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Amount</p>
              <p className="font-black text-blue-400 text-lg">{formatPHP(payment.amount)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Method</p>
              <p className="font-bold">{payment.method}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</p>
              <StatusBadge status={payment.status} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Pay To</p>
              <p className="font-bold">{payment.pay_to || '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Reference</p>
              <p className="font-mono text-sm">{payment.reference_number || '—'}</p>
            </div>
            {payment.check_number && (
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Check #</p>
                <p className="font-mono text-sm">{payment.check_number}</p>
              </div>
            )}
            {payment.journal_memo && (
              <div className="col-span-2 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Memo</p>
                <p className="text-sm">{payment.journal_memo}</p>
              </div>
            )}
          </div>

          <div className="border border-foreground/10 rounded-xl overflow-hidden">
            <Table>
              <TableHeader className="bg-foreground/5">
                <TableRow className="border-foreground/5">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Account</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-right">Amount</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 text-center w-16">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payment.allocations.map(a => (
                  <TableRow key={a.id} className="border-foreground/5">
                    <TableCell className="text-sm font-bold uppercase">{a.account_name}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-emerald-400">{formatPHP(a.amount)}</TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'text-[10px] font-black px-2 py-0.5 rounded',
                        a.entry_type === 'DR' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
                      )}>
                        {a.entry_type}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="border-foreground/10">Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'POSTED') return <Badge className="bg-emerald-400/10 text-emerald-400 border-emerald-400/20 text-[10px] font-black uppercase">{status}</Badge>;
  if (status === 'VOIDED') return <Badge className="bg-red-400/10 text-red-400 border-red-400/20 text-[10px] font-black uppercase">{status}</Badge>;
  return <Badge variant="outline" className="text-[10px] font-black uppercase">{status}</Badge>;
}

// ─── History Table ────────────────────────────────────────────────────────────

function PaymentHistoryTab() {
  const [payments, setPayments] = useState<DirectPayment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [viewing, setViewing] = useState<DirectPayment | null>(null);
  const [voidingId, setVoidingId] = useState<string | null>(null);
  const limit = 15;

  const fetchPayments = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/direct-payments?limit=${limit}&offset=${p * limit}`);
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPayments(page); }, [page, fetchPayments]);

  const handleVoid = async (id: string) => {
    setVoidingId(id);
    try {
      const res = await fetch(`/api/direct-payments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success('Payment voided');
      fetchPayments(page);
    } catch (e: any) {
      toast.error(e.message || 'Failed to void');
    } finally {
      setVoidingId(null);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const formatPHP = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
          {total} payment{total !== 1 ? 's' : ''} recorded
        </p>
        <Button variant="ghost" size="sm" onClick={() => fetchPayments(page)} disabled={loading}
          className="text-foreground/40 hover:text-foreground"
        >
          <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
        </Button>
      </div>

      <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-foreground/5">
            <TableRow className="border-foreground/5 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Date</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Pay To</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Source Account</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Method</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11 text-right">Amount</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Reference</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-11 text-center">Lines</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-foreground/20">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Loading records...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-foreground/20">
                    <History className="h-8 w-8 opacity-40" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No disbursements recorded yet</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              payments.map(p => (
                <TableRow key={p.id} className={cn(
                  'border-foreground/5 hover:bg-foreground/[0.02] group transition-colors',
                  p.status === 'VOIDED' && 'opacity-50'
                )}>
                  <TableCell className="text-xs font-bold">
                    {dateFnsFormat(new Date(p.transaction_date), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell className="text-xs font-bold uppercase max-w-[120px] truncate">
                    {p.pay_to || '—'}
                  </TableCell>
                  <TableCell className="text-xs text-foreground/60 uppercase max-w-[140px] truncate">
                    {p.account_paid_from}
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-foreground/5 border border-foreground/10 px-2 py-0.5 rounded">
                      {p.method}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-black italic text-blue-400">
                    {formatPHP(p.amount)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground/50">
                    {p.reference_number || '—'}
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-center">
                    <span className="text-[10px] font-black text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded">
                      {p.allocations.length}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-blue-400/60 hover:text-blue-400 hover:bg-blue-400/10"
                        onClick={() => setViewing(p)}
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {p.status === 'POSTED' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-red-400/60 hover:text-red-400 hover:bg-red-400/10"
                          onClick={() => handleVoid(p.id)}
                          disabled={voidingId === p.id}
                          title="Void payment"
                        >
                          {voidingId === p.id
                            ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            : <Ban className="h-3.5 w-3.5" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] font-black uppercase border-foreground/10 bg-foreground/5"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] font-black uppercase border-foreground/10 bg-foreground/5"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ViewPaymentDialog payment={viewing} open={!!viewing} onClose={() => setViewing(null)} />
    </div>
  );
}

// ─── Main Dialog ──────────────────────────────────────────────────────────────

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
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [historyKey, setHistoryKey] = useState(0);

  const resetForm = () => {
    setTransactionDate(new Date());
    setPayTo('');
    setAccountPaidFrom('');
    setJournalMemo('Direct Fund Allocation');
    setMethod('Cash');
    setAmount('0.00');
    setReferenceNumber('');
    setCheckNumber('');
    setAllocations([]);
  };

  const handleAddAllocation = () => {
    setAllocations(prev => [
      ...prev,
      { id: `alloc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, account: '', amount: '0.00', type: 'DR' },
    ]);
  };

  const handleAccountChange = (id: string, v: string) =>
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, account: v } : a));

  const handleAmountChange = (id: string, v: string) =>
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, amount: v } : a));

  const handleTypeChange = (id: string, v: 'CR' | 'DR') =>
    setAllocations(prev => prev.map(a => a.id === id ? { ...a, type: v } : a));

  const handleDeleteAllocation = (id: string) =>
    setAllocations(prev => prev.filter(a => a.id !== id));

  const totalAllocated = useMemo(
    () => allocations.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0),
    [allocations]
  );

  const isBalanced = Math.abs(Number(amount || 0) - totalAllocated) < 0.01;
  const canCommit = isBalanced && totalAllocated > 0 && !!accountPaidFrom && !!transactionDate;

  const sourceAccount = accounts.find(a => a.id === accountPaidFrom);
  const payeeAccount = accounts.find(a => a.id === payTo);

  const handleCommit = async () => {
    if (!canCommit) return;
    setSaving(true);
    try {
      const res = await fetch('/api/direct-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transaction_date: transactionDate?.toISOString(),
          pay_to: payeeAccount?.account_name || payTo || null,
          account_paid_from: sourceAccount?.account_name || accountPaidFrom,
          method,
          amount: parseFloat(amount),
          reference_number: referenceNumber || null,
          check_number: checkNumber || null,
          journal_memo: journalMemo,
          allocations,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Save failed');
      }

      toast.success('Disbursement committed successfully');
      resetForm();
      setHistoryKey(k => k + 1);
      setActiveTab('history');
    } catch (e: any) {
      toast.error(e.message || 'Failed to save disbursement');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={openDialogs['enter-direct-payments']}
      onOpenChange={(open) => !open && closeDialog('enter-direct-payments')}
    >
      <DialogContent className="max-w-6xl p-0 overflow-hidden bg-background/98 border-foreground/10 backdrop-blur-3xl shadow-2xl flex flex-col h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-foreground/5 bg-foreground/5 flex items-center justify-between relative shrink-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-400/20 text-blue-400 border border-blue-400/20 shadow-[0_0_20px_rgba(96,165,250,0.1)]">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase text-foreground leading-none">
                Direct Disbursement
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-400/20 text-blue-400 border border-blue-400/20">
                  Instant Liquidity
                </span>
                <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                  Transaction Module v3.2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-8 pt-4 shrink-0">
            <TabsList className="bg-foreground/5 border border-foreground/10">
              <TabsTrigger value="new" className="text-[10px] font-black uppercase tracking-widest gap-1.5 data-[state=active]:bg-blue-400/20 data-[state=active]:text-blue-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> New Disbursement
              </TabsTrigger>
              <TabsTrigger value="history" className="text-[10px] font-black uppercase tracking-widest gap-1.5 data-[state=active]:bg-foreground/10">
                <History className="h-3.5 w-3.5" /> Payment History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── New Disbursement ──────────────────────────────────────────────── */}
          <TabsContent value="new" className="flex-1 flex flex-col overflow-hidden mt-0">
            <ScrollArea className="flex-1">
              <div className="p-8 space-y-8">
                {/* Summary Cards */}
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
                      {sourceAccount?.account_name || 'IDENTIFY SOURCE'}
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
                        'text-3xl font-black italic tracking-tighter transition-colors',
                        isBalanced ? 'text-emerald-400' : 'text-amber-400'
                      )}>
                        {(Number(amount || 0) - totalAllocated).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left — Capture Parameters */}
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
                                <span className="font-bold text-xs uppercase tracking-tighter">
                                  {transactionDate ? format(transactionDate, 'MMM dd, yyyy') : 'Select Date'}
                                </span>
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
                          <Input
                            className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs"
                            value={checkNumber}
                            onChange={(e) => setCheckNumber(e.target.value)}
                            placeholder="SN-000000"
                            disabled={method !== 'Check'}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right — Fund Distribution */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Fund Distribution</h3>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-6 rounded-2xl space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Reference Protocol</Label>
                          <Input
                            className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl font-mono text-xs"
                            value={referenceNumber}
                            onChange={(e) => setReferenceNumber(e.target.value)}
                            placeholder="EXT-REF-000"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Aggregate Value</Label>
                          <Input
                            className="bg-foreground/5 border-foreground/10 text-blue-400 rounded-xl font-black italic text-sm"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Journal Commentary</Label>
                        <Textarea
                          className="bg-foreground/5 border-foreground/10 text-foreground rounded-xl min-h-[142px] resize-none text-sm placeholder:text-foreground/10"
                          value={journalMemo}
                          onChange={(e) => setJournalMemo(e.target.value)}
                          placeholder="Add line-item particulars and audit notes..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Allocation Matrix */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-emerald-400 rounded-full" />
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-foreground">Expense Distribution Matrix</h3>
                    </div>
                    <Button
                      onClick={handleAddAllocation}
                      variant="outline"
                      className="rounded-xl bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="font-black uppercase tracking-widest text-[10px]">Initialize Allocation</span>
                    </Button>
                  </div>

                  <div className="bg-foreground/5 border border-foreground/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <Table>
                      <TableHeader className="bg-foreground/5">
                        <TableRow className="border-foreground/5 hover:bg-transparent">
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12">Target Ledger Account</TableHead>
                          <TableHead className="w-48 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-right">Allocated Value</TableHead>
                          <TableHead className="w-32 text-[10px] font-black uppercase tracking-widest text-foreground/40 h-12 text-center">Type</TableHead>
                          <TableHead className="w-16" />
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
                              <TableCell>
                                <Select value={row.account} onValueChange={(v) => handleAccountChange(row.id, v)}>
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
                                <Input
                                  type="number"
                                  value={row.amount}
                                  onChange={(e) => handleAmountChange(row.id, e.target.value)}
                                  className="bg-transparent border-0 shadow-none text-right text-emerald-400 font-black italic h-8 text-sm focus:ring-0"
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center">
                                  <Select value={row.type} onValueChange={(v) => handleTypeChange(row.id, v as 'CR' | 'DR')}>
                                    <SelectTrigger className={cn(
                                      'w-20 mx-auto h-8 rounded-lg text-[10px] font-black tracking-widest uppercase border transition-all focus:ring-0 shadow-none',
                                      row.type === 'DR' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'
                                    )}>
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

            {/* Footer */}
            <div className="px-8 py-6 border-t border-foreground/5 bg-foreground/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Protocol Integrity</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      isBalanced && totalAllocated > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-foreground/10'
                    )} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
                      {isBalanced && totalAllocated > 0 ? 'Ledger Verified' : 'Drift Detected'}
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
                <Button
                  variant="outline"
                  onClick={() => closeDialog('enter-direct-payments')}
                  className="px-6 h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 text-foreground/60 hover:text-foreground transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCommit}
                  disabled={!canCommit || saving}
                  className="px-10 rounded-xl bg-blue-400 hover:bg-blue-400/90 text-black font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-400/20 transition-all gap-2 disabled:opacity-40"
                >
                  {saving
                    ? <RefreshCw className="h-4 w-4 animate-spin" />
                    : <ShieldCheck className="h-4 w-4" />}
                  {saving ? 'Committing...' : 'Commit Disbursement'}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* ── History Tab ───────────────────────────────────────────────────── */}
          <TabsContent value="history" className="flex-1 overflow-hidden mt-0">
            <ScrollArea className="h-full">
              <div className="p-8">
                <PaymentHistoryTab key={historyKey} />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
